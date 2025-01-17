// ContactForm.tsx
import React, { useState } from 'react';

interface ContactFormProps {
  onSubmit: (data: { name_ed: string; email: string }) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name_ed: '',
    email: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      setShowTermsError(true);
      return;
    }
    
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
    if (e.target.checked) {
      setShowTermsError(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <form onSubmit={handleSubmit} className="card shadow-sm">
              <div className="card-body p-4">
                <h3 className="text-center mb-4">Contact Information</h3>
                
                <div className="mb-3">
                  <label htmlFor="name_ed" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name_ed"
                    name="name_ed"
                    value={formData.name_ed}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className={`form-check-input ${showTermsError ? 'is-invalid' : ''}`}
                      id="terms"
                      checked={termsAccepted}
                      onChange={handleTermsChange}
                    />
                    <label className="form-check-label" htmlFor="terms">
                      I accept the{' '}
                      <a 
                        href="#" 
                        data-bs-toggle="modal" 
                        data-bs-target="#termsModal"
                        onClick={(e) => e.preventDefault()}
                        className="text-primary text-decoration-none"
                      >
                        terms and conditions
                      </a>
                    </label>
                    {showTermsError && (
                      <div className="invalid-feedback">
                        You must accept the terms and conditions to proceed
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      <div 
        className="modal fade" 
        id="termsModal" 
        tabIndex={-1}
        aria-labelledby="termsModalLabel" 
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="termsModalLabel">Terms and Conditions</h5>
              <button 
                type="button" 
                className="btn-close" 
                data-bs-dismiss="modal" 
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h6>1. Introduction</h6>
              <p>These Website Standard Terms and Conditions written on this webpage shall manage your use of our website.</p>
              
              <h6>2. Data Collection</h6>
              <p>We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services.</p>
              
              <h6>3. Use of Information</h6>
              <p>The personal information we collect is used to process your orders, manage your account, and provide you with customer service.</p>
              
              <h6>4. Privacy Policy</h6>
              <p>Your privacy is important to us. It is our policy to respect your privacy regarding any information we may collect from you across our website.</p>
              
              <h6>5. Cookies</h6>
              <p>We employ the use of cookies. By accessing our website, you agreed to use cookies in agreement with our Privacy Policy.</p>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-primary" 
                data-bs-dismiss="modal"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;