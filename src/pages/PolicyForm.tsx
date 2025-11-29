import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function PolicyForm({ onSuccess, onClose, initialData }: { onSuccess?: () => void; onClose?: () => void; initialData?: any }) {
  const [insurer, setInsurer] = useState(initialData?.insurer || initialData?.planName || '');
  const [policyType, setPolicyType] = useState(initialData?.policyType || '');
  const [premiumAmt, setPremiumAmt] = useState<number | ''>((initialData?.premium ?? initialData?.premiumAmt) ?? '');
  const todayISO = new Date().toISOString().slice(0,10);
  const [startDate, setStartDate] = useState(initialData?.startDate || todayISO);
  const [durationMonths, setDurationMonths] = useState<number | ''>(initialData?.durationMonths ?? '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!initialData) return;
    setInsurer(initialData.insurer || initialData.planName || '');
    setPolicyType(initialData.policyType || '');
    setPremiumAmt((initialData.premium ?? initialData.premiumAmt) ?? '');
    setStartDate(initialData.startDate || todayISO);
    setDurationMonths(initialData.durationMonths ?? '');
  }, [initialData]);

  // compute endDate from startDate + durationMonths
  React.useEffect(() => {
    if (!startDate) { setEndDate(''); return; }
    const sd = new Date(startDate + 'T00:00:00');
    const months = Number(durationMonths) || 0;
    if (months <= 0) {
      setEndDate('');
      return;
    }
    const ed = new Date(sd);
    ed.setMonth(ed.getMonth() + months);
    const iso = ed.toISOString().slice(0,10);
    setEndDate(iso);
  }, [startDate, durationMonths]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!insurer || !policyType || !premiumAmt || !startDate || !endDate) {
      setError('Please fill all fields');
      return;
    }
    try {
      await api.post('/policies', { insurer, policyType, premiumAmt, startDate, endDate, status: 'Active' });
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/policies');
      }
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
        {/* If no duration provided by ad (initialData), allow entering duration. Otherwise duration is fixed and shown read-only. */}
        {(!initialData?.durationMonths) && (
          <div className="mb-3">
            <label>Duration (months)</label>
            <input type="number" className="form-control" min={1} value={durationMonths} onChange={(e) => setDurationMonths(Number(e.target.value))} />
          </div>
        )}
        <div className="mb-3">
          <label>End Date</label>
          <input type="date" className="form-control" value={endDate} disabled />
        </div>
        {error && <div className="mb-3 text-danger">{error}</div>}
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-primary" type="submit">Save</button>
          {onClose && (
            <button type="button" className="btn btn-secondary" onClick={() => onClose()}>Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
}
