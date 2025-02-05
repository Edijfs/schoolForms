// App.tsx
import { useState } from 'react';
import ContactForm from './components/ContactForm';
import StudentForm from './components/StudentForm';
import OrderForm from './components/OrderForm';
import { submitOrder } from './api/directusService';
import { sendOrderConfirmationEmail } from './api/emailService';
import { SchoolProvider } from './components/SchoolContext';

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

  const handleStudentSubmit = (data: { name_stu: string; class: string }) => {
    // Get school from URL parameter
    const params = new URLSearchParams(window.location.search);
    const school = params.get('school') || 'Unknown School';
    
    setOrderData(prev => ({ 
      ...prev, 
      ...data,
      school // Add school to the order data
    }));
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
      const orderResult = await submitOrder(finalData);
      
      if (!orderResult) {
        throw new Error('Failed to submit order');
      }

      try {
        await sendOrderConfirmationEmail(finalData);
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }
      
      setOrderData({});
      setCurrentForm('contact');
    } catch (error) {
      console.error('Error processing order:', error);
      throw error;
    }
  };

  return (
    <SchoolProvider>
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
    </SchoolProvider>
  );
}