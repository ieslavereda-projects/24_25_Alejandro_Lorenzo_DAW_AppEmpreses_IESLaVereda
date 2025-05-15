import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ element, requiredRoles = [] }) => {
    const [authorized, setAuthorized] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('authToken');

                if (!token) {
                    setAuthorized(false);
                    navigate('/login');
                    return;
                }

                const res = await fetch('/api/user', {
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

                const hasRole = requiredRoles.some(role => roles[role]);
                setAuthorized(hasRole);
            } catch (err) {
                console.error('Error al obtener usuario autenticado', err);
                setAuthorized(false);
            }
        };

        fetchUser();
    }, [requiredRoles]);

    if (authorized === null) return null;

    return authorized ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
