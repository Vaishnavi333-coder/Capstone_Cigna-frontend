import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      if ((res.data as any).access_token) {
        localStorage.setItem('jwt', (res.data as any).access_token);
        // dispatch event for auth change so navbar and app can react
        window.dispatchEvent(new Event('authChange'));
        navigate('/');
      } else if (res.data.error) {
        setError(res.data.error);
      } else {
        setError('Unknown error');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="card p-3" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h3>Login</h3>
      <form onSubmit={login}>
        <div className="mb-3">
          <label>Email</label>
          <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="mb-3 text-danger">{error}</div>
        <button className="btn btn-primary" type="submit">Login</button>
      </form>
    </div>
  );
}
