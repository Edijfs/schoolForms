import React, { useState } from 'react';

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
        // Show modal when "Only Extras" is selected
        setShowModal(true);
        newPacks.clear();
        newPacks.set(packId, 1);
      } else {
        // Remove "Only Extras" if another pack is selected
        newPacks.delete('Only extras');
        if (newPacks.has(packId)) {
          newPacks.delete(packId); // Toggle pack selection
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
        newPacks.set(packId, quantity);
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
        newExtras.set(extra, quantity);
      }
      return newExtras;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate "Only Extras" selection
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
        <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
          <h3 className="text-center mb-4">Order Form</h3>

          {/* Pack Options */}
          <div className="mb-4">
            <h5>Select Packs</h5>
            <div className="d-flex gap-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handlePackClick(p.id)}
                  className={`card text-center p-3 ${
                    selectedPacks.has(p.id) ? 'border-primary' : 'border-light'
                  }`}
                  style={{
                    cursor: 'pointer',
                    flex: 1,
                    boxShadow: selectedPacks.has(p.id) ? '0 0 10px rgba(0, 123, 255, 0.5)' : 'none',
                  }}
                >
                  <h6>{p.name}</h6>
                  <p style={{ fontSize: '0.875rem' }}>{p.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pack Quantities */}
          {Array.from(selectedPacks.entries()).map(([packId, qty]) =>
            packId !== 'Only extras' ? (
              <div className="mb-3" key={packId}>
                <h6>{packId} Quantity</h6>
                <input
                  type="number"
                  className="form-control"
                  value={qty}
                  min="1"
                  onChange={(e) => handlePackQuantityChange(packId, Math.max(1, Number(e.target.value)))}
                />
              </div>
            ) : null
          )}

          {/* Extras Options */}
          <div className="mb-4">
            <h5>Select Extras</h5>
            <div className="row">
              {products.flatMap((p) =>
                p.extraImages.map((img, index) => (
                  <div
                    key={`${p.id}-${index}`}
                    className="col-6 col-md-4"
                    onClick={() => handleExtraClick(img.extra)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div
                      className={`p-3 text-center border rounded ${
                        selectedExtras.has(img.extra) ? 'border-primary' : 'border-secondary'
                      }`}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '80px',
                          backgroundColor: selectedExtras.has(img.extra) ? '#007bff' : '#ddd',
                          borderRadius: '5px',
                          marginBottom: '10px',
                        }}
                      ></div>
                      <h6 style={{ fontSize: '0.875rem' }}>{img.extra}</h6>
                      <p style={{ fontSize: '0.75rem' }}>{img.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Extra Quantities */}
            {Array.from(selectedExtras.entries()).map(([extra, qty]) => (
              <div className="d-flex justify-content-between align-items-center mb-2" key={extra}>
                <span>{extra}</span>
                <input
                  type="number"
                  className="form-control w-25"
                  value={qty}
                  min="1"
                  onChange={(e) => handleExtraQuantityChange(extra, Math.max(1, Number(e.target.value)))}
                />
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </form>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Important Information</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>At least 3 extras are required for submission when "Only Extras" is selected.</p>
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
