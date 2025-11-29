import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PublicLandingPage from './pages/PublicLandingPage';
import PoliciesPage from './pages/PoliciesPage';
import ClaimsPage from './pages/ClaimsPage';
import PolicyForm from './pages/PolicyForm';
import ClaimForm from './pages/ClaimForm';
import Chatbot from './components/Chatbot';
import WavyNavbar from './components/WavyNavbar';
import WavyFooter from './components/WavyFooter';

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwt'));
  useEffect(() => {
    function onAuthChange() { setIsAuthenticated(!!localStorage.getItem('jwt')); }
    window.addEventListener('authChange', onAuthChange);
    window.addEventListener('storage', onAuthChange as any);
    return () => { window.removeEventListener('authChange', onAuthChange); window.removeEventListener('storage', onAuthChange as any); };
  }, []);
  return isAuthenticated;
}

function App() {
  const isAuthenticated = useAuth();
  return (
    <div className="app-root">
      <WavyNavbar />
      <div className="app-content">
        <div className="container mt-3">
      <Routes>
        <Route path="/" element={isAuthenticated ? <DashboardPage /> : <PublicLandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/policies" element={isAuthenticated ? <PoliciesPage /> : <Navigate to="/login" />} />
        <Route path="/policies/new" element={isAuthenticated ? <PolicyForm /> : <Navigate to="/login" />} />
        <Route path="/claims" element={isAuthenticated ? <ClaimsPage /> : <Navigate to="/login" />} />
        <Route path="/claims/new" element={isAuthenticated ? <ClaimForm /> : <Navigate to="/login" />} />
      </Routes>
        </div>
      </div>
      <WavyFooter />
      <Chatbot />
    </div>
  );
}

export default App;
