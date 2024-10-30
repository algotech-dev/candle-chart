// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>Time Line Investments</h5>
            <p className="mb-0">Empowering investors with advanced trading solutions</p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="mb-0">&copy; 2024 Time Line Investments. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;