import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Home.scss";

const Home = () => {

  const [user, setUser] = useState("usuario");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    axios.get("/api/user")
      .then(({ data }) => setUser(data))
      .catch(() => setUser("usuario"));
  }, []);

  const isLoggedIn = user;

  return (
    <>
      <div className="home-container col-12 col-md-6 m-auto mt-md-5 ">
        {!isLoggedIn &&
          <div className="m-auto">
            <h1>Inicio</h1>
            <p>No has iniciado Sesión</p>
            <Link to="/login"><button>Iniciar Sesión</button></Link>
          </div>
        }
        {isLoggedIn &&
          <>
            {user.name ? (
              <div className="title text-center">
                <h1 className="text-truncate">Bienvenido, {user.name}</h1>
              </div>
            ) : (
              <div className="title text-center">
                <p className="text-truncate">Cargando...</p>
              </div>
            )}


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

            {user.is_tutor && (
              <>
                <Link to="/import-tutors" className="container">
                  <div className="icon icon-excel"></div>
                  <span>Importar tutores</span>
                </Link>
                <Link to="/profile" className="container">
                  <div className="icon icon-user"></div>
                  <span>Mi Zona</span>
                </Link>
              </>
            )}

            {(user.is_student || user.is_tutor) && (
              <Link to="/companies" className="container title">
                <div className="icon icon-comp"></div>
                <span>Ver empresas</span>
              </Link>
            )}
          </>
        }
      </div>


    </>
  );

};

export default Home;
