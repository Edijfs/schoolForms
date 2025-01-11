import { useState } from 'react';
import ContactForm from './components/ContactForm';
import StudentForm from './components/StudentForm';
import OrderForm from './components/OrderForm';

export default function App() {
  const [currentForm, setCurrentForm] = useState<'contact' | 'student' | 'order'>('contact');

  return (
    <div className="min-vh-100 bg-light">
      {currentForm === 'contact' && (
        <ContactForm onSubmit={() => setCurrentForm('student')} />
      )}
      {currentForm === 'student' && (
        <StudentForm onSubmit={() => setCurrentForm('order')} />
      )}
      {currentForm === 'order' && <OrderForm />}
    </div>
  );
}
