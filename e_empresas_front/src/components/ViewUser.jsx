import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ViewUser.scss';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

const ViewUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        setUser(response.data);
      } catch (err) {
        setError('Error al cargar los detalles del usuario');
      }
    };
    fetchUser();
  }, [id]);

  const deleteUser = async () => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      await axios.delete(`/api/users/${id}`);
      alert('Usuario eliminado');
      navigate('/user-menu'); 
    } catch (err) {
      alert('Error al eliminar el usuario');
    }
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!user) {
    return <p>Cargando...</p>;
  }

  const roles = [];
  if (user.is_admin) roles.push('Admin');
  if (user.is_tutor) roles.push('Tutor');
  if (user.is_student) roles.push('Student');

  return (
    <div className='view-user-container'>
      <h2>Detalles del Usuario</h2>
      <div>
        <strong>Nombre:</strong> {user.name}
      </div>
      <div>
        <strong>Email:</strong> {user.email}
      </div>
      <div>
        <strong>NIF:</strong> {user.nif}
      </div>
      <div>
        <strong>Ciclo:</strong> {user.study_cycle}
      </div>
      <div>
        <strong>Roles:</strong> {roles.length ? roles.join(', ') : 'Sin roles'}
      </div>
      <div>
        <strong>NIA:</strong> {user.nia}
      </div>
      <div>
        <strong>Género:</strong> {user.gender}
      </div>
      
      <div className='actions'>
        <button
          onClick={() => navigate(`/users/${user.id}/edit`)}
          className='edit'
        >
          Editar
        </button>
        <button
          onClick={deleteUser}
          className='delete'
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ViewUser;
