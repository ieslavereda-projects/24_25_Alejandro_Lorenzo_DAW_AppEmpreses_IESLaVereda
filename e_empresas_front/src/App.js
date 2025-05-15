import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import ImportTutors from "./pages/ImportTutors";
import UserForm from "./components/UserForm";
import ViewUser from "./components/ViewUser";
import EditUser from "./components/EditUser";
import CompanyManager from "./pages/CompanyManager";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/user-menu"
          element={
            <ProtectedRoute requiredRoles={["admin"]} element={<UserPage />} />
          }
        />

        <Route
          path="/users/:id"
          element={
            <ProtectedRoute requiredRoles={["admin"]} element={<ViewUser />} />
          }
        />

        <Route
          path="/users/:id/edit"
          element={
            <ProtectedRoute requiredRoles={["admin"]} element={<EditUser />} />
          }
        />

        <Route
          path="/add-user"
          element={
            <ProtectedRoute requiredRoles={["admin"]} element={<UserForm />} />
          }
        />

        <Route
          path="/import-tutors"
          element={
            <ProtectedRoute
              requiredRoles={["admin"]}
              element={<ImportTutors />}
            />
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
