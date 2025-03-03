// components/SchoolContext.tsx
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { SchoolContextType } from '../types/models';

// Create a context with a default value
const SchoolContext = createContext<SchoolContextType>({
  schoolName: null
});

// Create a provider component
export const SchoolProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [schoolName, setSchoolName] = useState<string | null>(null);

  useEffect(() => {
    // Parse the URL to extract the school parameter (case-insensitive)
    const params = new URLSearchParams(window.location.search);
    // Check for both 'school' and 'School' to handle case sensitivity
    const school = params.get('school') || params.get('School');
    
    // Set the school name state
    if (school) {
      // Store the raw value, we'll decode it when displaying
      setSchoolName(school);
      
      // Also store it in localStorage for persistence across the app
      localStorage.setItem('schoolName', school);
    }
  }, []);

  return (
    <SchoolContext.Provider value={{ schoolName }}>
      {children}
    </SchoolContext.Provider>
  );
};

// Custom hook for using the context
export const useSchool = () => useContext(SchoolContext);