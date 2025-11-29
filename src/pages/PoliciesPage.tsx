import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import PolicyAds from '../components/PolicyAds';
import PolicyForm from './PolicyForm';
import Modal from '../components/Modal';
import './PoliciesPage.css';

function PolicyRow({ p }: any) {
  return (
    <tr>
      <td>{p.policyId}</td>
      <td>{p.insurer}</td>
      <td>{p.policyType}</td>
      <td>{p.premiumAmt}</td>
      <td>{new Date(p.endDate).toLocaleDateString()}</td>
      <td>{p.status}</td>
    </tr>
  );
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [prefillPlan, setPrefillPlan] = useState<any | null>(null);

  const fetchPolicies = async () => {
    try {
      const r = await api.get('/policies');
      setPolicies(r.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const [showForm, setShowForm] = useState(false);

  const onAddNewClick = () => {
    setShowForm(true);
  };

  const onBuyNow = (plan: any) => {
    setPrefillPlan(plan);
    setShowForm(true);
  };

  return (
    <div>
      <PolicyAds showAddNew={false} onAddNewClick={onAddNewClick} onBuyNow={onBuyNow} />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Your Policies</h3>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <PolicyForm initialData={prefillPlan || undefined} onSuccess={async () => { await fetchPolicies(); setShowForm(false); setPrefillPlan(null); }} onClose={() => { setShowForm(false); setPrefillPlan(null); }} />
        </Modal>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Policy ID</th>
            <th>Insurer</th>
            <th>Type</th>
            <th>Premium</th>
            <th>Expiry</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((p) => (
            <PolicyRow p={p} key={p.policyId} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
