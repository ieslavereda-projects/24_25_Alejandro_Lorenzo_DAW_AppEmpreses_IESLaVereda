import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CompanyManager.scss';
import ImportCompanies from '../components/ImportCompanies';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
const initialForm = {
    name: '',
    manager: '',
    phone: '',
    email: '',
    address: '',
    website: '',
    industry: '',
    observations: '',
    allows_erasmus: false,
};

const CompanyManager = () => {
    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState(initialForm);
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const getCsrfToken = async () => {
            await axios.get('/sanctum/csrf-cookie');
        };
        getCsrfToken();
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const { data } = await axios.get('/api/companies');
            setCompanies(data);
        } catch (err) {
            setMessage('Error al cargar empresas');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setErrors(prev => ({ ...prev, [name]: null }));

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editId) {
                await axios.put(`/api/companies/${editId}`, formData);
                setMessage('Empresa actualizada');
            } else {
                await axios.post('/api/companies', formData);
                setMessage('Empresa creada');
            }

            setFormData(initialForm);
            setEditId(null);
            setErrors({});
            fetchCompanies();
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
                setMessage('Corrige los errores del formulario', errors);
            } else {
                setMessage('Error al guardar');
            }
        }

    };

    const handleEdit = (company) => {
        setFormData(company);
        setEditId(company.id);
        setMessage('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar empresa?')) return;
        try {
            await axios.delete(`/api/companies/${id}`);
            setMessage('Empresa eliminada');
            fetchCompanies();
        } catch (err) {
            setMessage('Error al eliminar');
        }
    };

    const cancelEdit = () => {
        setFormData(initialForm);
        setEditId(null);
        setMessage('');
    };

    return (
        <div className="company-manager col-12 col-md-10 d-flex flex-wrap">

            <section className='company-form-container col-12'>
                <h2>{editId ? 'Editar Empresa' : 'Crear Nueva Empresa'}</h2>

                <form onSubmit={handleSubmit} className="company-form d-flex flex-column d-xl-grid">
                    {[
                        { label: 'Nombre', name: 'name' },
                        { label: 'Manager', name: 'manager' },
                        { label: 'Teléfono/s', name: 'phone' },
                        { label: 'Email', name: 'email' },
                        { label: 'Dirección', name: 'address' },
                        { label: 'Ciclo/s', name: 'industry' },
                        { label: 'Observaciones', name: 'observations' },
                    ].map(({ label, name }) => (
                        <div key={name} className="form-group">
                            <label>{label}</label>
                            <input
                                type="text"
                                name={name}
                                value={formData[name] || ''}
                                onChange={handleChange}
                            />
                        </div>
                    ))}
                    <div className="form-group">
                        <label>Web</label>
                        <input
                            type="text"
                            name="website"
                            value={formData.website || ''}
                            onChange={handleChange}
                            className={errors.website ? 'error' : ''}
                        />
                        {errors.website && <small className="error-text">{errors.website[0]}</small>}
                    </div>


                    <div className="form-group checkbox">
                        <label>
                            <input
                                type="checkbox"
                                name="allows_erasmus"
                                checked={formData.allows_erasmus || false}
                                onChange={handleChange}
                            />
                            ¿Permite Erasmus?
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit">
                            {editId ? 'Actualizar' : 'Crear'}
                        </button>
                        {editId && <button type="button" onClick={cancelEdit}>Cancelar</button>}
                    </div>
                </form>

                <span>
                    {message && <p className="message">{message}</p>}
                </span>

                <section>
                    <ImportCompanies onImport={fetchCompanies} />
                </section>
                
            </section>

            <section className='companies col-12'>
                <h2>Empresas registradas</h2>
                <table className="company-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map(c => (
                            <tr key={c.id}>
                                <td>{c.name}</td>
                                <td className='text-wrap'>
                                    <button className='edit' onClick={() => handleEdit(c)}>Editar</button>
                                    <button className='delete' onClick={() => handleDelete(c.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>



        </div>
    );
};

export default CompanyManager;
