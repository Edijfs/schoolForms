import { useState } from 'react';
import ContactForm from './components/ContactForm';
import StudentForm from './components/StudentForm';

export default function App() {
  const [currentForm, setCurrentForm] = useState<'contact' | 'order'>('contact'); // Use lowercase for consistency

  return (
    <>
      {currentForm === 'contact' && (
        <ContactForm onSubmit={() => setCurrentForm('order')} />
      )}
      {currentForm === 'order' && <StudentForm />}
    </>
  );
}

