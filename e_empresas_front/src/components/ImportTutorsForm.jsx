import React, { useState } from 'react';
import axios from 'axios';

// Configuración global de Axios
axios.defaults.baseURL = 'http://localhost:8000';
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
      setError('Error de conexión con el servidor. Verifica:');
      setError(prev => prev + '\n1. Que el servidor Laravel esté corriendo');
      setError(prev => prev + '\n2. Que la URL sea correcta: http://localhost:8000');
      setError(prev => prev + '\n3. Que no haya errores CORS en la consola');
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

    // Primero establece la protección CSRF
    if (!await setupCSRF()) {
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/tutors/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Importar Tutores</h2>
      <form id="fileForm" onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            accept=".xlsx,.xls,.csv"
            disabled={isLoading}
            style={{ display: 'block', margin: '10px 0' }}
          />
        </div>
        
        {error && (
          <div style={{
            color: 'red',
            whiteSpace: 'pre-line',
            margin: '15px 0',
            padding: '10px',
            border: '1px solid red',
            borderRadius: '4px',
            backgroundColor: '#ffeeee'
          }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{
            color: 'green',
            margin: '15px 0',
            padding: '10px',
            border: '1px solid green',
            borderRadius: '4px',
            backgroundColor: '#eeffee'
          }}>
            {success}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading || !file}
          style={{
            padding: '10px 15px',
            backgroundColor: isLoading ? '#cccccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {isLoading ? '⏳ Importando...' : '📤 Importar Tutores'}
        </button>
      </form>
    </div>
  );
};

export default ImportTutorsForm;