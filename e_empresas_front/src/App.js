import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import CompanyManager from "./pages/CompanyManager";
import UserManager from "./pages/UserManager";
import CompaniesList from "./components/CompaniesList";
import CompanyDetail from "./components/CompanyDetail";
import ImportTutorsForm from "./components/ImportTutorsForm";
import Profile from "./pages/Profile";
import ImportCompanies from "./components/ImportCompanies";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/companies" element={<CompaniesList />} />
        <Route path="/companies/:id" element={<CompanyDetail />} />

        <Route
          path="/user-menu"
          element={
            <ProtectedRoute
              requiredRoles={["admin"]}
              element={<UserManager />}
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

        <Route
          path="/import-tutors"
          element={
            <ProtectedRoute
              requiredRoles={["admin", "tutor"]}
              element={
                <>
                  <ImportTutorsForm />
                  <ImportCompanies />
                </>
              }
            />
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute
              requiredRoles={["admin", "tutor"]}
              element={<Profile />}
            />
          }
        />

        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
