import axios from 'axios';
import '../styles/Navbar.scss'

const LogoutButton = () => {

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', {}, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          Accept: 'application/json'
        }
      });

      localStorage.removeItem('authToken');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error al hacer logout:', error);
    }
  };


  return (
    <button title='Cerrar Sesión' onClick={handleLogout} className='align-self-start text-center bg-dark navbar__link p-0'>
      <div className="icon icon-logout"></div><div className="ms-3 fw-bold text-truncate text-uppercase">Cerrar sesión</div>
    </button>
  );
}
export default LogoutButton;

