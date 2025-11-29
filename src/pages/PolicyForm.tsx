import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function PolicyForm() {
  const [insurer, setInsurer] = useState('');
  const [policyType, setPolicyType] = useState('');
  const [premiumAmt, setPremiumAmt] = useState<number | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!insurer || !policyType || !premiumAmt || !startDate || !endDate) {
      setError('Please fill all fields');
      return;
    }
    try {
      await api.post('/policies', { insurer, policyType, premiumAmt, startDate, endDate, status: 'Active' });
      navigate('/policies');
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="card p-3" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h3>Add Policy</h3>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label>Insurer</label>
          <input className="form-control" value={insurer} onChange={(e) => setInsurer(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Policy Type</label>
          <input className="form-control" value={policyType} onChange={(e) => setPolicyType(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Premium Amount</label>
          <input type="number" className="form-control" value={premiumAmt} onChange={(e) => setPremiumAmt(Number(e.target.value))} />
        </div>
        <div className="mb-3">
          <label>Start Date</label>
          <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>End Date</label>
          <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        {error && <div className="mb-3 text-danger">{error}</div>}
        <button className="btn btn-primary" type="submit">Save</button>
      </form>
    </div>
  );
}
