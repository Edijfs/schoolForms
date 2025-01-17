// OrderForm.tsx
import React, { useState, useMemo } from 'react';

interface OrderFormProps {
  onSubmit: (data: { 
    packs: string[]; 
    extras: string[]; 
    observation: string;
    totalCost: number;
  }) => Promise<void>;
}

interface Extra {
  extra: string;
  description: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  extras: Extra[];
}

const products: Product[] = [
  {
    id: 'Pack 1',
    name: 'Pack 1',
    description: 'Basic package with essential features',
    price: 99.99,
    extras: [
      { extra: 'Extra Warranty', description: 'Extended warranty for an additional year', price: 29.99 },
      { extra: 'Gift Wrap', description: 'Gift wrapping service', price: 9.99 },
      { extra: 'Priority Shipping', description: 'Expedited shipping', price: 19.99 },
    ]
  },
  {
    id: 'Pack 2',
    name: 'Pack 2',
    description: 'Premium package with advanced features',
    price: 149.99,
    extras: [
      { extra: 'Customization', description: 'Custom design options', price: 49.99 },
      { extra: 'Extended Support', description: '6 months extended support', price: 39.99 },
      { extra: 'Installation', description: 'Professional installation', price: 79.99 },
    ]
  },
  {
    id: 'Only extras',
    name: 'Only Extras',
    description: 'Create your own package with extras',
    price: 0,
    extras: [
      { extra: 'Extra Warranty', description: 'Extended warranty for an additional year', price: 29.99 },
      { extra: 'Extended Support', description: '6 months extended support', price: 39.99 },
      { extra: 'Installation', description: 'Professional installation', price: 79.99 },
    ]
  }
];

const OrderForm: React.FC<OrderFormProps> = ({ onSubmit }) => {
  const [selectedPacks, setSelectedPacks] = useState<Map<string, number>>(new Map());
  const [selectedExtras, setSelectedExtras] = useState<Map<string, number>>(new Map());
  const [inputValues, setInputValues] = useState<Map<string, string>>(new Map());
  const [observation, setObservation] = useState('');
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const uniqueExtras = useMemo(() => {
    const extrasMap = new Map<string, Extra>();
    products.forEach(product => {
      product.extras.forEach(extra => {
        if (!extrasMap.has(extra.extra)) {
          extrasMap.set(extra.extra, extra);
        }
      });
    });
    return Array.from(extrasMap.values());
  }, []);

  const calculateTotals = () => {
    let packTotal = 0;
    let extrasTotal = 0;

    selectedPacks.forEach((qty, packId) => {
      const product = products.find(p => p.id === packId);
      if (product) {
        packTotal += product.price * qty;
      }
    });

    selectedExtras.forEach((qty, extraId) => {
      const extra = uniqueExtras.find(e => e.extra === extraId);
      if (extra) {
        extrasTotal += extra.price * qty;
      }
    });

    return {
      packTotal,
      extrasTotal,
      total: packTotal + extrasTotal
    };
  };

  const handlePackClick = (packId: string) => {
    setSelectedPacks(prev => {
      const newPacks = new Map(prev);
      
      if (packId === 'Only extras') {
        setShowWarningModal(true);
        newPacks.clear();
        newPacks.set(packId, 1);
      } else {
        newPacks.delete('Only extras');
        if (newPacks.has(packId)) {
          newPacks.delete(packId);
        } else {
          newPacks.set(packId, 1);
        }
      }
      
      return newPacks;
    });
    
    setError(null);
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
    
    setError(null);
  };

  const handleQuantityChange = (
    type: 'pack' | 'extra',
    id: string,
    value: string
  ) => {
    // Update the input value state
    setInputValues(prev => {
      const newValues = new Map(prev);
      newValues.set(`${type}-${id}`, value);
      return newValues;
    });

    // Update the actual quantity state
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
    
    setError(null);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const validateOrder = (): boolean => {
    if (selectedPacks.size === 0 && selectedExtras.size === 0) {
      setError('Please select at least one pack or extra');
      return false;
    }

    if (selectedPacks.has('Only extras') && selectedExtras.size < 3) {
      setError('Please select at least 3 extras when choosing "Only Extras"');
      return false;
    }

    return true;
  };

  const handleReviewClick = () => {
    if (validateOrder()) {
      setShowSummaryModal(true);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!validateOrder()) return;

    const totals = calculateTotals();
    const orderData = {
      packs: Array.from(selectedPacks.entries()).map(([packId, qty]) => {
        const product = products.find(p => p.id === packId);
        const price = product?.price ?? 0;
        return `${packId} (x${qty}) - ${formatCurrency(price * qty)}`;
      }),
      extras: Array.from(selectedExtras.entries()).map(([extraId, qty]) => {
        const extra = uniqueExtras.find(e => e.extra === extraId);
        const price = extra?.price ?? 0;
        return `${extraId} (x${qty}) - ${formatCurrency(price * qty)}`;
      }),
      observation,
      totalCost: totals.total
    };

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(orderData);
      setSuccessMessage('Order submitted successfully!');
      setShowSummaryModal(false);
      
      // Reset form after successful submission
      setTimeout(() => {
        setSelectedPacks(new Map());
        setSelectedExtras(new Map());
        setInputValues(new Map());
        setObservation('');
        setSuccessMessage(null);
      }, 2000);
    } catch (err) {
      console.error('Order submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit order. Please check your order details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center py-4">
      <div className="container">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h3 className="card-title text-center mb-4">Order Details</h3>

            {error && (
              <div className="alert alert-danger mb-4" role="alert">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="alert alert-success mb-4" role="alert">
                {successMessage}
              </div>
            )}

            {/* Pack Selection */}
            <div className="mb-4">
              <h5 className="mb-3">Select Packs</h5>
              <div className="row g-3">
                {products.map(product => (
                  <div className="col-md-4" key={product.id}>
                    <div
                      onClick={() => !isSubmitting && handlePackClick(product.id)}
                      className={`card h-100 ${
                        selectedPacks.has(product.id) ? 'border-primary' : ''
                      } ${isSubmitting ? 'opacity-50' : ''}`}
                      style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                      role="button"
                      aria-pressed={selectedPacks.has(product.id)}
                      aria-disabled={isSubmitting}
                      tabIndex={isSubmitting ? -1 : 0}
                    >
                      <div className="card-body text-center">
                        <h6 className="card-title">{product.name}</h6>
                        <p className="card-text small text-muted mb-2">
                          {product.description}
                        </p>
                        {product.price > 0 && (
                          <div className="mt-auto">
                            <span className="badge bg-primary fs-6">
                              {formatCurrency(product.price)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pack Quantities */}
            {Array.from(selectedPacks.entries()).map(([packId, qty]) =>
              packId !== 'Only extras' ? (
                <div className="mb-3" key={packId}>
                  <div className="d-flex justify-content-between align-items-center">
                    <label htmlFor={`qty-${packId}`} className="form-label mb-0">
                      {packId} Quantity
                    </label>
                    <span className="text-primary">
                      {formatCurrency((products.find(p => p.id === packId)?.price ?? 0) * qty)}
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
              ) : null
            )}

            {/* Extras Selection */}
            <div className="mb-4">
              <h5 className="mb-3">Select Extras</h5>
              <div className="row g-3">
                {uniqueExtras.map((extra, index) => (
                  <div className="col-md-4" key={index}>
                    <div
                      onClick={() => !isSubmitting && handleExtraToggle(extra.extra)}
                      className={`card h-100 ${
                        selectedExtras.has(extra.extra) ? 'border-primary' : ''
                      } ${isSubmitting ? 'opacity-50' : ''}`}
                      style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                      role="button"
                      aria-pressed={selectedExtras.has(extra.extra)}
                      aria-disabled={isSubmitting}
                      tabIndex={isSubmitting ? -1 : 0}
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
              const extra = uniqueExtras.find(e => e.extra === extraId);
              const totalPrice = extra ? extra.price * qty : 0;
              
              return (
                <div className="mb-3" key={extraId}>
                  <div className="d-flex justify-content-between align-items-center">
                    <label htmlFor={`extra-qty-${extraId}`} className="form-label mb-0">
                      {extraId} Quantity
                    </label>
                    <span className="text-primary">
                      {formatCurrency(totalPrice)}
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
                <h5 className="mb-3">Current Total</h5>
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
                Observations
              </label>
              <textarea
                className="form-control"
                id="observation"
                rows={3}
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Add any additional notes or requirements"
                disabled={isSubmitting}
              />
            </div>

            <button 
              type="button"
              className="btn btn-primary w-100"
              disabled={isSubmitting || (selectedPacks.size === 0 && selectedExtras.size === 0)}
              onClick={handleReviewClick}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                'Review Order'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Warning Modal */}
      <div 
        className={`modal fade ${showWarningModal ? 'show' : ''}`} 
        style={{ display: showWarningModal ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)' }}
        tabIndex={-1}
        role="dialog"
        aria-modal={showWarningModal}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Important Information</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowWarningModal(false)}
                aria-label="Close"
                disabled={isSubmitting}
              />
            </div>
            <div className="modal-body">
              <p>When selecting "Only Extras", you must choose at least 3 extras to proceed.</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowWarningModal(false)}
                disabled={isSubmitting}
              >
                I Understand
              </button>
            </div>
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
              <h5 className="modal-title">Review Your Order</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => !isSubmitting && setShowSummaryModal(false)}
                aria-label="Close"
                disabled={isSubmitting}
              />
            </div>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger mb-4" role="alert">
                  {error}
                </div>
              )}

              <div className="container-fluid">
                {/* Selected Packs */}
                {selectedPacks.size > 0 && (
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 d-flex justify-content-between">
                      <span>Selected Packs</span>
                      <span className="text-primary">
                        {formatCurrency(calculateTotals().packTotal)}
                      </span>
                    </h6>
                    <ul className="list-unstyled">
                      {Array.from(selectedPacks.entries()).map(([packId, qty]) => {
                        const product = products.find(p => p.id === packId);
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

                {/* Selected Extras */}
                {selectedExtras.size > 0 && (
                  <div className="mb-4">
                    <h6 className="border-bottom pb-2 d-flex justify-content-between">
                      <span>Selected Extras</span>
                      <span className="text-primary">
                        {formatCurrency(calculateTotals().extrasTotal)}
                      </span>
                    </h6>
                    <ul className="list-unstyled">
                      {Array.from(selectedExtras.entries()).map(([extraId, qty]) => {
                        const extra = uniqueExtras.find(e => e.extra === extraId);
                        const totalPrice = extra ? extra.price * qty : 0;
                        return (
                          <li key={extraId} className="mb-2">
                            <div className="d-flex justify-content-between">
                              <span>
                                <i className="bi bi-plus-circle text-primary me-2"></i>
                                {extraId} (x{qty})
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

                {/* Total */}
                <div className="mb-4 p-3 bg-light rounded">
                  <h5 className="d-flex justify-content-between align-items-center mb-0">
                    <span>Total Order Value:</span>
                    <span className="text-primary fw-bold">
                      {formatCurrency(calculateTotals().total)}
                    </span>
                  </h5>
                </div>

                {/* Observations */}
                {observation && (
                  <div>
                    <h6 className="border-bottom pb-2">Observations</h6>
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
                Edit Order
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
                    Processing...
                  </>
                ) : (
                  'Confirm & Submit Order'
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
              <strong className="me-auto">Success</strong>
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