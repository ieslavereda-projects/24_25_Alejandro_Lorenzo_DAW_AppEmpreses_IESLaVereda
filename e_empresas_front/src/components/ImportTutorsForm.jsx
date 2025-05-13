import React, { useState } from 'react';
import axios from 'axios';

import '../styles/ImportTutorsForm.scss';

axios.defaults.withCredentials = true;

const ImportTutorsForm = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const setupCSRF = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie');
      return true;
    } catch (err) {
      console.error('Error al configurar CSRF:', err);
      setError('Error de conexión con el servidor.');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Seleccione un archivo primero');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!await setupCSRF()) {
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('authToken');

      const response = await axios.post('/api/tutors/import', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      setSuccess('Importación exitosa: ' + response.data.message);
      setFile(null);
      document.getElementById('fileForm').reset();
    } catch (err) {
      let errorMsg = 'Error en la importación';

      if (err.response) {
        errorMsg += ` (${err.response.status}): `;
        errorMsg += err.response.data?.message || err.response.statusText;

        if (err.response.data?.errors) {
          errorMsg += '\n' + Object.values(err.response.data.errors).flat().join('\n');
        }
      } else if (err.request) {
        errorMsg += ': El servidor no respondió';
      } else {
        errorMsg += ': ' + err.message;
      }

      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="import-form-container">
      <form id="fileForm" onSubmit={handleSubmit}>
        <h2>Importar Tutores</h2>

        <div className="form-group">
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            accept=".xlsx,.xls,.csv"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !file}
          className={`btn-submit ${isLoading ? 'loading' : ''}`}
        >
          {isLoading ? 'Importando...' : 'Importar Tutores'}
        </button>
      </form>
    </div>
  );
};

export default ImportTutorsForm;
