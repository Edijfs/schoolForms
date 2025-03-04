// components/BrandHeader.tsx
import React from 'react';

interface BrandHeaderProps {
  logoPath?: string;
}

const BrandHeader: React.FC<BrandHeaderProps> = ({ logoPath = '/images/fcpro-logo.png' }) => {
  return (
    <div className="brand-header text-center mb-2">
      <img 
        src={logoPath} 
        alt="FCPro School" 
        className="brand-logo img-fluid mb-1" 
        style={{ maxHeight: '200px' }} 
      />
    </div>
  );
};

export default BrandHeader;