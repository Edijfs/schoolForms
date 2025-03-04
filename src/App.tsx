// App.tsx - Updated with new CSS import
import { useState } from 'react';
import ContactForm from './components/ContactForm';
import StudentForm from './components/StudentForm';
import OrderForm from './components/OrderForm';
import BrandHeader from './components/BrandHeader';
import BrandFooter from './components/BrandFooter';
import BackgroundLayout from './components/BackgroundLayout';
import { apiService } from './services/api';
import { SchoolProvider } from './components/SchoolContext';
import { OrderData, OrderFormData, ContactFormData, StudentFormData } from './types/models';
import './styles/background.css';
import './styles/brand.css';
import './styles/forms.css'; // Add this new import

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

  // Function to determine the progress step
  const getProgressStep = () => {
    switch(currentForm) {
      case 'contact': return 1;
      case 'student': return 2;
      case 'order': return 3;
      default: return 1;
    }
  };

  return (
    <SchoolProvider>
      <BackgroundLayout imagePath="/images/school-background.jpg">
        <div className="container py-3">
          {/* Brand Header */}
          <BrandHeader />
          
          {/* Progress Indicator */}
          <div className="progress-container mb-3">
            <div className="progress" style={{ height: '4px' }}>
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ width: `${(getProgressStep() / 3) * 100}%` }} 
                aria-valuenow={getProgressStep()} 
                aria-valuemin={1} 
                aria-valuemax={3}
              ></div>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <span className={`small ${getProgressStep() >= 1 ? 'text-primary' : 'text-muted'}`}>
                Contacto
              </span>
              <span className={`small ${getProgressStep() >= 2 ? 'text-primary' : 'text-muted'}`}>
                Estudante
              </span>
              <span className={`small ${getProgressStep() >= 3 ? 'text-primary' : 'text-muted'}`}>
                Encomenda
              </span>
            </div>
          </div>
          
          {/* Form Content */}
          <div className="form-container">
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
          
          {/* Brand Footer */}
          <BrandFooter />
        </div>
      </BackgroundLayout>
    </SchoolProvider>
  );
}