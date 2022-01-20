import mongoose from "mongoose";

const connectWithDataBase = () => {
  mongoose.connect(
    "mongodb://localhost:27017/Socket?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false",
    () => {
      console.log("connected to mongoDB Database");
    }
  );
  mongoose.connection.on("error", (err) => {
    console.log(err);
  });
};
export default connectWithDataBase;
