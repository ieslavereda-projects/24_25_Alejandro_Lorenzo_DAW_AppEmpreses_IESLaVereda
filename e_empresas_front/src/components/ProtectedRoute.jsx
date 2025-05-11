import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ProtectedRoute = ({ element, requiredRole }) => {
    const [authorized, setAuthorized] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const res = await fetch('http://localhost:8000/api/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });

                const user = await res.json();
                console.log('Usuario autenticado:', user);

                const roles = {
                    admin: user.is_admin,
                    tutor: user.is_tutor,
                    student: user.is_student,
                };

                setAuthorized(!!roles[requiredRole]);
            } catch (err) {
                console.error('Error al obtener usuario autenticado', err);
                setAuthorized(false);
            }
        }

        fetchUser();
    }, [requiredRole]);

    if (authorized === null) return null;

    return authorized ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
