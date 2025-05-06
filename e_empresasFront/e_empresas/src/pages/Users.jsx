import React, { useEffect, useState } from 'react';
import '../styles/Users.scss';
import axios from 'axios';

function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="container">
            <h1>Users</h1>
            <div className="users-container">
                {users.map(user => (
                    <div className="user-container" key={user.id}>
                        <h2>{user.name}</h2>
                        <p>Email: {user.email}</p>
                        <p>Rol:{(user.is_admin == 1 ? " admin" : "") + (user.is_student == 1 ? " estudiante" : "") + (user.is_tutor == 1 ? " tutor" : "") + (user.is_instructor == 1 ? " instructor" : "")}</p>  
                        <p>Curso: {user.study_cycle ? user.study_cycle : "no asignado"}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Users;
