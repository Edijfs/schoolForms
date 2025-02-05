// SchoolContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

interface SchoolContextType {
  schoolName: string | null;
}

const SchoolContext = createContext<SchoolContextType>({
  schoolName: null,
});

export const useSchool = () => useContext(SchoolContext);

interface SchoolProviderProps {
  children: React.ReactNode;
}

export const SchoolProvider: React.FC<SchoolProviderProps> = ({ children }) => {
  const [schoolName, setSchoolName] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const school = params.get('school');
    setSchoolName(school);
  }, []);

  return (
    <SchoolContext.Provider value={{ schoolName }}>
      {children}
    </SchoolContext.Provider>
  );
};