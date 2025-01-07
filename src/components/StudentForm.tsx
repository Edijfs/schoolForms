import React, { useState } from 'react';

interface StudentFormData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}

interface StudentFormProps {
  onSubmit: (data: StudentFormData) => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({
    firstName: '',
    phone: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors = { firstName: '', phone: '', address: '' };
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Nome completo é obrigatório.';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Turma é obrigatória.';
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Observações são obrigatórias.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData); // Call the parent onSubmit callback with formData
    }
  };

  return (
    <div className="min-vh-100 bg-secondary bg-gradient d-flex align-items-center">
      <div className="container-fluid px-4 py-3">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <form
              onSubmit={handleSubmit}
              className="card p-4 shadow-lg bg-white bg-opacity-75"
              autoComplete="on"
            >
              <h3 className="text-center mb-4">Informações do Aluno</h3>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="firstName" className="form-label">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${errors.firstName ? 'is-invalid' : ''}`}
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Digite o nome completo"
                    autoComplete="given-name"
                  />
                  {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  Turma
                </label>
                <input
                  type="tel"
                  className={`form-control form-control-lg ${errors.phone ? 'is-invalid' : ''}`}
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Digite a turma"
                  autoComplete="tel"
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  Observações
                </label>
                <textarea
                  className={`form-control form-control-lg ${errors.address ? 'is-invalid' : ''}`}
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Digite as observações"
                  rows={3}
                  autoComplete="address-line1"
                />
                {errors.address && <div className="invalid-feedback">{errors.address}</div>}
              </div>

              <button type="submit" className="btn btn-secondary btn-lg w-100">
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;
