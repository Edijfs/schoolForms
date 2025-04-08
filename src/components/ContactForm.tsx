// ContactForm.tsx
import React, { useState } from "react";
import { useSchool } from "../components/SchoolContext";
import BrandedFormWrapper from "./BrandedFormWrapper";

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
    name_ed: "",
    email: "",
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    <div className="d-flex align-items-center py-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            {/* School Name Header */}
            {schoolName && (
              <h2 className="text-center mb-3 text-primary fs-1">
                {decodeURIComponent(schoolName)}
              </h2>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit}>
              <BrandedFormWrapper 
                title="Informações do encarregado de educação"
                subtitle="Preencha os dados"
              >
                {/* Name Field */}
                <div className="mb-3">
                  <label htmlFor="name_ed" className="form-label">
                    Nome:
                  </label>
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
                  <label htmlFor="email" className="form-label">
                    Email:
                  </label>
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
                      className={`form-check-input ${
                        showTermsError ? "is-invalid" : ""
                      }`}
                      id="terms"
                      checked={termsAccepted}
                      onChange={handleTermsCheckbox}
                    />
                    <label className="form-check-label" htmlFor="terms">
                      Eu aceito os{" "}
                      <button
                        type="button"
                        className="btn btn-link p-0 d-inline text-decoration-none"
                        onClick={handleTermsClick}
                        style={{ verticalAlign: "baseline" }}
                      >
                        termos e condições
                      </button>
                    </label>
                    {showTermsError && (
                      <div className="invalid-feedback">
                        Tem de aceitar os termos e condições para avançar
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-100">
                  Avançar
                </button>
              </BrandedFormWrapper>
            </form>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      <div
        className={`modal fade ${showTermsModal ? "show" : ""}`}
        style={{
          display: showTermsModal ? "block" : "none",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
        tabIndex={-1}
        role="dialog"
        aria-modal={showTermsModal}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Termos e condições</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={handleCloseModal}
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="terms-content">
                <h6>1. Termos Gerais</h6>
                <p>
                  Ao fazer um pedido através da nossa plataforma, concorda
                  com estes termos e condições.
                </p>

                <h6>2. Processamento do Pedido</h6>
                <p>
                  Receberá uma confirmação por email com os detalhes do seu pedido.
                  Os pedidos serão dados como processados após efetuar o pagamento na sua escola.
                  Os pedidos realizados após o termino da data indicada, não seram processados.
                </p>

                <h6>3. Informações Pessoais</h6>
                <p>
                  As informações pessoais serão tratadas de acordo com nossa
                  política de privacidade e utilizadas apenas para processamento
                  de pedidos e fins de comunicação.
                  Não nos responsabilizamos por erros no preenchimento do formulário.
                </p>

                <h6>4. Entrega</h6>
                <p>
                  Os pedidos serão entregues na escola.
                </p>

                <h6>5. Alterações e Cancelamentos</h6>
                <p>
                  Por favor, entre em contato com a Fcpro através do nºtel: 932595411, ou email 
                  fcpro.pbl@gmail.com para efetuar alterações ou cancelamentos do seu pedido.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Fechar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAcceptTerms}
              >
                Aceitar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;