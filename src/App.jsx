import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./components/pages/Auth/Register";
import Login from "./components/pages/Auth/Login";
import Home from "./components/pages/Home";
import Problems from "./components/pages/problems/Problems";
import ProblemPage from "./components/pages/problems/ProblemPage";
import AdminRoute from "./components/pages/Auth/AdminRoute";
import AdminDashboard from "./components/pages/Admin/AdminDashboard";
import CreateProblem from "./components/pages/problems/CreateProblem";
import NotFound from "./components/pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/problemset" element={<Problems />} />
        <Route path="/problems/:id" element={<ProblemPage />} />

        {/* Admin-only Route */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="/newproblem" element={<CreateProblem />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
