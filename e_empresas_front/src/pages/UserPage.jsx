import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/UserPage.scss';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

const UsersMenu = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (err) {
      setError('Error al cargar los usuarios');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      alert('Error al eliminar el usuario');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className='user-menu-container'>
      <h2>Gestión de Usuarios</h2>
      <div className='add-user'>
        <a href="/add-user" >Añadir Usuario</a>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {users.length === 0 ? (
        <p>No hay usuarios.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr className='hover' key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className='actions'>
                  <a href={`/users/${user.id}`} className='see'>Ver</a>
                  <a href={`/users/${user.id}/edit`} className='edit'>Editar</a>
                  <button onClick={() => deleteUser(user.id)} className='delete'>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersMenu;
