// components/OrderForm.tsx
import React, { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { OrderFormProps } from "../types/models";

interface QuantityControlProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  isDisabled: boolean;
}

const OrderForm: React.FC<OrderFormProps> = ({ onSubmit, onReturnToContact }) => {
  // Use the products hook instead of direct imports
  const { products: packs, extras, loading, error } = useProducts();

  const [selectedPacks, setSelectedPacks] = useState<Map<string, number>>(
    new Map()
  );
  const [selectedExtras, setSelectedExtras] = useState<Map<string, number>>(
    new Map()
  );

  const [observation, setObservation] = useState("");
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPackModal, setShowPackModal] = useState(false);
  const [showOfferToast, setShowOfferToast] = useState(false);

  const handlePackClick = (packId: string) => {
    const selectedPack = packs.find((p) => p.id === packId);
    const isPackSelected = selectedPacks.has(packId);

    // Only show modal if selecting "pack Irmãos" (not deselecting)
    if (
      selectedPack?.name.toLowerCase().includes("irmãos") &&
      !isPackSelected
    ) {
      setShowPackModal(true);
    }

    setSelectedPacks((prev) => {
      const newPacks = new Map(prev);
      if (newPacks.has(packId)) {
        newPacks.delete(packId);
      } else {
        newPacks.set(packId, 1);
      }
      return newPacks;
    });
  };
  //quantity control
  const QuantityControl: React.FC<QuantityControlProps> = ({
    quantity,
    onIncrement,
    onDecrement,
    isDisabled,
  }) => (
    <div
      className="btn-group btn-group-sm"
      role="group"
      aria-label="Quantity controls"
    >
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={(e) => {
          e.stopPropagation();
          onDecrement();
        }}
        disabled={isDisabled || quantity <= 1}
      >
        <i className="bi bi-dash"></i>
      </button>
      <span className="btn btn-outline-primary disabled">{quantity}</span>
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={(e) => {
          e.stopPropagation();
          onIncrement();
        }}
        disabled={isDisabled || quantity >= 99}
      >
        <i className="bi bi-plus"></i>
      </button>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="alert alert-danger" role="alert">
          Error loading products: {error.message}
        </div>
      </div>
    );
  }

  const getOfferedItemId = (): { id: string; quantity: number } | null => {
    // Calculate total quantity of all extras
    const totalQuantity = Array.from(selectedExtras.values()).reduce(
      (sum, qty) => sum + qty,
      0
    );
  
    // Only apply offer if total quantity > 2
    if (totalQuantity <= 2) return null;
  
    // Find the cheapest extra among the selected ones
    const selectedExtrasWithPrices = Array.from(selectedExtras.entries())
      .map(([extraId]) => {
        const extra = extras.find((e) => e.extra === extraId);
        return {
          id: extraId,
          price: extra?.price || 0,
        };
      })
      .sort((a, b) => a.price - b.price);
  
    // Return the cheapest selected extra with quantity 1
    return selectedExtrasWithPrices.length > 0
      ? { id: selectedExtrasWithPrices[0].id, quantity: 1 }
      : null;
  };

  const calculateTotals = () => {
    let packTotal = 0;
    let extrasTotal = 0;
  
    // Calculate pack total
    selectedPacks.forEach((qty, packId) => {
      const product = packs.find((p) => p.id === packId);
      if (product) {
        packTotal += product.price * qty;
      }
    });
  
    // Calculate extras total
    const offeredItem = getOfferedItemId();
    selectedExtras.forEach((qty, extraId) => {
      const extra = extras.find((e) => e.extra === extraId);
      if (extra) {
        if (offeredItem && extraId === offeredItem.id) {
          // Price for offered item: multiply (qty - 1) by price since 1 quantity is free
          extrasTotal += extra.price * (qty - 1);
        } else {
          // Normal price for non-offered items
          extrasTotal += extra.price * qty;
        }
      }
    });
  
    return {
      packTotal,
      extrasTotal,
      total: packTotal + extrasTotal,
      offeredItemId: offeredItem?.id || null,
    };
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleExtraToggle = (extraId: string) => {
    setSelectedExtras((prev) => {
      const newExtras = new Map(prev);
      if (newExtras.has(extraId)) {
        newExtras.delete(extraId);
      } else {
        newExtras.set(extraId, 1);
        
        // Verificar se com este novo extra atingimos 3 ou mais no total
        const totalExtrasCount = Array.from(newExtras.values()).reduce((sum, qty) => sum + qty, 0);
        if (totalExtrasCount === 3) {
          // Mostrar o toast apenas quando atingir exatamente 3 extras
          setShowOfferToast(true);
          
          // Fechar o toast automaticamente após 5 segundos
          setTimeout(() => {
            setShowOfferToast(false);
          }, 8000);
        }
      }
      return newExtras;
    });
  };

  const handleQuantityChange = (
    type: "pack" | "extra",
    id: string,
    value: string
  ) => {
    const quantity = value === "" ? 1 : parseInt(value);
    const validQuantity = Math.max(1, Math.min(99, quantity || 1));

    if (type === "pack") {
      setSelectedPacks((prev) => {
        const newPacks = new Map(prev);
        newPacks.set(id, validQuantity);
        return newPacks;
      });
    } else {
      setSelectedExtras((prev) => {
        const newExtras = new Map(prev);
        newExtras.set(id, validQuantity);
        
        // Verificar se esta mudança de quantidade fez atingir 3 extras
        const totalBefore = Array.from(prev.values()).reduce((sum, qty) => sum + qty, 0);
        const totalAfter = Array.from(newExtras.values()).reduce((sum, qty) => sum + qty, 0);
        
        if (totalBefore < 3 && totalAfter >= 3) {
          // Mostrar o toast quando atingir 3 ou mais extras através do incremento
          setShowOfferToast(true);
          
          // Fechar o toast automaticamente após 5 segundos
          setTimeout(() => {
            setShowOfferToast(false);
          }, 5000);
        }
        
        return newExtras;
      });
    }
  };

  const handleSubmit = async () => {
    const totals = calculateTotals();
    const orderData = {
      packs: Array.from(selectedPacks.entries()).map(([packId, qty]) => {
        const product = packs.find((p) => p.id === packId);
        // Use product name instead of ID
        return `${product?.name || packId} (x${qty}) - ${formatCurrency(
          (product?.price ?? 0) * qty
        )}`;
      }),
      extras: Array.from(selectedExtras.entries()).map(([extraId, qty]) => {
        const extra = extras.find((e) => e.extra === extraId);
        const isOffered = extraId === totals.offeredItemId;
        return `${extraId} (x${qty}) ${
          isOffered ? "[1 UNIDADE OFERTA]" : ""
        } - ${formatCurrency(isOffered ? (extra?.price ?? 0) * (qty - 1) : (extra?.price ?? 0) * qty)}`;
      }),
      obs: observation,
      total_enc: totals.total,
    };

    console.log("Order Form Data:", orderData); // Debug log

    setIsSubmitting(true);

    try {
      await onSubmit(orderData);
      setShowSummaryModal(false);
      setSuccessMessage("Encomenda submetida com sucesso! Foi enviado um resumo da sua encomenda para sua caixa de email.");
      setSelectedPacks(new Map());
      setSelectedExtras(new Map());
      setObservation("");
    } catch (error: unknown) {
      console.error("Submit Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Erro ao submeter a encomenda: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handler for the OK button in success message
  const handleSuccessOk = () => {
    setSuccessMessage(null);
    
    // Reset form to initial state
    setSelectedPacks(new Map());
    setSelectedExtras(new Map());
    setObservation("");
    
    // Navigate back to contact form if callback exists
    if (onReturnToContact) {
      onReturnToContact();
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center py-4">
      <div className="container">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h3 className="card-title text-center mb-4 text-uppercase fw-bold">
              Produtos
            </h3>
            <h5 className="text-center mb-4">Sessão fotográfica escolar</h5>


            {/* Pack Information Modal */}
            <div
              className={`modal fade ${showPackModal ? "show" : ""}`}
              style={{
                display: showPackModal ? "block" : "none",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
              tabIndex={-1}
              role="dialog"
              aria-modal={showPackModal}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header bg-warning text-white text-uppercase">
                    <h5 className="modal-title">Informação Importante</h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setShowPackModal(false)}
                      aria-label="Close"
                    />
                  </div>
                  <div className="modal-body">
                    <p>
                    Ao selecionar um Pack de Irmãos, certifique-se que faz o 
                    pedido apenas num dos educandos e faculte as informações 
                    dos outros irmãos nas observações (Nome completo, turma/ano). 
                    Obrigado.
                    </p>
                    <p className="mb-0 text-info">
                      <i className="bi bi-exclamation-triangle"></i>
                      Esta informação é essencial para processarmos corretamente
                      o seu pedido.
                    </p>
                    <p className="mb-0 text-info">
                      <i className="bi bi-exclamation-triangle"></i>
                      Caso pretenda só um pack coloque a sua escolha apenas num dos irmãos.
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-warning text-white"
                      onClick={() => setShowPackModal(false)}
                    >
                      Entendi
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Pack Selection */}
            <div className="mb-4">
              <h5 className="mb-4 text-center fw-bold bg-warning text-white px-3 py-1 rounded ">PACK'S</h5>
              <div className="row g-3">
                {packs.map((product) => (
                  <div className="col-md-4" key={product.id}>
                    <div
                      onClick={() =>
                        !isSubmitting && handlePackClick(product.id)
                      }
                      className={`card h-100 ${
                        selectedPacks.has(product.id) ? "border-warning" : ""
                      } ${isSubmitting ? "opacity-50" : ""}`}
                      style={{
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                      }}
                      role="button"
                    >
                      <div className="card-body text-center">
                        <h6 className="card-title">{product.name}</h6>
                        <p className="card-text small text-muted mb-2">
                          {product.description}
                        </p>
                        <div className="d-flex flex-column align-items-center gap-2">
                          <span className="badge bg-warning fs-6"> {/* cor fundo preço produto */}
                            {formatCurrency(product.price)}
                          </span>
                          {selectedPacks.has(product.id) && (
                            <QuantityControl
                            quantity={selectedPacks.get(product.id) || 1}
                            onIncrement={() =>
                              handleQuantityChange(
                                "pack",
                                product.id,
                                String((selectedPacks.get(product.id) || 1) + 1)
                              )
                            }
                            onDecrement={() =>
                              handleQuantityChange(
                                "pack",
                                product.id,
                                String((selectedPacks.get(product.id) || 1) - 1)
                              )
                            }
                            isDisabled={isSubmitting}
                          />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extras Selection */}
            <div className="mb-4 text-center">
            <h5 className="bg-success text-white px-3 py-1 rounded">EXTRAS
              </h5>
              <p className="fs-5 fw-bold text-success mt-2 mb-3">
                <i className="bi bi-info-circle me-1"></i>
                Selecione 3 ou mais extras e receba 1 unidade do extra de menor valor de oferta
              </p>
              <div className="row g-3">
                {/* Show offer message when total quantity > 2 */}
                {Array.from(selectedExtras.values()).reduce(
                  (sum, qty) => sum + qty,
                  0
                ) > 2 && (
                  <div className="alert alert-success mb-4">
                    <i className="bi bi-gift me-2"></i>
                    OFERTA! Uma unidade do extra de menor valor é gratuita
                    quando seleciona 3 ou mais unidades no total.
                  </div>
                )}
                {extras.map((extra) => (
                  <div className="col-md-4" key={extra.extra}>
                    <div
                      onClick={() =>
                        !isSubmitting && handleExtraToggle(extra.extra)
                      }
                      className={`card h-100 ${
                        selectedExtras.has(extra.extra) ? "border-success" : ""
                      } ${isSubmitting ? "opacity-50" : ""}`}
                      style={{
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                      }}
                      role="button"
                    >
                      <div className="card-body text-center">
                        <h6 className="card-title">{extra.extra}</h6>
                        <p className="card-text small text-muted mb-2">
                          {extra.description}
                        </p>
                        <div className="d-flex flex-column align-items-center gap-2">
                          <span className="badge bg-success fs-6"> {/* cor fundo preço extra */}
                            {formatCurrency(extra.price)} 
                            </span> 
                          {selectedExtras.has(extra.extra) && (
                            <QuantityControl
                            quantity={selectedExtras.get(extra.extra) || 1}
                            onIncrement={() =>
                              handleQuantityChange(
                                "extra",
                                extra.extra,
                                String((selectedExtras.get(extra.extra) || 1) + 1)
                              )
                            }
                            onDecrement={() =>
                              handleQuantityChange(
                                "extra",
                                extra.extra,
                                String((selectedExtras.get(extra.extra) || 1) - 1)
                              )
                            }
                            isDisabled={isSubmitting}
                          />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            {(selectedPacks.size > 0 || selectedExtras.size > 0) && (
              <div className="mb-4 p-3 bg-light rounded">
                <h5 className="mb-3">Total encomenda</h5>
                {selectedPacks.size > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>Packs Subtotal:</span>
                    <span>{formatCurrency(calculateTotals().packTotal)}</span>
                  </div>
                )}
                {selectedExtras.size > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>Extras Subtotal:</span>
                    <span>{formatCurrency(calculateTotals().extrasTotal)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between fw-bold border-top pt-2">
                  <span>Total:</span>
                  <span className="text-primary">
                    {formatCurrency(calculateTotals().total)}
                  </span>
                </div>
              </div>
            )}

            {/* Observations */}
            <div className="mb-4 text-uppercase">
              <label htmlFor="observation" className="form-label">
                Observações
              </label>
              <textarea
                className="form-control"
                id="observation"
                rows={3}
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Adicione alguma informação importante"
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={() => setShowSummaryModal(true)}
              disabled={
                isSubmitting ||
                (selectedPacks.size === 0 && selectedExtras.size === 0)
              }
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  A processar encomenda...
                </>
              ) : (
                "Visualizar encomenda"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Order Review Modal */}
      <div
        className={`modal fade ${showSummaryModal ? "show" : ""}`}
        style={{
          display: showSummaryModal ? "block" : "none",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
        tabIndex={-1}
        role="dialog"
        aria-modal={showSummaryModal}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Resumo da Encomenda</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => !isSubmitting && setShowSummaryModal(false)}
                aria-label="Close"
                disabled={isSubmitting}
              />
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                {/* Selected Packs Summary */}
                {selectedPacks.size > 0 && (
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 d-flex justify-content-between">
                      <span>Packs selecionados</span>
                      <span className="text-primary">
                        {formatCurrency(calculateTotals().packTotal)}
                      </span>
                    </h6>
                    <ul className="list-unstyled">
                      {Array.from(selectedPacks.entries()).map(
                        ([packId, qty]) => {
                          const product = packs.find((p) => p.id === packId);
                          const totalPrice = product ? product.price * qty : 0;
                          return (
                            <li key={packId} className="mb-2">
                              <div className="d-flex justify-content-between">
                                <span>
                                  <i className="bi bi-check2-circle text-success me-2"></i>
                                  {packId} (x{qty})
                                </span>
                                <span className="text-muted">
                                  {formatCurrency(totalPrice)}
                                </span>
                              </div>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </div>
                )}

                {/* Selected Extras Summary */}
                {selectedExtras.size > 0 && (
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 d-flex justify-content-between">
                      <span>Extras selecionados</span>
                      <span className="text-primary">
                        {formatCurrency(calculateTotals().extrasTotal)}
                      </span>
                    </h6>
                    <ul className="list-unstyled">
                      {Array.from(selectedExtras.entries()).map(
                        ([extraId, qty]) => {
                          const extra = extras.find((e) => e.extra === extraId);
                          const totals = calculateTotals();
                          const isOfferedItem = extraId === totals.offeredItemId;

                          return (
                            <li key={extraId} className="mb-2">
                              <div className="d-flex justify-content-between">
                                <span>
                                  <i className={`bi ${
                                    isOfferedItem ? "bi-gift text-success" : "bi-plus-circle text-primary"
                                  } me-2`}></i>
                                  {extraId} (x{qty})
                                  {isOfferedItem && (
                                    <span className="badge bg-success ms-2">
                                      1 unidade grátis
                                    </span>
                                  )}
                                </span>
                                <span className="text-muted">
                                  {isOfferedItem ? (
                                    <>
                                      <span className="text-decoration-line-through me-2">
                                        {formatCurrency((extra?.price || 0) * qty)}
                                      </span>
                                      <span>
                                        {formatCurrency((extra?.price || 0) * (qty - 1))}
                                      </span>
                                    </>
                                  ) : (
                                    formatCurrency((extra?.price || 0) * qty)
                                  )}
                                </span>
                              </div>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </div>
                )}

                {/* Total Summary */}
                <div className="mb-4 p-3 bg-light rounded">
                  <h5 className="d-flex justify-content-between align-items-center mb-0">
                    <span>Valor total da encomenda:</span>
                    <span className="text-primary fw-bold">
                      {formatCurrency(calculateTotals().total)}
                    </span>
                  </h5>
                </div>

                {/* Observations Summary */}
                {observation && (
                  <div>
                    <h6 className="border-bottom pb-2">Observações</h6>
                    <p className="text-muted">{observation}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowSummaryModal(false)}
                disabled={isSubmitting}
              >
                Editar encomenda
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    A processar encomenda...
                  </>
                ) : (
                  "Confirmar encomenda"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast de Oferta */}
      {showOfferToast && (
        <div
          className="position-fixed top-50 start-50 translate-middle"
          style={{ zIndex: 1070 }}
        >
          <div
            className="toast show shadow-lg"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{ 
              minWidth: "250px", 
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "2px solid #28a745"
            }}
          >
            <div className="toast-header bg-success text-white">
              <i className="bi bi-gift me-4 fs-5"></i>
              <strong className="me-auto fs-5">Oferta!</strong>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowOfferToast(false)}
              />
            </div>
            <div className="toast-body p-3 bg-white">
              <p className="mb-1 fs-5 text-dark"><strong></strong> Uma unidade do extra de menor valor é <strong className="text-success">gratuita</strong>!</p>
              <p className="text-dark mb-0">O desconto já foi aplicado ao seu pedido.</p>
            </div>
          </div>
        </div>
      )}

      {/* Order confirmation - Updated with handleSuccessOk */}
      {successMessage && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ 
            zIndex: 1080,
            backgroundColor: "rgba(0,0,0,0.7)" 
          }}
        >
          <div
            className="card shadow-lg border-0"
            style={{ 
              maxWidth: "500px",
              width: "90%",
              backgroundColor: "#fff" 
            }}
          >
            <div className="card-header bg-primary text-white py-3">
              <div className="d-flex align-items-center">
                <i className="bi bi-check-circle-fill fs-3 me-3"></i>
                <h5 className="mb-0 fw-bold fs-4">Sucesso!</h5>
              </div>
            </div>
            <div className="card-body p-4 text-center">
              <p className="fs-5 mb-4">{successMessage}</p>
              <button 
                className="btn btn-primary px-4 py-2" 
                onClick={handleSuccessOk}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderForm;