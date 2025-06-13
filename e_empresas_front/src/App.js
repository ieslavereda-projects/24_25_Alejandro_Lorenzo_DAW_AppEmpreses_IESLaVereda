import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import CompanyManager from "./pages/CompanyManager";
import UserManager from "./pages/UserManager";
import CompaniesList from "./pages/CompaniesList";
import CompanyDetail from "./pages/CompanyDetail";
import ImportTutorsForm from "./components/ImportTutorsForm";
import Profile from "./pages/Profile";
import ImportCompanies from "./components/ImportCompanies";
import ScrollToTopButton from "./components/ScrollToTopButton";

function App() {
  return (
    <Router>
      {
        <div className="d-flex general">
          <Navbar />
          <div className="contenido-principal">
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
                        {
                          <div className="col-12 d-flex flex-wrap gap-5 container-fluid justify-content-center pt-5">
                            <ImportTutorsForm />
                            <ImportCompanies />
                          </div>
                        }
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
            <ScrollToTopButton />

          </div>
        </div>
      }
    </Router>
  );
}

export default App;
