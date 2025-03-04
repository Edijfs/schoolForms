// components/BrandedFormWrapper.tsx
import React, { ReactNode } from 'react';

interface BrandedFormWrapperProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const BrandedFormWrapper: React.FC<BrandedFormWrapperProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  return (
    <div className="card shadow-sm border-brand border-2">
      <div className="card-body p-4">
        <div className="form-header text-center mb-4">
          <h3 className="card-title text-uppercase fs-6 fw-bold">{title}</h3>
          {subtitle && <h5 className="text-muted mb-4">{subtitle}</h5>}
        </div>

        {children}
        
        <div className="text-center mt-3">
          <small className="text-muted">
            Questões sobre a sua encomenda? {' '} 
            <a href="mailto:escolas.fcpro@gmail.com" className="text-decoration-none">
              Enviar email
            </a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default BrandedFormWrapper;