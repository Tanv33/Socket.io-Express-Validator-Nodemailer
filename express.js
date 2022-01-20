import express from "express";
import cors from "cors";
import { check, validationResult } from "express-validator";
import connectWithDataBase from "./database.js";
import Name from "./models/name.js";
import { Server } from "socket.io";
import { createServer } from "http";
import nodemailer from "nodemailer";

const app = express();
const PORT = 5000;
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: "*" } });

connectWithDataBase();
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

//  Route 1
app.get("/", (req, res) => res.send("Hello World!"));

//  Route 2 -- Socket && Express Validator
app.post(
  "/api/v1/socket",
  //express Validator
  [
    check("name")
      .notEmpty()
      .withMessage("Name Should not be empty")
      .isLength({ min: 3 })
      .withMessage("Name Should be 3 characters Long")
      .isLength({ max: 125 })
      .withMessage("Name Should not be greater than 125 words"),
  ],
  async (req, res) => {
    try {
      const { name } = req.body;
      const error = validationResult(req);
      if (!error.isEmpty()) {
        const errorMsg = error.errors[0].msg;
        return res.status(400).send(errorMsg);
      }

      let data = await new Name({
        name,
      });
      let savedData = await data.save();
      if (savedData.length < 0) {
        // console.log(savedData);
        return res.status(500).send("Some Error Occurred");
      } else {
        res.send(savedData);
        io.emit("NEWDATA", savedData);
      }
    } catch (error) {
      //   console.log(error.message);
      return res.status(500).send("Internal Server Error");
    }
  }
);

//  Route 3 -- Sending All Data
app.get("/api/v1/socket", async (req, res) => {
  try {
    let getAllData = await Name.find({}).sort({ _id: "desc" });
    if (getAllData.length < 0) {
      return res.status(404).send("No Data Found");
    } else {
      res.send(getAllData);
    }
  } catch (error) {
    // console.log(error.messsage);
    return res.status(500).send("Internal Server Error");
  }
});

// Route -- Node mailer
app.post("/api/v1/sendemail", async (req, res) => {
  try {
    const { email, subject, text } = req.body;
    console.log(req.body);
    // let testAccount = await nodemailer.createTestAccount();
    // let transporter = await nodemailer.createTransport({
    //   host: "smtp.ethereal.email",
    //   port: 587,
    //   secure: false, // true for 465, false for other ports
    //   auth: {
    //     user: testAccount.user, // generated ethereal user
    //     pass: testAccount.pass, // generated ethereal password
    //     // user: "wendy.windler36@ethereal.email", // generated ethereal user
    //     // pass: "Q2aD4MtTRQat28yvFF", // generated ethereal password
    //   },
    // });
    // let info = await transporter.sendMail({
    //   // from: '"Fred Foo 👻" <foo@example.com>', // sender address
    //   // to: "bar@example.com, baz@example.com", // list of receivers
    //   // subject: "Hello ✔", // Subject line
    //   // text: "Hello world?", // plain text body
    //   // html: "<b>Hello world?</b>", // html body
    //   from: "wendy.windler36@ethereal.email", // sender address
    //   to: email, // list of receivers
    //   subject: subject, // Subject line
    //   text: text, // plain text body
    //   html: `<b>${text}</b>`, // html body
    // });
    // console.log("Message sent: %s", info.messageId);
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "",
        pass: "",
      },
    });
    const option = {
      from: "",
      to: email,
      subject: subject,
      text: text,
    };
    transport.sendMail(option, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        if (info) {
          console.log(info);
        }
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});
// app.listen(port, () =>
//   console.log(`Example app listening on port http://localhost:${port}`)
// );

io.on("connection", (socket) => {
  console.log("New client connected with id: ", socket.id);

  // to emit data to a certain client
  // socket.emit("topic 1", "some data");

  // collecting connected users in a array
  // connectedUsers.push(socket)

  socket.on("disconnect", (message) => {
    console.log("Client disconnected with id: ", message);
  });
});

server.listen(PORT, function () {
  console.log(`server is running on http://localhost:${PORT}`);
});
