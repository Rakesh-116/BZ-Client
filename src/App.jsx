import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./components/pages/Auth/Register";
import Login from "./components/pages/Auth/Login";
import Home from "./components/pages/Home";
import Problems from "./components/pages/problems/Problems";
import ProblemPage from "./components/pages/problems/ProblemPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/problemset" element={<Problems />} />
        <Route path="/problems/:id" element={<ProblemPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
