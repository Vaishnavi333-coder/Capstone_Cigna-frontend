import React from 'react';
import PolicyCard from './PolicyCard';
import sample from '../data/policyAds';
import './PolicyAds.css';

export default function PolicyAds({ onAddNewClick, onBuyNow, showAddNew = true }: { onAddNewClick?: () => void; onBuyNow?: (p: any) => void; showAddNew?: boolean }) {
  return (
    <div className="policy-ads">
      <div className="ads-hero p-4 mb-4 rounded-3 d-flex align-items-center justify-content-between">
        <div>
          <h2 className="mb-1">Protect What Matters Most</h2>
          <p className="mb-0 text-muted">Explore curated plans for your family, vehicle, home, travel and more.</p>
        </div>
        {showAddNew && (
          <div>
            <button className="btn btn-primary" onClick={() => onAddNewClick && onAddNewClick()}>Add New Policy</button>
          </div>
        )}
      </div>

      <div className="cards-grid">
        {sample.map((p) => (
          <PolicyCard key={p.id} plan={p} onBuyNow={(pl) => onBuyNow && onBuyNow(pl)} />
        ))}
      </div>
    </div>
  );
}
