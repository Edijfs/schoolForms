// ContactForm.tsx
import React, { useState } from 'react';
import { useSchool } from '../components/SchoolContext';

interface ContactFormProps {
  onSubmit: (data: { name_ed: string; email: string }) => void;
}

interface FormData {
  name_ed: string;
  email: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const { schoolName } = useSchool();
  const [formData, setFormData] = useState<FormData>({
    name_ed: '',
    email: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

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

  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    setShowTermsError(false);
    setShowTermsModal(false);
  };

  const handleTermsClick = () => {
    setShowTermsModal(true);
  };

  const handleCloseModal = () => {
    setShowTermsModal(false);
  };

  const handleTermsCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            {/* School Name Header */}
            {schoolName && (
              <h2 className="text-center mb-4">
                A minha escola - {decodeURIComponent(schoolName)}
              </h2>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="card shadow-sm">
              <div className="card-body p-4">
                <h3 className="text-center mb-4">Contact Information</h3>
                
                {/* Name Field */}
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

                {/* Email Field */}
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

                {/* Terms Checkbox */}
                <div className="mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className={`form-check-input ${showTermsError ? 'is-invalid' : ''}`}
                      id="terms"
                      checked={termsAccepted}
                      onChange={handleTermsCheckbox}
                    />
                    <label className="form-check-label" htmlFor="terms">
                      I accept the{' '}
                      <button
                        type="button"
                        className="btn btn-link p-0 d-inline text-decoration-none"
                        onClick={handleTermsClick}
                        style={{ verticalAlign: 'baseline' }}
                      >
                        terms and conditions
                      </button>
                    </label>
                    {showTermsError && (
                      <div className="invalid-feedback">
                        You must accept the terms and conditions to proceed
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
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
        className={`modal fade ${showTermsModal ? 'show' : ''}`}
        style={{ 
          display: showTermsModal ? 'block' : 'none', 
          backgroundColor: 'rgba(0,0,0,0.5)' 
        }}
        tabIndex={-1}
        role="dialog"
        aria-modal={showTermsModal}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Terms and Conditions</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="terms-content">
                <h6>1. General Terms</h6>
                <p>By placing an order through our platform, you agree to these terms and conditions.</p>

                <h6>2. Order Processing</h6>
                <p>Orders will be processed once payment is confirmed. You will receive an email confirmation with your order details.</p>

                <h6>3. Personal Information</h6>
                <p>Your personal information will be handled according to our privacy policy and used only for order processing and communication purposes.</p>

                <h6>4. Delivery</h6>
                <p>Orders will be delivered to the school address provided during registration.</p>

                <h6>5. Changes and Cancellations</h6>
                <p>Please contact our support team for any changes or cancellations to your order.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAcceptTerms}
              >
                Accept Terms
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;