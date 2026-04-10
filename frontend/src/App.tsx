import { Route, Routes } from "react-router-dom";
import { Organization } from "./pages/Organization";
import { ToastContainer } from "react-toastify";
import { Board } from "./pages/Board";
import { Card } from "./pages/Card";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="h-screen">
      <ToastContainer position="bottom-right" />
      <Routes>
        <Route index element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/organization" element={<Dashboard />}>
            <Route path="/dashboard/organization" element={<Organization />} />
            <Route
              path="/dashboard/organization/:orgId/board"
              element={<Board />}
            />
            <Route
              path="/dashboard/organization/:orgId/board/:boardId"
              element={<Card />}
            />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
