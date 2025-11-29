import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

export default function ClaimsPage() {
  const [claims, setClaims] = useState<any[]>([]);
  const [error, setError] = useState('');

  const fetch = async () => {
    try {
      const r = await api.get('/claims');
      setClaims(r.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Your Claims</h3>
        <Link to="/claims/new" className="btn btn-primary">New Claim</Link>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table">
        <thead>
          <tr>
            <th>Claim ID</th>
            <th>Policy</th>
            <th>Claim Amount</th>
            <th>Description</th>
            <th>Status</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((c) => (
            <tr key={c.claimId}>
              <td>{c.claimId}</td>
              <td>{c.policy?.policyId}</td>
              <td>{c.claimAmt}</td>
              <td>{c.description}</td>
              <td>{c.status}</td>
              <td>{new Date(c.submittedAt).toLocaleString()}</td>
              <td>
                {c.status === 'Submitted' && (
                  <button className="btn btn-danger btn-sm" onClick={async () => {
                    await api.delete(`/claims/${c.claimId}`);
                    fetch();
                  }}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
