// OrderForm.tsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Product {
  id: string;
  name: string;
  description: string;
  extraImages: { extra: string; description: string }[];
  extras: string[];
}

const products: Product[] = [
  {
    id: 'Pack 1',
    name: 'Pack 1',
    description: 'Pack descriptions',
    extraImages: [
      { extra: 'Extra Warranty', description: 'Extended warranty for an additional year.' },
      { extra: 'Gift Wrap', description: 'Gift wrapping for your order.' },
      { extra: 'Priority Shipping', description: 'Expedited shipping for faster delivery.' },
    ],
    extras: ['Extra Warranty', 'Gift Wrap', 'Priority Shipping'],
  },
  {
    id: 'Pack 2',
    name: 'Pack 2',
    description: 'Pack descriptions',
    extraImages: [
      { extra: 'Customization', description: 'Custom design tailored to your needs.' },
      { extra: 'Extended Support', description: 'Extended technical support for 6 months.' },
      { extra: 'Installation', description: 'Professional installation service.' },
    ],
    extras: ['Customization', 'Extended Support', 'Installation'],
  },
  {
    id: 'Only extras',
    name: 'Only Extras',
    description: 'Select extras without choosing a pack.',
    extraImages: [
      { extra: 'Customization', description: 'Custom design tailored to your needs.' },
      { extra: 'Extended Support', description: 'Extended technical support for 6 months.' },
      { extra: 'Installation', description: 'Professional installation service.' },
    ],
    extras: ['Customization', 'Extended Support', 'Installation'],
  },
];

const OrderForm: React.FC = () => {
  const [selectedPacks, setSelectedPacks] = useState<Map<string, number>>(new Map());
  const [selectedExtras, setSelectedExtras] = useState<Map<string, number>>(new Map());
  const [showModal, setShowModal] = useState<boolean>(false);

  const handlePackClick = (packId: string) => {
    setSelectedPacks((prev) => {
      const newPacks = new Map(prev);

      if (packId === 'Only extras') {
        setShowModal(true);
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
  };

  const handlePackQuantityChange = (packId: string, quantity: number) => {
    setSelectedPacks((prev) => {
      const newPacks = new Map(prev);
      if (newPacks.has(packId)) {
        newPacks.set(packId, Math.max(1, quantity));
      }
      return newPacks;
    });
  };

  const handleExtraClick = (extra: string) => {
    setSelectedExtras((prev) => {
      const newExtras = new Map(prev);
      if (newExtras.has(extra)) {
        newExtras.delete(extra);
      } else {
        newExtras.set(extra, 1);
      }
      return newExtras;
    });
  };

  const handleExtraQuantityChange = (extra: string, quantity: number) => {
    setSelectedExtras((prev) => {
      const newExtras = new Map(prev);
      if (newExtras.has(extra)) {
        newExtras.set(extra, Math.max(1, quantity));
      }
      return newExtras;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedPacks.has('Only extras') && selectedExtras.size < 3) {
      alert('Please select at least 3 extras when choosing "Only Extras".');
      return;
    }

    const selectedPacksWithQuantities = Array.from(selectedPacks.entries()).map(
      ([packId, qty]) => `${packId} (x${qty})`
    );
    const selectedExtrasWithQuantities = Array.from(selectedExtras.entries()).map(
      ([extra, qty]) => `${extra} (x${qty})`
    );

    alert(`Selected Packs: ${selectedPacksWithQuantities.join(', ')}\nSelected Extras: ${selectedExtrasWithQuantities.join(', ')}`);
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center py-4">
      <div className="container">
        <form onSubmit={handleSubmit} className="card shadow-sm">
          <div className="card-body p-4">
            <h3 className="card-title text-center mb-4">Order Form</h3>

            {/* Pack Options */}
            <div className="mb-4">
              <h5 className="mb-3">Select Packs</h5>
              <div className="row g-3">
                {products.map((p) => (
                  <div className="col-md-4" key={p.id}>
                    <div
                      onClick={() => handlePackClick(p.id)}
                      className={`card h-100 ${
                        selectedPacks.has(p.id) ? 'border-primary' : ''
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="card-body text-center">
                        <h6 className="card-title">{p.name}</h6>
                        <p className="card-text small text-muted">{p.description}</p>
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
                  <label className="form-label">{packId} Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={qty}
                    min="1"
                    onChange={(e) => handlePackQuantityChange(packId, parseInt(e.target.value))}
                  />
                </div>
              ) : null
            )}

            {/* Extras Options */}
            <div className="mb-4">
              <h5 className="mb-3">Select Extras</h5>
              <div className="row g-3">
                {products.flatMap((p) =>
                  p.extraImages.map((img, index) => (
                    <div className="col-md-4" key={`${p.id}-${index}`}>
                      <div
                        onClick={() => handleExtraClick(img.extra)}
                        className={`card h-100 ${
                          selectedExtras.has(img.extra) ? 'border-primary' : ''
                        }`}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body text-center">
                          <div
                            className={`mb-3 rounded ${
                              selectedExtras.has(img.extra) ? 'bg-primary' : 'bg-secondary'
                            }`}
                            style={{ height: '80px' }}
                          ></div>
                          <h6 className="card-title">{img.extra}</h6>
                          <p className="card-text small text-muted">{img.description}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Extra Quantities */}
              {Array.from(selectedExtras.entries()).map(([extra, qty]) => (
                <div className="mt-3" key={extra}>
                  <div className="d-flex align-items-center justify-content-between">
                    <label className="form-label mb-0">{extra}</label>
                    <input
                      type="number"
                      className="form-control ms-3"
                      style={{ width: '100px' }}
                      value={qty}
                      min="1"
                      onChange={(e) => handleExtraQuantityChange(extra, parseInt(e.target.value))}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Submit Order
            </button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Important Information</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  At least 3 extras are required for submission when "Only Extras" is selected.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
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
};

export default OrderForm;