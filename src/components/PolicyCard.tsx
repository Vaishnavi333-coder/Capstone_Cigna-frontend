import React, { useRef } from 'react';
import { FaHeartbeat, FaCar, FaHome, FaPlane, FaHeart, FaShieldAlt } from 'react-icons/fa';
import './PolicyAds.css';

type Plan = {
  id: string;
  insurer?: string;
  insurerLogo?: string;
  planName: string;
  policyType: string;
  premium: number;
  durationMonths: number;
  coverage: number;
  gradient?: string; // optional class name
};

const iconMap: Record<string, React.ReactNode> = {
  Health: <FaHeartbeat />,
  Motor: <FaCar />,
  Home: <FaHome />,
  Travel: <FaPlane />,
  Life: <FaHeart />,
  Accident: <FaShieldAlt />,
};

export default function PolicyCard({ plan, onBuyNow }: { plan: Plan; onBuyNow?: (p: Plan) => void }) {
  const { insurer, insurerLogo, planName, policyType, premium, durationMonths, coverage, gradient } = plan;
  const ref = useRef<HTMLDivElement | null>(null);
  const Icon = iconMap[policyType] || <FaShieldAlt />;
  const fallbackInitials = (insurer || planName || 'InsureConnect').split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0-1
    const y = (e.clientY - rect.top) / rect.height; // 0-1
    // normalize to -0.5..0.5
    const nx = x - 0.5; const ny = y - 0.5;
    ref.current.style.setProperty('--nx', String(nx));
    ref.current.style.setProperty('--ny', String(ny));
  };
  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty('--nx', '0');
    ref.current.style.setProperty('--ny', '0');
  };

  return (
    <div ref={ref} className={`policy-card ${gradient || ''}`} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div className="card-front">
      <div className="policy-card-top d-flex align-items-center">
        <div className="logo-wrap">
          {insurerLogo ? (
            <img src={insurerLogo} alt={planName} className="insurer-logo" />
          ) : (
            <div className="insurer-fallback">{fallbackInitials}</div>
          )}
        </div>
        <div className="policy-info ms-3">
          <div className="policy-name">{planName}</div>
          <div className="policy-type">{policyType}</div>
          {insurer && <div className="policy-insurer" style={{fontSize:12, opacity:0.85}}>{insurer}</div>}
        </div>
        <div className="ms-auto icon-wrap">{Icon}</div>
      </div>
      <div className="policy-card-body mt-3">
        <div className="d-flex justify-content-between">
          <div>
            <div className="label">Premium</div>
            <div className="value">{formatCurrency(premium)}</div>
          </div>
          <div>
            <div className="label">Duration</div>
            <div className="value">{durationMonths} Months</div>
          </div>
          <div>
            <div className="label">Coverage</div>
            <div className="value">{formatCurrency(coverage)}</div>
          </div>
        </div>
      </div>
      <div className="policy-card-footer d-flex justify-content-between align-items-center mt-3">
        {/* Removed front Details and Buy Now to avoid duplicate actions; overlay shows Buy Now on hover */}
        <div/>
      </div>
      </div>{/* end card-front */}
      <div className="policy-details">
        <div className="desc">{(plan as any).description}</div>
        <ul className="features mt-2">
          {((plan as any).features || []).map((f: string) => <li key={f}>{f}</li>)}
        </ul>
        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-sm buy-now" onClick={() => onBuyNow && onBuyNow(plan)}>Buy Now</button>
        </div>
      </div>
    </div>
  );
}
