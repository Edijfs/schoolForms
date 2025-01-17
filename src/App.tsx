// App.tsx
import { useState } from 'react';
import ContactForm from './components/ContactForm';
import StudentForm from './components/StudentForm';
import OrderForm from './components/OrderForm';
import { submitOrder } from './api/directusService';
import { sendOrderConfirmationEmail } from './api/emailService';

interface OrderData {
  name_ed: string;
  email: string;
  name_stu: string;
  school: string;
  class: string;
  packs: string[];
  extras: string[];
  observation: string;
  totalCost: number;
}

export default function App() {
  const [currentForm, setCurrentForm] = useState<'contact' | 'student' | 'order'>('contact');
  const [orderData, setOrderData] = useState<Partial<OrderData>>({});

  const handleContactSubmit = (data: { name_ed: string; email: string }) => {
    setOrderData(prev => ({ ...prev, ...data }));
    setCurrentForm('student');
  };

  const handleStudentSubmit = (data: { name_stu: string; school: string; class: string }) => {
    setOrderData(prev => ({ ...prev, ...data }));
    setCurrentForm('order');
  };

  const handleOrderSubmit = async (data: { 
    packs: string[]; 
    extras: string[]; 
    observation: string;
    totalCost: number;
  }) => {
    const finalData = { ...orderData, ...data } as OrderData;
    
    try {
      // Submit order to Directus
      const orderResult = await submitOrder(finalData);
      
      if (!orderResult) {
        throw new Error('Failed to submit order');
      }

      // Only send confirmation email if order was successfully submitted
      try {
        await sendOrderConfirmationEmail(finalData);
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the whole operation if just the email fails
      }
      
      // Reset form and go back to contact form
      setOrderData({});
      setCurrentForm('contact');
    } catch (error) {
      console.error('Error processing order:', error);
      throw error; // Re-throw the error so OrderForm can handle it
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      {currentForm === 'contact' && (
        <ContactForm onSubmit={handleContactSubmit} />
      )}
      {currentForm === 'student' && (
        <StudentForm onSubmit={handleStudentSubmit} />
      )}
      {currentForm === 'order' && (
        <OrderForm onSubmit={handleOrderSubmit} />
      )}
    </div>
  );
}