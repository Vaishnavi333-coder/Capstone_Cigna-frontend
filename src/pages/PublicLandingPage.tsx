import React from 'react';
import { Link } from 'react-router-dom';
import './PublicLandingPage.css';

export default function PublicLandingPage() {
  return (
    <div className="public-landing container text-center mt-5">
      <div className="hero card p-4 shadow-sm">
        <h1 className="mb-3 hero-title">Welcome to InsureConnect</h1>
        <p className="lead mb-4">Smart Insurance, Simplified. Please Login or Register to manage your policies and claims.</p>
        <div className="d-flex justify-content-center gap-2">
          <Link className="btn btn-primary" to="/login">Login</Link>
          <Link className="btn btn-outline-primary" to="/register">Register</Link>
        </div>
      </div>

      <div className="features mt-4 row gx-3">
        <div className="col-md-6">
          <div className="card p-3 h-100">
            <h5>Manage Policies</h5>
            <p className="mb-0">View and maintain your active policies in one place.</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 h-100">
            <h5>File Claims</h5>
            <p className="mb-0">Submit and track claims easily through a clear process.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
