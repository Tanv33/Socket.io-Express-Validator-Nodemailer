import React from "react";

function Messagebar({ message, tag }) {
  if (tag === "success") {
    return (
      <div
        className="alert alert-success position-absolute top-0 start-0 w-100"
        role="alert"
      >
        {message}
      </div>
    );
  }

  if (tag === "error") {
    return (
      <div
        className="alert alert-danger position-absolute top-0 start-0 w-100"
        role="alert"
      >
        {message}
      </div>
    );
  } else {
    return <></>;
  }
}

export default Messagebar;
