import React, { useState } from 'react';
import axios from 'axios';

const ImportCompanies = ({ onImport }) => {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) {
      setError('Selecciona un archivo');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('/api/companies/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Empresas importadas correctamente');
      setFile(null);
      if (onImport) onImport();
    } catch (err) {
      setError('Error al importar empresas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="import-form-container">
      <form id="fileForm" onSubmit={handleSubmit}>
        <h2>Importar Empresas</h2>

        <div className="form-group">
          <input
            type="file"
            id="file"
            onChange={handleChange}
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
          {isLoading ? 'Importando...' : 'Importar Empresas'}
        </button>
      </form>
    </div>
  );
};

export default ImportCompanies;
