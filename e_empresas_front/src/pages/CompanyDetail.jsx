import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import '../styles/CompanyDetail.scss';
import StarRating from '../components/StarRating';
import { useParams } from 'react-router-dom';

const CompanyDetail = () => {
    const token = localStorage.getItem('authToken');
    const userId = parseInt(localStorage.getItem('userId'), 10);
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isTutor, setIsTutor] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isStudent, setIsStudent] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [tutorForm, setTutorForm] = useState({ comment: '' });

    const [tutorComments, setTutorComments] = useState([]);

    const [form, setForm] = useState({
        comment: '',
        rating: 3,
        would_recommend: true,
    });

    useEffect(() => {
        const tooltipTrigger = document.getElementById('popover');

        if (tooltipTrigger && window.bootstrap?.Tooltip) {
            const tooltip = new window.bootstrap.Tooltip(tooltipTrigger);

            return () => tooltip.dispose();
        }
    }, []);

    useEffect(() => {
        axios.get(`/api/companies/${id}`)
            .then(({ data }) => setCompany(data));

        axios.get(`/api/companies/${id}/reviews`)
            .then(({ data }) => setReviews(data))
            .catch(err => console.error('Error al cargar comentarios:', err));
    }, [id]);

    useEffect(() => {
        axios.get(`/api/companies/${id}`)
            .then(({ data }) => setCompany(data));

        axios.get(`/api/companies/${id}/reviews`)
            .then(({ data }) => setReviews(data))
            .catch(err => console.error('Error al cargar comentarios:', err));

        axios.get(`/api/users/${userId}`)
            .then(({ data }) => {
                setIsTutor(data.is_tutor);
                setIsAdmin(data.is_admin);
                setIsStudent(data.is_student);
                if (data.is_tutor) {
                    axios.get(`/api/companies/${id}/tutor-comments`)
                        .then(({ data }) => setTutorComments(data))
                        .catch(err => console.error('Error al cargar comentarios de tutor:', err));
                }
            })
            .catch(err => console.error('Error al comprobar rol de usuario:', err));
    }, [id, userId]);


    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({
            ...f,
            [name]: type === 'checkbox'
                ? checked
                : (['rating', 'work_environment', 'mentoring', 'learning_value'].includes(name)
                    ? parseInt(value, 10)
                    : value
                )
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        const { comment, rating, would_recommend } = form;
        const payload = {
            comment,
            rating,
            would_recommend,
            id_student: userId,
        };

        axios.post(`/api/companies/${id}/reviews`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(({ data: newReview }) => {
                setReviews(prev =>
                    [newReview, ...prev.filter(r => r.id !== newReview.id)]
                );
                setForm({
                    comment: '',
                    rating: 1,
                    would_recommend: true,
                });
            })
            .catch(err => {
                const msg = err.response?.data?.message || 'Error al enviar';
                console.error('Error:', err.response?.data);
                alert(msg);
            });
    };

    const orderedReviews = useMemo(() => {
        return reviews.filter(r =>
            r.approved || r.id_student === userId
        );
    }, [reviews, userId]);

    const handleDelete = reviewId => {
        if (!window.confirm('¿Eliminar tu comentario?')) return;
        axios.delete(
            `/api/companies/${id}/reviews/${reviewId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(() => {
                setReviews(prev => prev.filter(r => r.id !== reviewId));
            })
            .catch(err => {
                console.error('Error al borrar:', err.response?.data);
                alert('No se pudo eliminar');
            });
    };

    const handleTutorChange = e => {
        setTutorForm({ ...tutorForm, comment: e.target.value });
    };

    const handleTutorSubmit = e => {
        e.preventDefault();
        const method = editingId ? 'put' : 'post';
        const url = editingId
            ? `/api/tutor-comments/${editingId}`
            : `/api/companies/${id}/tutor-comments`;

        axios[method](url, {
            comment: tutorForm.comment,
            id_tutor: userId
        }, { headers: { Authorization: `Bearer ${token}` } })
            .then(({ data }) => {
                if (editingId) {
                    setTutorComments(prev =>
                        prev.map(c => (c.id === data.id ? data : c))
                    );
                } else {
                    setTutorComments(prev => [data, ...prev]);
                }
                setTutorForm({ comment: '' });
                setEditingId(null);
            })
            .catch(err => alert('Error al guardar'));
    };

    const handleTutorDelete = commentId => {
        if (!window.confirm('¿Eliminar comentario de tutor?')) return;
        axios.delete(`/api/tutor-comments/${commentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                setTutorComments(prev => prev.filter(c => c.id !== commentId));
            })
            .catch(() => alert('Error al eliminar'));
    };

    const handleTutorEdit = comment => {
        setTutorForm({ comment: comment.comment });
        setEditingId(comment.id);
    };

    const averageRating = useMemo(() => {
        const approvedReviews = reviews.filter(r => r.approved);
        if (approvedReviews.length === 0) return null;
        const total = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
        return (total / approvedReviews.length).toFixed(1);
    }, [reviews]);

    if (!company) return <p>Cargando...</p>;

    return (
        <div className="company-detail col-12 col-lg-10">
            <h2>{company.name}</h2>
            {averageRating && (
                <div className="company-average-rating">
                    <strong>Puntuación media:</strong>
                    <StarRating value={averageRating} />
                    {averageRating} / 5
                </div>
            )}

            {isTutor && (
                <>
                    <section title='Solo visible para tutores' className=''>
                        <hr />
                        <h5>Datos de la empresa:</h5>
                        <div><strong>Jefe: </strong>{company.manager}</div>
                        <div><strong>Teléfono: </strong>{company.phone}</div>
                        <div><strong>Correo: </strong>{company.email}</div>
                        <div><strong>Privada: </strong>{company.is_private == 1 ? "SÍ" : "NO"}</div>
                    </section>
                    <hr />
                    <section className="tutor-comments new-review">
                        <div className="d-flex justify-content-between">
                            <h3>Comentarios de tutores</h3>
                            <div className="rounded p-2" title='Aquí puede añadirse infomación sobre la aceptación de prácticas'>?</div>
                        </div>
                        <form onSubmit={handleTutorSubmit} className='d-flex flex-column'>
                            <textarea
                                className='form-control'
                                value={tutorForm.comment}
                                onChange={handleTutorChange}
                                placeholder="Escribe tu comentario como tutor"
                                required
                            />
                            <section>
                                <button type="submit" className='w-100'>
                                    {editingId ? 'Actualizar' : 'Publicar'}
                                </button>
                                {editingId && (
                                    <button type="button" className='bg-danger w-100' onClick={() => {
                                        setEditingId(null);
                                        setTutorForm({ comment: '' });
                                    }}>
                                        Cancelar
                                    </button>
                                )}
                            </section>

                        </form>

                        {tutorComments.length === 0 ? (
                            <p>No hay comentarios de tutores aún.</p>
                        ) : (
                            tutorComments.map(c => (
                                <div key={c.id} className="review-card shadow-sm rounded-4 p-3">
                                    <p className='text-break'>{c.comment}</p>
                                    <small>{new Date(c.created_at).toLocaleDateString()}</small>

                                    {(c.id_tutor === userId || isAdmin) && (
                                        <div className="mt-2">
                                            {c.id_tutor === userId && (
                                                <button onClick={() => handleTutorEdit(c)}>Editar</button>
                                            )}
                                            <button onClick={() => handleTutorDelete(c.id)}>Eliminar</button>
                                        </div>
                                    )}

                                </div>
                            ))
                        )}
                    </section>
                </>
            )}
            <hr />

            {isStudent &&
                <section className="new-review">
                    <h3>Añade un comentario</h3>
                    <form onSubmit={handleSubmit} className='d-flex flex-column'>
                        <textarea
                            name="comment"
                            value={form.comment}
                            onChange={handleChange}
                            placeholder="¿Cómo ha sido tu experiencia?"
                            required
                        />

                        {[
                            { field: 'rating', label: 'Puntuación general' },

                        ].map(({ field, label }) => (
                            <div key={field}>
                                <label>{label}:</label>
                                <select
                                    name={field}
                                    value={form[field]}
                                    onChange={handleChange}
                                >
                                    {[
                                        { field: 1, label: 'Muy malo' },
                                        { field: 2, label: 'Malo' },
                                        { field: 3, label: 'Regular' },
                                        { field: 4, label: 'Bueno' },
                                        { field: 5, label: 'Excelente' }
                                    ].map(n => (
                                        <option key={`rating-${n.field}`} value={n.field}>
                                            {n.label}
                                        </option>
                                    ))}

                                </select>
                            </div>
                        ))}

                        <label>
                            <input
                                type="checkbox"
                                name="would_recommend"
                                checked={form.would_recommend}
                                onChange={handleChange}
                            />
                            Lo recomendaría
                        </label>

                        <button type="submit" className='bg-primary w-100'>Enviar</button>
                    </form>
                </section>
            }



            <section className="reviews">
                <h3>Comentarios</h3>
                <hr />
                {orderedReviews.length === 0 ? (
                    <p>No hay comentarios aún.</p>
                ) : (
                    orderedReviews.map(r => (
                        <div key={r.id} className="review-card shadow-sm rounded-4 p-3">
                            <section className='review-card-title d-flex justify-content-between align-items-start'>
                                <p className='text-break fs-5'>{r.comment}</p>
                                <small>{new Date(r.created_at).toLocaleDateString()}</small>
                            </section>

                            <section className='review-card-ratings flex-column'>
                                <StarRating value={r.rating} />
                                <p>Recomendaría: {r.would_recommend ? 'Sí' : 'No'}</p>
                            </section>

                            {(r.id_student === userId || isAdmin) && (
                                <section className='review-card-delete'>
                                    <button
                                        onClick={() => handleDelete(r.id)}
                                        className="btn-delete-review"
                                    >
                                        Eliminar comentario
                                    </button>
                                </section>
                            )}

                        </div>
                    ))
                )}
            </section>
        </div>
    );
};

export default CompanyDetail;
