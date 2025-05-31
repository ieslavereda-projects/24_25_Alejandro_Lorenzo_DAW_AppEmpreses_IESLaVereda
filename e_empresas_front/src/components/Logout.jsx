import axios from 'axios';

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
    <button onClick={handleLogout} className='align-self-start text-center'>
      Cerrar sesión
    </button>
  );
}
export default LogoutButton;

