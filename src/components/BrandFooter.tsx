// components/BrandFooter.tsx
import React from 'react';

const BrandFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="brand-footer text-center mt-4 py-3">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <p className="mb-1">
              <small className="text-muted">
                &copy; {currentYear} FCPro Fotografia profissional. rights reserved.
              </small>
            </p>
            <div className="contact-info small text-muted">
              <p className="mb-0">Contacto: fcpro.pbl@gmail.com | Tel: 932595411</p>
            </div>
            <div className="mt-2">
              <a href="#" className="text-decoration-none mx-1">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-decoration-none mx-1">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-decoration-none mx-1">  
                <i className="bi bi-envelope"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BrandFooter;