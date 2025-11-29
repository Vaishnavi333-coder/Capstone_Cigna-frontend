import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { email, name, password });
      localStorage.setItem('jwt', (res.data as any).access_token);
      // notify app that a login has occurred
      window.dispatchEvent(new Event('authChange'));
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="card p-3" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h3>Register</h3>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label>Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="form-control" />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" />
        </div>
        {error && <div className="mb-3 text-danger">{error}</div>}
        <button className="btn btn-primary" type="submit">Register</button>
      </form>
    </div>
  );
}
