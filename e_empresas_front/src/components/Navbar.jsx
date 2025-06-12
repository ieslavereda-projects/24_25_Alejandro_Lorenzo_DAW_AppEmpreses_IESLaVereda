import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Navbar.scss";
import LogoutButton from "./Logout";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axios
      .get("/api/user")
      .then(({ data }) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const isLoggedIn = !!user;

  return (
    <>
      {isLoggedIn && (
        <nav className="navbar bg-dark p-3">
          <div className="navbar__logo d-flex align-items-center gap-3"><div className="logo"></div>E_EMPRESAS</div>

          <div
            className="navbar__toggle"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            ☰
          </div>

          <div className={`navbar__links ${isMenuOpen ? "active" : ""}`}>

            {!isLoggedIn && (
              <Link title="Iniciar sesión" to="/login">
                <button>Iniciar Sesión</button>
              </Link>
            )}

            {isLoggedIn && (
              <>

                <Link title="Inicio" to="/" className="navbar__link">
                  <div className="icon icon-home"></div><div className="ms-3 fw-bold text-truncate text-uppercase">Inicio</div>
                </Link>

                {user.is_admin && (
                  <>
                    <Link title="Gestionar Usuarios" to="/user-menu" className="navbar__link">
                      <div className="icon icon-user"></div><div className="ms-3 fw-bold text-truncate text-uppercase">Gestionar Usuarios</div>
                    </Link>
                    <Link title="Gestionar Empresas" to="/company-menu" className="navbar__link">
                      <div className="icon icon-comp"></div><div className="ms-3 fw-bold text-truncate text-uppercase">Gestionar Empresas</div>
                    </Link>
                  </>
                )}

                {(user.is_tutor || user.is_admin) && (
                  <>
                    <Link title="Importar usuarios o empresas con excel" to="/import-tutors" className="navbar__link">
                      <div className="icon icon-import"></div><div className="ms-3 fw-bold text-truncate text-uppercase">Importar por Excel</div>
                    </Link>
                    <Link title="Mi zona" to="/profile" className="navbar__link">
                      <div className="icon icon-profile"></div><div className="ms-3 fw-bold text-truncate text-uppercase">Mi zona</div>
                    </Link>
                  </>
                )}

                <Link title="Ver empresas" to="/companies" className="navbar__link">
                  <div className="icon icon-comp"></div><div className="ms-3 fw-bold text-truncate text-uppercase">Empresas</div>
                </Link>

                <LogoutButton />
                
              </>
            )}
          </div>
        </nav>
      )}


    </>

  );
};

export default Navbar;
