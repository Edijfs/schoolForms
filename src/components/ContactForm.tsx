import React, { useState } from 'react';

// List of school (for autocomplete)
const school = [
  "IDJV","CLPC","SA","CM","Colegio aguas ferreas"
];

interface FormData {
  name: string;
  email: string;
  message: string;
  country: string;
  topic: string;
  newsletter: boolean;
  terms: boolean;
  selectedTopics: string[]; // Multi-choice selection
}

interface ContactFormProps {
  onSubmit: () => void;
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    country: '',
    topic: '',
    newsletter: false,
    terms: false,
    selectedTopics: [],
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    country: '',  // Added country error
    terms: '',
  });

  const [showTerms, setShowTerms] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState(school);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleCountryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      country: value,
    }));

    if (value) {
      const filtered = school.filter((country) =>
        country.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCountries(filtered);
      setDropdownVisible(true);
    } else {
      setFilteredCountries(school);
      setDropdownVisible(false);
    }
  };

  const handleCountrySelect = (country: string) => {
    setFormData((prev) => ({
      ...prev,
      country: country,
    }));
    setDropdownVisible(false); // Close the dropdown once the country is selected
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value =
      e.target.type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', country: '', terms: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.';
      isValid = false;
    }

    if (!formData.country.trim() || !school.includes(formData.country)) {
      newErrors.country = 'Please select a valid country.';
      isValid = false;
    }

    if (!formData.terms) {
      newErrors.terms = 'You must agree to the terms and conditions.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      console.log('Form data:', formData);
      onSubmit();
    }
  };

  return (
    <div className="min-vh-100 bg-warning bg-gradient d-flex align-items-center">
      <div className="container-fluid px-4 py-3">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <form
              onSubmit={handleSubmit}
              className="card p-4 shadow-lg bg-white bg-opacity-75"
              autoComplete="on" // Enable form-wide autofill
            >
              <h3 className="text-center mb-4">School Name</h3>

              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className={`form-control form-control-lg ${
                    errors.name ? 'is-invalid' : ''
                  }`}
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="digite o nome"
                  autoComplete="name" // Enable autofill for name
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className={`form-control form-control-lg ${
                    errors.email ? 'is-invalid' : ''
                  }`}
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="digite o email"
                  autoComplete="email" // Enable autofill for email
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="country" className="form-label">
                  Escola
                </label>
                <input
                  type="text"
                  className={`form-control form-control-lg ${
                    errors.country ? 'is-invalid' : ''
                  }`}
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleCountryInput}
                  placeholder="digite o nome da escola..."
                  autoComplete="country" // Enable autofill for country
                />
                {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                {isDropdownVisible && (
                  <ul className="list-group mt-1" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    {filteredCountries.map((country, index) => (
                      <li
                        key={index}
                        className="list-group-item list-group-item-action"
                        onClick={() => handleCountrySelect(country)}
                      >
                        {country}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className={`form-check-input ${
                      errors.terms ? 'is-invalid' : ''
                    }`}
                    id="terms"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    autoComplete="off" // Disable autofill for this checkbox
                  />
                  <label className="form-check-label" htmlFor="terms">
                    Eu aceito os {' '}
                    <span
                      className="text-primary text-decoration-underline"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setShowTerms(true)}
                    >
                      Termos e condições
                    </span>
                  </label>
                  {errors.terms && <div className="invalid-feedback">{errors.terms}</div>}
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-100">
                Validar
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTerms && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Termos e condições</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowTerms(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Here are the terms and conditions of using this service...
                  [Insert your terms and conditions here]
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowTerms(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
