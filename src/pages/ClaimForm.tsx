import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function ClaimForm() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [policyId, setPolicyId] = useState<number | ''>('');
  const [claimAmt, setClaimAmt] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // fetch policies for logged in user
    api.get('/policies').then((r) => setPolicies(r.data)).catch(() => setPolicies([]));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyId || !claimAmt || !description) return setError('Please fill all fields');
    try {
      await api.post('/claims', { policyId, claimAmt, description });
      navigate('/claims');
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to submit claim');
    }
  };

  return (
    <div className="card p-3" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h3>File Claim</h3>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label>Policy</label>
          <select className="form-select" value={policyId} onChange={(e) => setPolicyId(Number(e.target.value))}>
            <option value="">-- Select Policy --</option>
            {policies.map((p) => (
              <option key={p.policyId} value={p.policyId}>#{p.policyId} - {p.policyType}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Claim Amount</label>
          <input type="number" className="form-control" value={claimAmt} onChange={(e) => setClaimAmt(Number(e.target.value))} />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        {error && <div className="mb-3 text-danger">{error}</div>}
        <button className="btn btn-primary" type="submit">Submit Claim</button>
      </form>
    </div>
  );
}
