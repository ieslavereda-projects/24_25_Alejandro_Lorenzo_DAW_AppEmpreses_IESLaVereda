import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Home.scss";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.get("/api/user")
      .then(({ data }) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const isLoggedIn = user && user.name;

  return (
    <div className="home-container col-12 col-md-6 m-auto mt-md-5">
      {!isLoggedIn && (
        <div className="m-auto">
          <h1>Inicio</h1>
          <p>No has iniciado sesión</p>
          <Link to="/login"><button>Iniciar Sesión</button></Link>
        </div>
      )}

      {isLoggedIn && (
        <>
          <div className="title text-center">
            <h1 className="text-truncate">Bienvenido, {user.name}</h1>
          </div>

          {user.is_admin && (
            <>
              <Link to="/user-menu" className="container">
                <div className="icon icon-users"></div>
                <span>Usuarios</span>
              </Link>
              <Link to="/company-menu" className="container">
                <div className="icon icon-comp"></div>
                <span>Empresas</span>
              </Link>
            </>
          )}

          {(user.is_tutor || user.is_admin) && (
            <>
              <Link to="/import-tutors" className="container">
                <div className="icon icon-excel"></div>
                <span>Importar</span>
              </Link>
              <Link to="/profile" className="container">
                <div className="icon icon-user"></div>
                <span>Mi Zona</span>
              </Link>
            </>
          )}

          <Link to="/companies" className="container title">
            <div className="icon icon-comp"></div>
            <span>Ver empresas</span>
          </Link>
        </>
      )}
    </div>
  );
};


export default Home;
