import React, { useState } from 'react';

interface StudentFormProps {
  onSubmit: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
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
      onSubmit();
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            <form onSubmit={handleSubmit} className="card shadow-sm">
              <div className="card-body p-4">
                <h3 className="text-center mb-4">Informações do Aluno</h3>

                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Digite o nome completo"
                  />
                  {errors.firstName && (
                    <div className="invalid-feedback">{errors.firstName}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Turma
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Digite a turma"
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="address" className="form-label">
                    Observações
                  </label>
                  <textarea
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Digite as observações"
                    rows={3}
                  />
                  {errors.address && (
                    <div className="invalid-feedback">{errors.address}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Próximo
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;