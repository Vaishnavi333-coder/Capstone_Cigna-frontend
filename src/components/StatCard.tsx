import React from 'react';

type Props = {
  title: string;
  value: string | number;
  color?: string;
  icon?: React.ReactNode;
};

export default function StatCard({ title, value, color = '#6f42c1', icon }: Props) {
  const style = {
    background: `linear-gradient(135deg, ${color} 0%, #ffffff 100%)`,
    color: '#fff',
  } as React.CSSProperties;

  return (
    <div className="card stat-card shadow-sm" style={{ border: 'none', overflow: 'hidden' }}>
      <div className="card-body d-flex align-items-center" style={style}>
        <div style={{ marginRight: 12, fontSize: 32 }}>{icon}</div>
        <div>
          <div className="stat-title" style={{ fontSize: 14, opacity: 0.95 }}>{title}</div>
          <div className="stat-value" style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
        </div>
      </div>
    </div>
  );
}
