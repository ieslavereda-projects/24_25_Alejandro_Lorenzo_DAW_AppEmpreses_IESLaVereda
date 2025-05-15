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
    const [form, setForm] = useState({
        title: '',
        comment: '',
        rating: 1,
        work_environment: 1,
        mentoring: 1,
        learning_value: 1,
        would_recommend: true,
    });

    useEffect(() => {
        axios.get(`/api/companies/${id}`)
            .then(({ data }) => setCompany(data));

        axios.get(`/api/companies/${id}/reviews`)
            .then(({ data }) => setReviews(data))
            .catch(err => console.error('Error al cargar comentarios:', err));
    }, [id]);

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
        const payload = { ...form, id_student: userId };

        axios.post(`/api/companies/${id}/reviews`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(({ data: newReview }) => {
                setReviews(prev =>
                    [newReview, ...prev.filter(r => r.id !== newReview.id)]
                );
                setForm({
                    title: '',
                    comment: '',
                    rating: 1,
                    work_environment: 1,
                    mentoring: 1,
                    learning_value: 1,
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
        const own = reviews.find(r => r.id_student === userId);
        if (!own) return reviews;
        const others = reviews.filter(r => r.id !== own.id);
        return [own, ...others];
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

    if (!company) return <p>Cargando...</p>;

    return (
        <div className="company-detail">
            <h2>{company.name}</h2>
            <p><strong>Cursos destacados:</strong> {company.industry}</p>
            <hr />

            <section className="new-review">
                <h3>Añadir comentario</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Título"
                        required
                    />
                    <textarea
                        name="comment"
                        value={form.comment}
                        onChange={handleChange}
                        placeholder="Tu comentario..."
                        required
                    />

                    {['rating', 'work_environment', 'mentoring', 'learning_value'].map(field => (
                        <div key={field}>
                            <label>{field.replace('_', ' ')}:</label>
                            <select
                                name={field}
                                value={form[field]}
                                onChange={handleChange}
                            >
                                {[1, 2, 3, 4, 5].map(n => (
                                    <option key={`${field}-${n}`} value={n}>{n}</option>
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

                    <button type="submit">Enviar</button>
                </form>
            </section>

            <section className="reviews">
                <h3>Comentarios</h3>
                {orderedReviews.length === 0 ? (
                    <p>No hay comentarios aún.</p>
                ) : (
                    orderedReviews.map(r => (
                        <div key={r.id} className="review-card">
                            <section>
                                <h4>{r.title}</h4>
                                <p>{r.comment}</p>
                                <small>{new Date(r.created_at).toLocaleDateString()}</small>

                            </section>
                            <section>
                                <p>Puntuación general: <StarRating value={r.rating} /></p>
                                <p>Entorno de trabajo: <StarRating value={r.work_environment} /></p>
                                <p>Mentoring y retroalimentación: <StarRating value={r.mentoring} /></p>
                                <p>Aprendizaje: <StarRating value={r.learning_value} /></p>
                                <p>Recomendaría: {r.would_recommend ? 'Sí' : 'No'}</p>
                            </section>


                            {r.id_student === userId && (
                                <button
                                    onClick={() => handleDelete(r.id)}
                                    className="btn-delete-review"
                                >
                                    Eliminar mi comentario
                                </button>
                            )}
                        </div>
                    ))
                )}
            </section>
        </div>
    );
};

export default CompanyDetail;
