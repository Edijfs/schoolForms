import { useState, useEffect } from 'react';
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
import './styles/forms.css';

export default function App() {
  const [currentForm, setCurrentForm] = useState<'contact' | 'student' | 'order'>('contact');
  const [orderData, setOrderData] = useState<Partial<OrderData>>({});
  const [schoolName, setSchoolName] = useState<string>('Unknown School');
  
  // Extract school name from URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Check for both uppercase and lowercase versions of the parameter
    const school = params.get('School') || params.get('school') || 'Unknown School';
    setSchoolName(decodeURIComponent(school));
  }, []);

  const handleContactSubmit = (data: ContactFormData) => {
    setOrderData(prev => ({ 
      ...prev,
      nome_ed: data.name_ed,   
      email: data.email,
      escola: schoolName // Set school name here
    }));
    setCurrentForm('student');
  };
  
  const handleStudentSubmit = (data: StudentFormData) => {
    setOrderData(prev => ({ 
      ...prev,
      nome_stu: data.name_stu,  
      turma: data.turma        
    }));
    setCurrentForm('order');
  };

  const handleOrderSubmit = async (formData: OrderFormData) => {
    console.log('Form Data Received:', formData);
    
    const finalData: OrderData = {
      nome_ed: orderData.nome_ed || '',
      email: orderData.email || '',
      nome_stu: orderData.nome_stu || '',
      escola: orderData.escola || schoolName, // Use the schoolName if not set earlier
      turma: orderData.turma || '',
      packs: formData.packs,
      extras: formData.extras,
      obs: formData.obs,
      total_enc: formData.total_enc
    };
  
    console.log('Final Data:', finalData);
    
    try {
      await apiService.processOrder(finalData);
      // No need for timeout reset since the OrderForm will handle this now
    } catch (error: unknown) {
      console.error('Process Order Error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unknown error occurred');
    }
  };
  
  // Add this function to reset to contact form
  const resetToContactForm = () => {
    setOrderData({});
    setCurrentForm('contact');
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
          
          {/* Display School Name */}
          {schoolName && schoolName !== 'Unknown School' && (
            <div className="text-center mb-3">
              <h2 className="text-primary">Escola: {schoolName}</h2>
            </div>
          )}
          
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
              <OrderForm 
                onSubmit={handleOrderSubmit} 
                onReturnToContact={resetToContactForm}  // Pass the navigation function
              />
            )}
          </div>
          
          {/* Brand Footer */}
          <BrandFooter />
        </div>
      </BackgroundLayout>
    </SchoolProvider>
  );
}