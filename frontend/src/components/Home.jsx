import React, { useEffect, useState } from "react";
import axios from "axios";
import Messagebar from "./Messagebar";
import io from "socket.io-client";

function Home() {
  const [formObj, setFormObj] = useState({
    name: "",
  });
  const [emailForm, setEmailForm] = useState({
    email: "",
    subject: "",
    text: "",
  });
  const [popup, setPopup] = useState({
    show: undefined,
    message: "",
    tag: "",
  });
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/socket")
      .then((res) => {
        setCollection(res.data);
        // console.log(res.data);
      })
      .catch((err) => {
        setPopup({
          ...popup,
          show: false,
          tag: "error",
          message: err.response.data,
        });
        setTimeout(() => {
          setPopup({
            ...popup,
            show: undefined,
          });
        }, 2000);
      });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", function () {
      // console.log("connected");
    });

    // to subcribe to a topic
    socket.on("NEWDATA", function (newData) {
      // console.log(newData);
      setCollection((prev) => [newData, ...prev]);
    });

    socket.on("disconnect", function (message) {
      // console.log("Socket disconnected from server: ", message);
    });

    return () => {
      socket.close();
    };
    // eslint-disable-next-line
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/v1/socket", {
        name: formObj.name,
      })
      .then((result) => {
        setFormObj({
          name: "",
        });
        console.log(result);
        setPopup({
          ...popup,
          show: true,
          tag: "success",
          message: "Name added Successfully",
        });
        setTimeout(() => {
          setPopup({
            ...popup,
            show: undefined,
          });
        }, 2000);
      })
      .catch((err) => {
        console.log(err.response.data);
        setPopup({
          ...popup,
          show: false,
          tag: "error",
          message: err.response.data,
        });
        setTimeout(() => {
          setPopup({
            ...popup,
            show: undefined,
          });
        }, 2000);
      });
  };

  const handleEmailSubmit = (a) => {
    a.preventDefault();
    console.log(emailForm);
    axios
      .post("http://localhost:5000/api/v1/sendemail", {
        email: emailForm.email,
        subject: emailForm.subject,
        text: emailForm.text,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {popup.show === true ? (
        <Messagebar message={popup.message} tag={popup.tag} />
      ) : (
        ""
      )}
      {popup.show === false ? (
        <Messagebar message={popup.message} tag={popup.tag} />
      ) : (
        ""
      )}
      <div className="container mt-5">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              What's your Good Name:
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name (Representing Socket.io)"
              value={formObj.name}
              onChange={(e) => {
                return setFormObj({ ...formObj, name: e.target.value });
              }}
            />
          </div>
          <button type="submit" className="btn btn-dark">
            Submit
          </button>
        </form>
        <div className="container mt-4">
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {collection?.map((item, i) => (
              <div key={i} style={{ minWidth: "200px" }} className="m-2">
                <div className="card">
                  <div className="card-body">{item.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="container mt-5">
          <form onSubmit={handleEmailSubmit}>
            <div className="row mb-3">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Email
              </label>
              <div className="col-sm-10">
                <input
                  type="email"
                  placeholder="Enter email to whom you want to send"
                  className="form-control"
                  id="inputEmail3"
                  value={emailForm.email}
                  onChange={(e) => {
                    return setEmailForm({
                      ...emailForm,
                      email: e.target.value,
                    });
                  }}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="inputPassword3"
                className="col-sm-2 col-form-label"
              >
                Subject
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  placeholder="Enter Your Subject"
                  className="form-control"
                  id="inputPassword3"
                  value={emailForm.subject}
                  onChange={(e) => {
                    return setEmailForm({
                      ...emailForm,
                      subject: e.target.value,
                    });
                  }}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="inputPassword3"
                className="col-sm-2 col-form-label"
              >
                Text
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  placeholder="Enter Your Comment..."
                  className="form-control"
                  id="inputPassword3"
                  value={emailForm.text}
                  onChange={(e) => {
                    return setEmailForm({
                      ...emailForm,
                      text: e.target.value,
                    });
                  }}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success">
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Home;
