// components/OrderForm.tsx
import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { OrderFormProps } from '../types/models';
//import { OrderFormData } from '../types/models';

const OrderForm: React.FC<OrderFormProps> = ({ onSubmit }) => {
  // Use the products hook instead of direct imports
  const { products: packs, extras, loading, error } = useProducts();
  
  const [selectedPacks, setSelectedPacks] = useState<Map<string, number>>(new Map());
  const [selectedExtras, setSelectedExtras] = useState<Map<string, number>>(new Map());
  const [inputValues, setInputValues] = useState<Map<string, string>>(new Map());
  const [observation, setObservation] = useState('');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const getOfferedItemId = (): string | null => {
    if (selectedExtras.size !== 3) return null;
    
    const selectedExtrasWithPrices = Array.from(selectedExtras.entries())
      .map(([extraId, qty]) => {
        const extra = extras.find(e => e.extra === extraId);
        return {
          id: extraId,
          price: extra?.price || 0,
          totalCost: (extra?.price || 0) * qty
        };
      })
      .sort((a, b) => a.totalCost - b.totalCost);
  
    return selectedExtrasWithPrices[0].id;
  };

  const calculateTotals = () => {
    let packTotal = 0;
    let extrasTotal = 0;

    selectedPacks.forEach((qty, packId) => {
      const product = packs.find(p => p.id === packId);
      if (product) {
        packTotal += product.price * qty;
      }
    });

    if (selectedExtras.size === 3) {
      const offeredItemId = getOfferedItemId();
      selectedExtras.forEach((qty, extraId) => {
        const extra = extras.find(e => e.extra === extraId);
        if (extra && extraId !== offeredItemId) {
          extrasTotal += extra.price * qty;
        }
      });
    } else {
      selectedExtras.forEach((qty, extraId) => {
        const extra = extras.find(e => e.extra === extraId);
        if (extra) {
          extrasTotal += extra.price * qty;
        }
      });
    }

    return {
      packTotal,
      extrasTotal,
      total: packTotal + extrasTotal,
      offeredItemId: getOfferedItemId()
    };
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handlePackClick = (packId: string) => {
    setSelectedPacks(prev => {
      const newPacks = new Map(prev);
      if (newPacks.has(packId)) {
        newPacks.delete(packId);
      } else {
        newPacks.set(packId, 1);
      }
      return newPacks;
    });
  };

  const handleExtraToggle = (extraId: string) => {
    setSelectedExtras(prev => {
      const newExtras = new Map(prev);
      if (newExtras.has(extraId)) {
        newExtras.delete(extraId);
      } else {
        newExtras.set(extraId, 1);
      }
      return newExtras;
    });
  };

  const handleQuantityChange = (
    type: 'pack' | 'extra',
    id: string,
    value: string
  ) => {
    setInputValues(prev => {
      const newValues = new Map(prev);
      newValues.set(`${type}-${id}`, value);
      return newValues;
    });

    const quantity = value === '' ? 1 : parseInt(value);
    const validQuantity = Math.max(1, Math.min(99, quantity || 1));
    
    if (type === 'pack') {
      setSelectedPacks(prev => {
        const newPacks = new Map(prev);
        newPacks.set(id, validQuantity);
        return newPacks;
      });
    } else {
      setSelectedExtras(prev => {
        const newExtras = new Map(prev);
        newExtras.set(id, validQuantity);
        return newExtras;
      });
    }
  };

const handleSubmit = async () => {
  const totals = calculateTotals();
  const orderData = {
    packs: Array.from(selectedPacks.entries()).map(([packId, qty]) => {
      const product = packs.find(p => p.id === packId);
      // Use product name instead of ID
      return `${product?.name || packId} (x${qty}) - ${formatCurrency((product?.price ?? 0) * qty)}`;
    }),
    extras: Array.from(selectedExtras.entries()).map(([extraId, qty]) => {
      const extra = extras.find(e => e.extra === extraId);
      const isOffered = extraId === totals.offeredItemId;
      return `${extraId} (x${qty}) ${isOffered ? '[OFERTA]' : ''} - ${formatCurrency(isOffered ? 0 : (extra?.price ?? 0) * qty)}`;
    }),
    obs: observation,
    total_enc: totals.total
  };

  console.log('Order Form Data:', orderData); // Debug log

  setIsSubmitting(true);

  try {
    await onSubmit(orderData);
    setShowSummaryModal(false);
    setSuccessMessage('Encomenda submetida com sucesso!');
    setSelectedPacks(new Map());
    setSelectedExtras(new Map());
    setInputValues(new Map());
    setObservation('');
  } catch (error: unknown) {
    console.error('Submit Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    alert(`Erro ao submeter a encomenda: ${errorMessage}`);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center py-4">
      <div className="container">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h3 className="card-title text-center mb-4">Produtos fotográficos</h3>

            {successMessage && (
              <div className="alert alert-success mb-4" role="alert">
                {successMessage}
              </div>
            )}

            {selectedExtras.size === 3 && (
              <div className="alert alert-success mb-4">
                <i className="bi bi-gift me-2"></i>
                Parabéns! O extra mais barato é gratuito por ter selecionado 3 extras.
              </div>
            )}

            {/* Pack Selection */}
            <div className="mb-4">
              <h5 className="mb-3">PACK'S</h5>
              <div className="row g-3">
                {packs.map(product => (
                  <div className="col-md-4" key={product.id}>
                    <div
                      onClick={() => !isSubmitting && handlePackClick(product.id)}
                      className={`card h-100 ${
                        selectedPacks.has(product.id) ? 'border-primary' : ''
                      } ${isSubmitting ? 'opacity-50' : ''}`}
                      style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                      role="button"
                    >
                      <div className="card-body text-center">
                        <h6 className="card-title">{product.name}</h6>
                        <p className="card-text small text-muted mb-2">
                          {product.description}
                        </p>
                        <div className="mt-auto">
                          <span className="badge bg-primary fs-6">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pack Quantities */}
            {Array.from(selectedPacks.entries()).map(([packId, qty]) => (
              <div className="mb-3" key={packId}>
                <div className="d-flex justify-content-between align-items-center">
                  <label htmlFor={`qty-${packId}`} className="form-label mb-0">
                    Quantidade: {packId}
                  </label>
                  <span className="text-primary">
                    {formatCurrency((packs.find(p => p.id === packId)?.price ?? 0) * qty)}
                  </span>
                </div>
                <input
                  type="number"
                  className="form-control mt-1"
                  id={`qty-${packId}`}
                  value={inputValues.get(`pack-${packId}`) ?? qty.toString()}
                  min="1"
                  max="99"
                  disabled={isSubmitting}
                  onChange={(e) => handleQuantityChange('pack', packId, e.target.value)}
                />
              </div>
            ))}

            {/* Extras Selection */}
            <div className="mb-4">
              <h5 className="mb-3">EXTRAS</h5>
              <div className="row g-3">
                {extras.map(extra => (
                  <div className="col-md-4" key={extra.extra}>
                    <div
                      onClick={() => !isSubmitting && handleExtraToggle(extra.extra)}
                      className={`card h-100 ${
                        selectedExtras.has(extra.extra) ? 'border-primary' : ''
                      } ${isSubmitting ? 'opacity-50' : ''}`}
                      style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                      role="button"
                    >
                      <div className="card-body text-center">
                        <h6 className="card-title">{extra.extra}</h6>
                        <p className="card-text small text-muted mb-2">
                          {extra.description}
                        </p>
                        <div className="mt-auto">
                          <span className="badge bg-primary fs-6">
                            {formatCurrency(extra.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extra Quantities */}
            {Array.from(selectedExtras.entries()).map(([extraId, qty]) => {
              const extra = extras.find(e => e.extra === extraId);
              const totalPrice = extra ? extra.price * qty : 0;
              const totals = calculateTotals();
              const isOfferedItem = extraId === totals.offeredItemId;
              
              return (
                <div className="mb-3" key={extraId}>
                  <div className="d-flex justify-content-between align-items-center">
                    <label htmlFor={`extra-qty-${extraId}`} className="form-label mb-0">
                      Quantidade: {extraId}
                    </label>
                    <span className={isOfferedItem ? 'text-success' : 'text-primary'}>
                      {formatCurrency(totalPrice)}
                      {isOfferedItem && ' (Oferta)'}
                    </span>
                  </div>
                  <input
                    type="number"
                    className="form-control mt-1"
                    id={`extra-qty-${extraId}`}
                    value={inputValues.get(`extra-${extraId}`) ?? qty.toString()}
                    min="1"
                    max="99"
                    disabled={isSubmitting}
                    onChange={(e) => handleQuantityChange('extra', extraId, e.target.value)}
                  />
                </div>
              );
            })}

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
            <div className="mb-4">
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
              disabled={isSubmitting || (selectedPacks.size === 0 && selectedExtras.size === 0)}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  A processar encomenda...
                </>
              ) : (
                'Visualizar encomenda'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Order Review Modal */}
      <div 
        className={`modal fade ${showSummaryModal ? 'show' : ''}`}
        style={{ display: showSummaryModal ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)' }}
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
                      {Array.from(selectedPacks.entries()).map(([packId, qty]) => {
                        const product = packs.find(p => p.id === packId);
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
                      })}
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
                      {Array.from(selectedExtras.entries()).map(([extraId, qty]) => {
                        const extra = extras.find(e => e.extra === extraId);
                        const totalPrice = extra ? extra.price * qty : 0;
                        const totals = calculateTotals();
                        const isOfferedItem = extraId === totals.offeredItemId;

                        return (
                          <li key={extraId} className="mb-2">
                            <div className="d-flex justify-content-between">
                              <span>
                                <i className={`bi ${isOfferedItem ? 'bi-gift text-success' : 'bi-plus-circle text-primary'} me-2`}></i>
                                {extraId} (x{qty})
                                {isOfferedItem && <span className="badge bg-success ms-2">Oferta</span>}
                              </span>
                              <span className={isOfferedItem ? 'text-success text-decoration-line-through' : 'text-muted'}>
                                {formatCurrency(totalPrice)}
                              </span>
                            </div>
                          </li>
                        );
                      })}
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
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    A processar encomenda...
                  </>
                ) : (
                  'Confirmar encomenda'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {successMessage && (
        <div 
          className="position-fixed top-0 end-0 p-3" 
          style={{ zIndex: 1070 }}
        >
          <div 
            className="toast show" 
            role="alert" 
            aria-live="assertive" 
            aria-atomic="true"
          >
            <div className="toast-header bg-success text-white">
              <strong className="me-auto">Sucesso!</strong>
              <button 
                type="button" 
                className="btn-close btn-close-white"
                onClick={() => setSuccessMessage(null)}
              />
            </div>
            <div className="toast-body">
              {successMessage}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderForm;