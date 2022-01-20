import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
