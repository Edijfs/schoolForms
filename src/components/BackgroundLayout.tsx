// components/BackgroundLayout.tsx
import { ReactNode, useState, useEffect } from 'react';

interface BackgroundLayoutProps {
  children: ReactNode;
  imagePath: string;
}

const BackgroundLayout: React.FC<BackgroundLayoutProps> = ({ children, imagePath }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Preload the image to check if it exists
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => {
      console.warn('Background image failed to load:', imagePath);
      setImageLoaded(false);
    };
    img.src = imagePath;
  }, [imagePath]);

  return (
    <div 
      className={`background-container ${imageLoaded ? 'bg-image' : 'bg-light'}`}
      style={imageLoaded ? { backgroundImage: `url(${imagePath})` } : {}}
    >
      <div className="bg-overlay"></div>
      <div className="content-container">
        {children}
      </div>
    </div>
  );
};

export default BackgroundLayout;