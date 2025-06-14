import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const MyProfile = () => {
    const [token] = useState(() => localStorage.getItem('authToken'));
    const userId = parseInt(localStorage.getItem('userId'), 10);

    const [user, setUser] = useState(null);
    const [tutors, setTutors] = useState([]);
    const [notices, setNotices] = useState([]);
    const [selectedTutors, setSelectedTutors] = useState([]);
    const [text, setText] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [error, setError] = useState('');
    const [reviewPage, setReviewPage] = useState(1);
    const [reviewData, setReviewData] = useState({ data: [], last_page: 1 });

    useEffect(() => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.get('/api/user').then(r => setUser(r.data));
        axios.get('/api/users?tutor=1').then(r => setTutors(r.data));
        axios.get('/api/notices').then(r => setNotices(r.data));
    }, [token]);

    useEffect(() => {
        axios.get(`/api/reviews?page=${reviewPage}`).then(r => setReviewData(r.data));
    }, [token, reviewPage]);

    const allReviews = reviewData.data || [];
    const pendingReviews = allReviews.filter(r => !r.approved);

    const sent = useMemo(
        () => notices.filter(n => n.id_user_emitter === userId),
        [notices, userId]
    );
    const received = useMemo(
        () => notices.filter(n => n.id_user_receiver === userId),
        [notices, userId]
    );

    const addTutor = e => {
        const id = parseInt(e.target.value, 10);
        if (id && !selectedTutors.includes(id)) {
            setSelectedTutors([...selectedTutors, id]);
        }
        e.target.value = '';
    };
    const removeTutor = id => {
        setSelectedTutors(selectedTutors.filter(x => x !== id));
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (!text.trim() || selectedTutors.length === 0) {
            setError('Escribe la tarea y designa al menos un destinatario');
            return;
        }
        setError('');
        Promise.all(
            selectedTutors.map(receiver =>
                axios.post('/api/notices', {
                    id_user_emitter: userId,
                    id_user_receiver: receiver,
                    text,
                    seen: 0
                })
            )
        )
            .then(responses => {
                const newNotices = responses.map(r => r.data);
                setNotices(prev => [...newNotices, ...prev]);
                setText('');
                setSelectedTutors([]);
            })
            .catch(() => setError('Error al enviar tareas'));
    };

    const toggleSeen = id => {
        const notice = notices.find(n => n.id === id);
        axios.put(`/api/notices/${id}`, { seen: notice.seen ? 0 : 1 })
            .then(({ data }) => {
                setNotices(prev => prev.map(n => n.id === id ? data : n));
            });
    };

    const deleteNotice = id => {
        if (!window.confirm('¿Eliminar esta tarea?')) return;
        axios.delete(`/api/notices/${id}`)
            .then(() => {
                setNotices(prev => prev.filter(n => n.id !== id));
            });
    };

    const startEditing = (id, currentText) => {
        setEditingId(id);
        setEditText(currentText);
    };
    const cancelEditing = () => {
        setEditingId(null);
        setEditText('');
    };
    const saveEdit = id => {
        axios.put(`/api/notices/${id}`, { text: editText })
            .then(({ data }) => {
                setNotices(prev => prev.map(n => n.id === id ? data : n));
                cancelEditing();
            })
            .catch(() => alert('No se pudo guardar cambios'));
    };

    const fetchReviews = (page = 1) => {
        axios.get(`/api/reviews?page=${page}`)
            .then(r => setReviewData(r.data))
            .catch(() => alert('Error al cargar comentarios'));
    };

    const approveReview = id => {
        axios.put(`/api/reviews/${id}`, { approved: 1 })
            .then(() => fetchReviews(reviewPage))
            .catch(() => alert('Error al aprobar el comentario'));
    };

    const deleteReview = id => {
        if (!window.confirm('¿Eliminar este comentario?')) return;
        axios.delete(`/api/reviews/${id}`)
            .then(() => fetchReviews(reviewPage))
            .catch(() => alert('Error al eliminar'));
    };

    if (!user) return <p>Cargando perfil…</p>;

    return (
        <div className="container py-4">
            <h2>Mi Zona</h2>
            <div className="card mb-4 z-n1">
                <div className="card-body">
                    <p><strong>Nombre:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            </div>

            <section className="mb-5">
                <h3>Crear nueva tarea</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        {selectedTutors.map(id => {
                            const t = tutors.find(t => t.id === id);
                            return (
                                <span key={id} className="badge bg-secondary ms-0 m-1">
                                    {t?.name || id}
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white btn-sm ms-1"
                                        onClick={() => removeTutor(id)}
                                    />
                                </span>
                            );
                        })}
                    </div>
                    <div className="row g-2">
                        <div className="col-md-4">
                            <select className="form-select" onChange={addTutor}>
                                <option value="">— Añadir tutor —</option>
                                {tutors.map(t => (
                                    <option key={t.id} value={t.id}>
                                        {t.name} ({t.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-8">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Describe la tarea…"
                                value={text}
                                onChange={e => setText(e.target.value)}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">
                        Enviar tareas
                    </button>
                </form>
            </section>

            <div className="row">
                <div className="col-md-6">
                    <h4>Tareas enviadas</h4>
                    {sent.length === 0 ? <p>No has enviado tareas.</p> : sent.map(n => (
                        <div key={n.id} className="card mb-2">
                            <div className="card-body">
                                <p><strong>A:</strong> {tutors.find(t => t.id === n.id_user_receiver)?.name}</p>
                                {editingId === n.id ? (
                                    <>
                                        <textarea
                                            className="form-control mb-2"
                                            value={editText}
                                            onChange={e => setEditText(e.target.value)}
                                        />
                                        <button className="btn btn-sm btn-success me-2" onClick={() => saveEdit(n.id)}>Guardar</button>
                                        <button className="btn btn-sm btn-secondary" onClick={cancelEditing}>Cancelar</button>
                                    </>
                                ) : (
                                    <>
                                        <p>{n.text}</p>
                                        <small className="text-muted">{new Date(n.created_at).toLocaleString()}</small>
                                        <div className="mt-2">
                                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEditing(n.id, n.text)}>Editar</button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => deleteNotice(n.id)}>Eliminar</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="col-md-6">
                    <h4>Tareas recibidas</h4>
                    {received.length === 0 ? <p>No tienes tareas asignadas.</p> : received.map(n => (
                        <div key={n.id} className={`card mb-2 ${n.seen ? '' : 'border-warning'}`}>
                            <div className="card-body">
                                <p><strong>De:</strong> {tutors.find(t => t.id === n.id_user_emitter)?.name}</p>
                                <p>{n.text}</p>
                                <small className="text-muted">{new Date(n.created_at).toLocaleString()}</small>
                                <div className="mt-2">
                                    <button className="btn btn-sm btn-success me-2" onClick={() => toggleSeen(n.id)}>
                                        {n.seen ? 'Marcar no leído' : 'Marcar leído'}
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteNotice(n.id)}>
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {(user.is_admin || user.is_tutor) && (
                <div>
                    <h4>Comentarios por aprobar</h4>
                    {pendingReviews.length === 0 ? (
                        <p>No hay comentarios pendientes.</p>
                    ) : (
                        <div className="d-flex flex-wrap">
                            {pendingReviews.map(r => (
                                <div key={r.id} className="card mb-2 col-6">
                                    <div className="card-body">
                                        <p><strong>{r.student?.name || 'Usuario'}:</strong> {r.comment}</p>
                                        <p><strong>Puntuación:</strong> {r.rating}</p>
                                        <div>
                                            <button className="btn btn-sm btn-success me-2" onClick={() => approveReview(r.id)}>
                                                Aprobar
                                            </button>
                                            <button className="btn btn-sm btn-danger" onClick={() => deleteReview(r.id)}>
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-3 d-flex justify-content-center col-12">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => setReviewPage(p => Math.max(1, p - 1))}
                                    disabled={reviewPage === 1}
                                >
                                    ← Anterior
                                </button>
                                <span className="align-self-center">Página {reviewPage} de {reviewData.last_page}</span>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => setReviewPage(p => Math.min(reviewData.last_page, p + 1))}
                                    disabled={reviewPage === reviewData.last_page}
                                >
                                    Siguiente →
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            )}







        </div>
    );
};

export default MyProfile;
