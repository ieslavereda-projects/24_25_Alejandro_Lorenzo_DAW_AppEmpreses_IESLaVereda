import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.scss";
import LogoutButton from "./Logout";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__logo">AppEmpreses</div>
      <div className="navbar__links">
        <Link to="/" className="navbar__link">Inicio</Link>
        <Link to="/import-tutors" className="navbar__link">Importar Tutores</Link>
        <Link to="/user-menu" className="navbar__link">Usuarios</Link>
        <LogoutButton/>
      </div>
    </nav>
  );
};

export default Navbar;
