import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Navbar.scss";
import LogoutButton from "./Logout";

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    axios.get("/api/user")
      .then(({ data }) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const isLoggedIn = !!user;

  return (
    <nav className="navbar">
      <div className="navbar__logo">AppEmpreses</div>
      <div className="navbar__links">
        <Link to="/" className="navbar__link">Inicio</Link>

        {!isLoggedIn && (
          <Link to="/login" className="navbar__link">Iniciar Sesión</Link>
        )}

        {isLoggedIn && (
          <>
            {user.is_admin && (
              <>
                <Link to="/user-menu" className="navbar__link">Usuarios</Link>
                <Link to="/company-menu" className="navbar__link">Empresas</Link>
              </>
            )}

            {user.is_tutor && (
              <>
                <Link to="/import-tutors" className="navbar__link">Importar Tutores</Link>
                <Link to="/profile" className="navbar__link">Mi Perfil</Link>
              </>
            )}

            {user.is_student && (
              <Link to="/companies" className="navbar__link">Ver empresas</Link>
            )}

            <LogoutButton />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
