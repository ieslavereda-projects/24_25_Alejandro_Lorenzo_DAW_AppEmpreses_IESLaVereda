import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.scss";
import LogoutButton from "./Logout";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar__logo">AppEmpreses</div>
      <div className="navbar__links">
        <Link to="/" className="navbar__link">Inicio</Link>

        {!isLoggedIn &&(
          <>
            <Link to="/login" className="navbar__link">Iniciar Sesión</Link>
          </>
        )
        }

        {isLoggedIn && (
          <>
            <Link to="/import-tutors" className="navbar__link">Importar Tutores</Link>
            <Link to="/user-menu" className="navbar__link">Usuarios</Link>
            <Link to="/company-menu" className="navbar__link">Empresas</Link>
            <LogoutButton />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
