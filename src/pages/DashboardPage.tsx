import React from 'react';
import StatCard from '../components/StatCard';
import './DashboardPage.css';
import { FaFileInvoiceDollar, FaUserFriends, FaFileAlt, FaClock } from 'react-icons/fa';

export default function DashboardPage() {
  const user = localStorage.getItem('jwt');
  const isAuth = !!user;

  // Placeholder sample data
  const stats = [
    { title: 'Active Policies', value: 6, color: '#3f5efb', icon: <FaFileAlt /> },
    { title: 'Claims Submitted', value: 2, color: '#FB6F92', icon: <FaFileInvoiceDollar /> },
    { title: 'Registered Users', value: 124, color: '#1ED760', icon: <FaUserFriends /> },
    { title: 'Pending Approvals', value: 1, color: '#FFB84D', icon: <FaClock /> },
  ];

  return (
    <div>
      <div className="dashboard-hero d-flex justify-content-between align-items-center">
        <div>
          <h2 style={{ marginBottom: 4 }}>Welcome {isAuth ? 'Back' : ''} to InsureConnect Portal</h2>
          <p style={{ margin: 0, opacity: 0.8 }}>Bright, responsive dashboard to manage policies and claims</p>
        </div>
        <div>
          {isAuth ? (
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary me-2">New Policy</button>
              <button className="btn btn-primary">Submit Claim</button>
            </div>
          ) : (
            <div>
              <a href="/login" className="btn btn-primary">Login</a>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-grid mb-3">
        {stats.map((s) => (
          <StatCard key={s.title} title={s.title} value={s.value} color={s.color} icon={s.icon} />
        ))}
      </div>

      <div className="row">
        <div className="col-lg-8 mb-3">
          <div className="activities-card">
            <h5>Recent Activity</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Claim #124 submitted by John Doe — Awaiting review</li>
              <li className="list-group-item">Policy #789 renewed for Jane Smith</li>
              <li className="list-group-item">New user registered: alice@example.com</li>
            </ul>
          </div>
        </div>
        <div className="col-lg-4 mb-3">
          <div className="activities-card">
            <h5>Policy Summary</h5>
            <table className="table table-sm policy-summary mb-0">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Health</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>Life</td>
                  <td>2</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
