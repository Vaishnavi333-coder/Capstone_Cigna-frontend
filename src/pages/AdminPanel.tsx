import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [newPolicy, setNewPolicy] = useState({ userId: 0, insurer: '', policyType: '', premiumAmt: 0, startDate: '', endDate: '' });

  useEffect(() => {
    if (localStorage.getItem('role') !== 'admin') {
      navigate('/');
      return;
    }
    async function load() {
      setLoading(true);
      try {
        const [cRes, pRes] = await Promise.all([
          api.get('/claims/admin'),
          api.get('/policies/admin'),
        ]);
        const uRes = await api.get('/users/admin');
        setClaims(cRes.data || []);
        setPolicies(pRes.data || []);
        setUsers(uRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/claims/admin/${id}/status`, { status });
      setClaims((prev) => prev.map((c) => (c.claimId === id ? { ...c, status } : c)));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const createPolicy = async () => {
    try {
      await api.post('/policies/admin', newPolicy);
      const pRes = await api.get('/policies/admin');
      setPolicies(pRes.data || []);
      setNewPolicy({userId:0, insurer:'', policyType:'', premiumAmt:0, startDate:'', endDate:''});
    } catch (err) {
      alert('Failed to create policy');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3>Admin Panel</h3>
      <div className="card p-3 mb-3">
        <h5>Create New Policy</h5>
        <div className="row g-2 align-items-end">
          <div className="col-12 col-md-3">
            <label>User</label>
            <select className="form-select" value={newPolicy.userId} onChange={(e) => setNewPolicy({...newPolicy, userId: Number(e.target.value)})}>
              <option value={0}>Select user</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.email}</option>)}
            </select>
          </div>
          <div className="col-12 col-md-3">
            <label>Insurer</label>
            <input className="form-control" value={newPolicy.insurer} onChange={(e) => setNewPolicy({...newPolicy, insurer:e.target.value})} />
          </div>
          <div className="col-12 col-md-2">
            <label>Type</label>
            <input className="form-control" value={newPolicy.policyType} onChange={(e) => setNewPolicy({...newPolicy, policyType:e.target.value})} />
          </div>
          <div className="col-12 col-md-2">
            <label>Premium</label>
            <input type="number" className="form-control" value={newPolicy.premiumAmt} onChange={(e) => setNewPolicy({...newPolicy, premiumAmt:Number(e.target.value)})} />
          </div>
          <div className="col-12 col-md-2">
            <button className="btn btn-sm btn-success" onClick={createPolicy}>Create</button>
          </div>
        </div>
      </div>
      <h5 className="mt-3">Claims</h5>
      <div className="list-group mb-3">
        {claims.map((c) => (
          <div key={c.claimId} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>Claim #{c.claimId}</strong> — {c.description}
              <div><small>Policy #{c.policy?.policyId} ({c.policy?.policyType})</small></div>
              <div><small>Submitted by: {c.user?.email}</small></div>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <div className="badge bg-secondary">{c.status}</div>
              <button className="btn btn-sm btn-success" onClick={() => updateStatus(c.claimId, 'Approved')}>Approve</button>
              <button className="btn btn-sm btn-warning" onClick={() => updateStatus(c.claimId, 'Under Review')}>Under Review</button>
              <button className="btn btn-sm btn-danger" onClick={() => updateStatus(c.claimId, 'Rejected')}>Reject</button>
            </div>
          </div>
        ))}
      </div>

      <h5 className="mt-3">Policies</h5>
      <div className="list-group">
        {policies.map((p) => (
          <div key={p.policyId} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>Policy #{p.policyId}</strong> — {p.policyType}
              <div><small>Holder: {p.user?.email}</small></div>
              <div><small>Status: {p.status}</small></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
