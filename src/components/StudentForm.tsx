// StudentForm.tsx
import React, { useState } from "react";

interface StudentFormProps {
  onSubmit: (data: { 
    name_stu: string;
    year: string;
    turma: string;
  }) => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit }) => {
  // Predefined list of classes
  const turmaOptions = [
    'Sala Amarela',
    'Sala Azul',
    'Sala Verde',
    'Sala Vermelha',
    'A',
    'B',
    'C',
    'D',
    'E'
  ];

  const [formData, setFormData] = useState({
    name_stu: "",
    year: "",
    selectedTurma: "" // Changed from turma to selectedTurma
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Combine year and turma
    const combinedData = {
      name_stu: formData.name_stu,
      year: formData.year,
      turma: `${formData.year}º${formData.selectedTurma}` // Concatenate year and turma
    };
    onSubmit(combinedData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <form onSubmit={handleSubmit} className="card shadow-sm">
              <div className="card-body p-4">
                <h3 className="text-center mb-4">Informações do estudante</h3>

                {/* Student Name Field */}
                <div className="mb-4">
                  <label htmlFor="name_stu" className="form-label">
                    Nome completo do aluno
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name_stu"
                    name="name_stu"
                    value={formData.name_stu}
                    onChange={handleChange}
                    required
                    placeholder="Digite o nome completo"
                  />
                </div>

                {/* Year Field */}
                <div className="mb-4">
                  <label htmlFor="year" className="form-label">
                    Ano
                  </label>
                  <select
                    className="form-select"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione o ano</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((year) => (
                      <option key={year} value={year}>
                        {year}º ano
                      </option>
                    ))}
                  </select>
                </div>

                {/* Class Selection */}
                <div className="mb-4">
                  <label htmlFor="selectedTurma" className="form-label">
                    Turma / Sala
                  </label>
                  <select
                    className="form-select"
                    id="selectedTurma"
                    name="selectedTurma"
                    value={formData.selectedTurma}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione a turma</option>
                    {turmaOptions.map((turma) => (
                      <option key={turma} value={turma}>
                        {turma}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preview of combined class */}
                {(formData.year || formData.selectedTurma) && (
                  <div className="alert alert-info mb-4">
                    <small>
                      {formData.year && `${formData.year}º`}{formData.selectedTurma}
                    </small>
                  </div>
                )}

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-100">
                  Avançar
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