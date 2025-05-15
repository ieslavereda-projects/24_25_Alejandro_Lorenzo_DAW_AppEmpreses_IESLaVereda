import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import CompanyManager from "./pages/CompanyManager";
import UserManager from "./pages/UserManager";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/user-menu"
          element={
            <ProtectedRoute requiredRoles={["admin"]} element={<UserManager />} />
          }
        />

        <Route
          path="/company-menu"
          element={
            <ProtectedRoute
              requiredRoles={["admin"]}
              element={<CompanyManager />}
            />
          }
        />

        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
