// components/BrandHeader.tsx
import React from 'react';

interface BrandHeaderProps {
  logoPath?: string;
  logoLink?: string;
}

const BrandHeader: React.FC<BrandHeaderProps> = ({ 
  logoPath = '/images/fcpro-logo.png',
  logoLink = 'https://fcpro.pt' 
}) => {
  return (
    <div className="brand-header text-center mb-4">
      <a href={logoLink} target="_blank" rel="noopener noreferrer">
        <img 
          src={logoPath} 
          alt="FCPro School" 
          className="brand-logo img-fluid mb-2" 
          style={{ maxHeight: '200px', cursor: 'pointer' }} 
        />
      </a>
      <div className="brand-tagline">
        <p className="text-primary mb-2 fs-5 fw-bold">Fotografia Escolar</p>
      </div>
    </div>
  );
};

export default BrandHeader;