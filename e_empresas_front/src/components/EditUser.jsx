import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/UserForm.scss';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: '',
        email: '',
        nif: '',
        study_cycle: '',
        is_admin: false,
        is_tutor: false,
        is_student: false,
        nia: '',
        gender: '',
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUser({
            ...user,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!user.name) {
            setError('El nombre es obligatorio');
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', user.name);
        formData.append('email', user.email || '');
        formData.append('nif', user.nif || '');
        formData.append('study_cycle', user.study_cycle || '');
        formData.append('is_admin', user.is_admin ? '1' : '0');
        formData.append('is_tutor', user.is_tutor ? '1' : '0');
        formData.append('is_student', user.is_student ? '1' : '0');
        formData.append('nia', user.nia ? parseInt(user.nia, 10) : '');
        formData.append('gender', user.gender || '');
        formData.append('_method', 'PUT');

        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/users/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert('Usuario actualizado exitosamente');
            navigate(`/users/${id}`);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data.errors) {
                setError(Object.values(err.response.data.errors).join(', '));
            } else {
                setError('Error al actualizar el usuario');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="user-form-container">
            <form onSubmit={handleSubmit}>
                <h2>Editar Usuario</h2>

                {error && <div className="error">{error}</div>}

                <div className="form-group">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>NIF:</label>
                    <input
                        type="text"
                        name="nif"
                        value={user.nif}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Curso</label>
                    <select
                        name="study_cycle"
                        value={user.study_cycle}
                        onChange={handleChange}
                        required
                        className="form-control"
                    >
                        <option value="">Seleccionar</option>
                        <option value="DAW">DAW</option>
                        <option value="DAM">DAM</option>
                        <option value="ASIR">ASIR</option>
                        <option value="ESTETICA">ESTÉTICA</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Roles:</label>
                    <div className="checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="is_admin"
                                checked={user.is_admin}
                                onChange={handleChange}
                            />
                            Admin
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="is_tutor"
                                checked={user.is_tutor}
                                onChange={handleChange}
                            />
                            Tutor
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="is_student"
                                checked={user.is_student}
                                onChange={handleChange}
                            />
                            Estudiante
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label>NIA:</label>
                    <input
                        type="text"
                        name="nia"
                        value={user.nia}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Género:</label>
                    <select
                        name="gender"
                        value={user.gender}
                        onChange={handleChange}
                        required
                        className="form-control"
                    >
                        <option value="">Selecciona una opción</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>

                <div className="group">
                    <button type="submit" className="btn" disabled={isLoading}>
                        {isLoading ? 'Actualizando...' : 'Actualizar Usuario'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUser;
