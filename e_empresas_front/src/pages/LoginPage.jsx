import { useState } from 'react';
import "../styles/LoginPage.scss";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userId', data.user.id);
      window.location.href = '/';
    }
    else {
      setError(data.message || 'Algo salió mal');
    }
  };

  return (
      <div className="form-container">
        <h3>E-EMPRESAS</h3>
        <form onSubmit={handleLogin}>
          <h3 className='text-start'> Iniciar sesión </h3>

          <div>
            <input
              type="email"
              value={email}
              placeholder='Email'
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              placeholder='Contraseña'
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p>{error}</p>}
          <button type="submit">Iniciar sesión</button>
        </form>
      </div>
  );
};

export default LoginPage;
