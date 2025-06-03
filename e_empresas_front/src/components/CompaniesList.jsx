import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/CompaniesList.scss';

const CompaniesList = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/companies')
      .then(({ data }) => setCompanies(data))
      .catch(() => setCompanies([]));
  }, []);

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="companies-list">
      <h2>Empresas</h2>
      <input
        type="text"
        placeholder="Buscar empresa..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="search-input"
      />
      <ul>
        {filtered.map(c => (
          <li key={c.id} className='shadow-sm p-3'>
            <Link to={`/companies/${c.id}`}>
              <div className='fw-bold'>{c.name}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompaniesList;
