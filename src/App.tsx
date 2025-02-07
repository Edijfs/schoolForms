// App.tsx
import { useState } from 'react';
import ContactForm from './components/ContactForm';
import StudentForm from './components/StudentForm';
import OrderForm from './components/OrderForm';
import { apiService } from './services/api';
import { SchoolProvider } from './components/SchoolContext';
import { OrderData, OrderFormData, ContactFormData, StudentFormData } from './types/models';

export default function App() {
  const [currentForm, setCurrentForm] = useState<'contact' | 'student' | 'order'>('contact');
  const [orderData, setOrderData] = useState<Partial<OrderData>>({});

  const handleContactSubmit = (data: ContactFormData) => {
    setOrderData(prev => ({ 
      ...prev,
      nome_ed: data.name_ed,   
      email: data.email
    }));
    setCurrentForm('student');
  };
  
  const handleStudentSubmit = (data: StudentFormData) => {
    const params = new URLSearchParams(window.location.search);
    const school = params.get('school') || 'Unknown School';
    
    setOrderData(prev => ({ 
      ...prev,
      nome_stu: data.name_stu,  
      turma: data.turma,        
      escola: school            
    }));
    setCurrentForm('order');
  };

  const handleOrderSubmit = async (formData: OrderFormData) => {
    console.log('Form Data Received:', formData);
    
    const finalData: OrderData = {
      nome_ed: orderData.nome_ed || '',
      email: orderData.email || '',
      nome_stu: orderData.nome_stu || '',
      escola: orderData.escola || '',
      turma: orderData.turma || '',
      packs: formData.packs,
      extras: formData.extras,
      obs: formData.obs,
      total_enc: formData.total_enc
    };
  
    console.log('Final Data:', finalData);
    
    try {
      await apiService.processOrder(finalData);
      setOrderData({});
      setCurrentForm('contact');
    } catch (error: unknown) {
      console.error('Process Order Error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unknown error occurred');
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