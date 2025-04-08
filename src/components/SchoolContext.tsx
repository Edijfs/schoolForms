// components/SchoolContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SchoolContextType } from '../types/models';

const SchoolContext = createContext<SchoolContextType>({
  schoolName: null
});

interface SchoolProviderProps {
  children: ReactNode;
}

export const SchoolProvider: React.FC<SchoolProviderProps> = ({ children }) => {
  const [schoolName, setSchoolName] = useState<string | null>(null);

  useEffect(() => {
    // Extract school name from URL parameters when component mounts
    const params = new URLSearchParams(window.location.search);
    // Check for both uppercase and lowercase versions of the parameter
    const school = params.get('School') || params.get('school');
    
    if (school) {
      setSchoolName(decodeURIComponent(school));
    }
  }, []);

  return (
    <SchoolContext.Provider value={{ schoolName }}>
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => useContext(SchoolContext);