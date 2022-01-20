import { Link } from "react-router-dom";
import React from "react";

function Navbar() {
  return (
    <div>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Demo
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
