import { useState } from 'react';
import ContactForm from './components/ContactForm';
import StudentForm from './components/StudentForm';
import OrderForm from './components/OrderForm';

export default function App() {
  const [currentForm, setCurrentForm] = useState<'contact' | 'student' | 'order'>('contact');
  const [formData, setFormData] = useState({
    contact: null,
    student: null
  });

  const handleContactSubmit = async (data: any) => {
    console.log('Contact Form Data:', data);
    setFormData(prev => ({ ...prev, contact: data }));
    setCurrentForm('student');
  };

  const handleStudentSubmit = async (data: any) => {
    console.log('Student Form Data:', data);
    setFormData(prev => ({ ...prev, student: data }));
    setCurrentForm('order');
  };

  return (
    <>
      {currentForm === 'contact' && (
        <ContactForm onSubmit={handleContactSubmit} />
      )}
      {currentForm === 'student' && (
        <StudentForm onSubmit={handleStudentSubmit} />
      )}
      {currentForm === 'order' && <OrderForm />}
    </>
  );
}