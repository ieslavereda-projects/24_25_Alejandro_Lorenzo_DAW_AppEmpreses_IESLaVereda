import { Link } from "react-router-dom"
import "../styles/Navbar.scss"

const Navbar = () => {
  return (
    <nav className="d-flex justify-content-start align-items-center bg-dark text-white p-3 gap-2">
      <Link to="/">Inicio</Link> | <Link to="/users">Gestionar ususarios</Link>
    </nav>
  )
}

export default Navbar
