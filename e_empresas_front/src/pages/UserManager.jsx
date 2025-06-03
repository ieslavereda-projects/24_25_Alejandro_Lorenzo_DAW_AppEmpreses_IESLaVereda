import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/UserManager.scss';
import ImportTutorsForm from '../components/ImportTutorsForm';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;
const token = localStorage.getItem('authToken');
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const initialForm = {
    name: '',
    email: '',
    password: '',
    is_admin: false,
    is_tutor: false,
    is_student: false,
    study_cycle: '',
    nia: '',
    nif: '',
    gender: '',
};

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('/api/users');
            setUsers(data);
        } catch {
            setMessage('Error al cargar usuarios');
        }
    };

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
        setErrors(e => ({ ...e, [name]: null }));
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Nombre obligatorio';
        if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) errs.email = 'Email inválido';
        if (!editId && form.password.length < 4) errs.password = 'Mínimo 4 caracteres';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setErrors({});

        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }

        const payload = { ...form };
        if (!payload.is_student) {
            payload.nia = '';
        }

        try {
            let response;
            if (editId) {
                response = await axios.put(`/api/users/${editId}`, payload);
            } else {
                response = await axios.post('/api/users', payload);
            }


            setMessage(editId ? 'Usuario actualizado' : 'Usuario creado');
            setForm(initialForm);
            setEditId(null);
            fetchUsers();

        } catch (err) {
            if (err.response?.status === 422) {
                console.log('Errores de validación:', err.response.data.errors);
                setErrors(err.response.data.errors);
                setMessage('Corrige los errores del formulario');
            } else {
                console.error('Error inesperado:', err.response || err);
                setMessage(err.response?.data?.message || 'Error al guardar');
            }
        }
    };

    const handleEdit = user => {
        setForm({ ...user, password: '' });
        setEditId(user.id);
        setMessage('');
        setErrors({});
    };

    const handleDelete = async id => {
        if (!window.confirm('¿Eliminar usuario?')) return;
        try {
            await axios.delete(`/api/users/${id}`);
            setMessage('Usuario eliminado');
            fetchUsers();
        } catch {
            setMessage('Error al eliminar');
        }
    };

    const cancelEdit = () => {
        setForm(initialForm);
        setEditId(null);
        setMessage('');
        setErrors({});
    };

    return (
        <div className="user-manager col-12 col-md-10 d-flex flex-wrap">

            <section className='container col-12'>

                <section>
                <h2>{editId ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>

                    <form onSubmit={handleSubmit} className="user-form d-flex flex-column d-sm-grid">
                        <div className="form-group">
                            <label htmlFor="name">Nombre</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                            />
                            {errors.name && <small className="error">{errors.name[0]}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                            />
                            {errors.email && <small className="error">{errors.email[0]}</small>}
                        </div>

                        {!editId && (
                            <div className="form-group">
                                <label htmlFor="password">Contraseña</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                />
                                {errors.password && <small className="error">{errors.password[0]}</small>}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Roles</label>
                            <div className="checkbox-group">
                                <label>
                                    <input
                                        name="is_admin"
                                        type="checkbox"
                                        checked={form.is_admin}
                                        disabled={form.is_student}
                                        onChange={handleChange}
                                    /> Admin
                                </label>
                                <label>
                                    <input
                                        name="is_tutor"
                                        type="checkbox"
                                        checked={form.is_tutor}
                                        disabled={form.is_student}
                                        onChange={handleChange}
                                    /> Tutor
                                </label>
                                <label>
                                    <input
                                        name="is_student"
                                        type="checkbox"
                                        checked={form.is_student}
                                        disabled={form.is_admin || form.is_tutor}
                                        onChange={handleChange}
                                    /> Estudiante
                                </label>
                            </div>
                            {errors.roles && <small className="error">{errors.roles[0]}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="study_cycle">Curso</label>
                            <select
                                id="study_cycle"
                                name="study_cycle"
                                value={form.study_cycle}
                                onChange={handleChange}
                            >
                                <option value="">Seleccionar</option>
                                <option value="DAW">DAW</option>
                                <option value="DAM">DAM</option>
                                <option value="ASIR">ASIR</option>
                                <option value="ESTETICA">ESTÉTICA</option>
                            </select>
                            {errors.study_cycle && <small className="error">{errors.study_cycle[0]}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="nia">NIA</label>
                            <input
                                id="nia"
                                name="nia"
                                type="number"
                                value={form.is_student ? form.nia : ''}
                                onChange={handleChange}
                                disabled={!form.is_student}
                            />

                            {errors.nia && <small className="error">{errors.nia[0]}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="nif">NIF</label>
                            <input
                                id="nif"
                                name="nif"
                                type="text"
                                value={form.nif}
                                onChange={handleChange}
                            />
                            {errors.nif && <small className="error">{errors.nif[0]}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="gender">Género</label>
                            <select
                                id="gender"
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                            >
                                <option value="">Seleccionar</option>
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                                <option value="no_binario">No binario</option>
                                <option value="trans_masculino">Hombre trans</option>
                                <option value="trans_femenino">Mujer trans</option>
                                <option value="genero_fluido">Género fluido</option>
                                <option value="agenero">Agénero</option>
                                <option value="bigenero">Bigénero</option>
                                <option value="otro">Otro</option>
                                <option value="prefiero_no_decirlo">Prefiero no decirlo</option>
                            </select>

                            {errors.gender && <small className="error">{errors.gender[0]}</small>}
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="primary">
                                {editId ? 'Actualizar' : 'Crear'}
                            </button>
                            {editId && (
                                <button type="button" onClick={cancelEdit} className="secondary">
                                    Cancelar
                                </button>
                            )}
                        </div>

                        {message && <p className="message">{message}</p>}
                    </form>
                </section>

                <section>
                    <ImportTutorsForm />
                </section>
            </section>
            
            <section className='container col-12 col-md-6'>


                <h3>Usuarios Registrados</h3>
                <div className="table-wrapper">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Roles</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => {
                                const roles = [];
                                if (u.is_admin) roles.push('Admin');
                                if (u.is_tutor) roles.push('Tutor');
                                if (u.is_student) roles.push('Estudiante');
                                return (
                                    <tr key={u.id}>
                                        <td>{u.name}</td>
                                        <td>{roles.join(', ')}</td>
                                        <td>
                                            <button className='edit p-0' onClick={() => handleEdit(u)}>Editar</button>
                                            <button className='delete p-0' onClick={() => handleDelete(u.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>


        </div>
    );
};

export default UserManager;
