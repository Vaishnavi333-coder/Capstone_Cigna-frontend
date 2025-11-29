import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './WavyLayout.css';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUser, FaFileAlt, FaFileInvoiceDollar } from 'react-icons/fa';

export default function WavyNavbar() {
  const [logoOk, setLogoOk] = useState(true);
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('jwt'));
  const navigate = useNavigate();

  useEffect(() => {
    function onAuthChange() {
      setIsAuth(!!localStorage.getItem('jwt'));
    }
    window.addEventListener('authChange', onAuthChange);
    // also listen to storage events (for cross-tab logout/login)
    window.addEventListener('storage', onAuthChange as any);
    return () => {
      window.removeEventListener('authChange', onAuthChange);
      window.removeEventListener('storage', onAuthChange as any);
    };
  }, []);

  return (
    <header className="straight-header">
      <div className="container d-flex align-items-center justify-content-between">
        <Link to="/" className="brand d-flex align-items-center gap-2" style={{ textDecoration: 'none' }}>
          {logoOk ? (
            <div className="logo-wrapper">
              <img
                src="/Insureconnect.png"
                alt="InsureConnect"
                className="site-logo"
                onError={() => setLogoOk(false)}
              />
            </div>
          ) : (
            <div className="logo-circle logo-fallback">IC</div>
          )}
          <div>
            <div className="brand-title">InsureConnect</div>
            <div className="brand-sub">Client Portal</div>
          </div>
        </Link>

        <nav className="nav-links d-flex align-items-center">
          {isAuth && (
            <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <FaHome style={{ marginRight: 6 }} /> Dashboard
            </NavLink>
          )}
          {isAuth && (
            <>
              <NavLink to="/policies" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><FaFileAlt style={{ marginRight: 6 }} />Policies</NavLink>
              <NavLink to="/claims" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><FaFileInvoiceDollar style={{ marginRight: 6 }} />Claims</NavLink>
            </>
          )}
          {!isAuth && (
            <>
              <NavLink to="/login" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><FaUser style={{ marginRight: 6 }} />Login</NavLink>
              <NavLink to="/register" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><FaUser style={{ marginRight: 6 }} />Register</NavLink>
            </>
          )}
          {isAuth && (
            <button
              className="btn btn-outline-light btn-sm ms-2"
              onClick={() => {
                localStorage.removeItem('jwt');
                window.dispatchEvent(new Event('authChange'));
                navigate('/');
              }}
            >
              Logout
            </button>
          )}
        </nav>
      </div>

      {/* removed wavy SVG for a straight header */}
    </header>
  );
}
