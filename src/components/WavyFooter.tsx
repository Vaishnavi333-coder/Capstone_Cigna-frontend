import React from 'react';
import './WavyLayout.css';
import { FaEnvelope, FaPhone } from 'react-icons/fa';

export default function WavyFooter() {
  return (
    <footer className="wavy-footer mt-5">
      <svg className="wavy-top" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path fill="#fff" d="M0,40 C200,0 320,80 720,40 C1120,0 1240,80 1440,40 L1440,0 L0,0 Z"></path>
      </svg>

      <div className="container footer-content">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h5 className="text-white">InsureConnect</h5>
            <p className="text-white-70 mb-0">Smart Insurance for a Smarter You.</p>
          </div>
          <div className="col-md-6 text-md-end mt-3 mt-md-0">
            <span className="text-white me-3"><FaPhone /> +1 800 000 000</span>
            <span className="text-white"><FaEnvelope /> support@insureconnect.com</span>
          </div>
        </div>
      </div>
      <div className="container text-center mt-2">
        <div className="footer-copyright small">© {new Date().getFullYear()} InsureConnect — All rights reserved.</div>
      </div>
    </footer>
  );
}
