import { Routes, Route, Link } from "react-router";
import Home from "./pages/Home";

import "./App.css";

function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
