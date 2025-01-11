
import { useState } from 'react';
import ContactForm from './components/ContactForm';
import StudentForm from './components/StudentForm';
import OrderForm from './components/OrderForm';

export default function App() {
  const [currentForm, setCurrentForm] = useState<'contact' | 'student' | 'order'>('contact');

  return (
    <>
      {currentForm === 'contact' && (
        <ContactForm onSubmit={async () => setCurrentForm('student')} />
      )}
      {currentForm === 'student' && (
        <StudentForm onSubmit={async() => setCurrentForm('order')} />
      )}
      {currentForm === 'order' && <OrderForm />}
    </>
  );
}


/*
import { useState } from 'react';
import OrderForm from './components/OrderForm';

export default function App() {
  return (
    <>
      <OrderForm />
    </>
  );
}

*/