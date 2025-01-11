import React, { useState, useEffect } from 'react';

interface OrderFormProps {
  onSubmit: (data: any) => Promise<void>;
}

interface Extra {
  name: string;
  description: string;
}

const extras: Extra[] = [
  { name: 'Foto 15x20', description: '' },
  { name: 'Gift Wrap', description: 'Gift wrapping for your order.' },
  { name: 'Priority Shipping', description: 'Expedited shipping for faster delivery.' },
  { name: 'Customization', description: 'Custom design tailored to your needs.' },
  { name: 'Extended Support', description: 'Extended technical support for 6 months.' },
  { name: 'Installation', description: 'Professional installation service.' },
];

const packs = [
  { id: 'Pack 1', description: 'Basic pack for your needs.' },
  { id: 'Pack 2', description: 'Advanced pack with more features.' },
];

const OrderForm: React.FC<OrderFormProps> = ({ onSubmit }) => {
  const [selectedPacks, setSelectedPacks] = useState<Map<string, number>>(new Map());
  const [selectedExtras, setSelectedExtras] = useState<Map<string, number>>(new Map());
  const [totalCost, setTotalCost] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateTotalCost = () => {
    const packCost = Array.from(selectedPacks.values()).reduce((sum, qty) => sum + qty * 50, 0);
    const extraCost = Array.from(selectedExtras.values()).reduce((sum, qty) => sum + qty * 10, 0);
    setTotalCost(packCost + extraCost);
  };

  useEffect(() => {
    calculateTotalCost();
  }, [selectedPacks, selectedExtras]);

  const handlePackClick = (packId: string) => {
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (selectedPacks.size === 0 && selectedExtras.size < 3) {
      alert('Please select at least 3 extras when no pack is selected.');
      return;
    }

    try {
      setIsSubmitting(true);
      const orderData = {
        packs: Array.from(selectedPacks.entries()).map(([packId, qty]) => ({
          pack_id: packId,
          quantity: qty
        })),
        extras: Array.from(selectedExtras.entries()).map(([extra, qty]) => ({
          extra_name: extra,
          quantity: qty
        })),
        total_cost: totalCost
      };

      await onSubmit(orderData);
      
      // Reset form after successful submission
      setSelectedPacks(new Map());
      setSelectedExtras(new Map());
      setTotalCost(0);
      
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rest of your component JSX remains the same, just update the button to show loading state
  return (
    <div className="min-vh-100 bg-light d-flex align-items-center py-4">
      <div className="container">
        <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
          <h3 className="text-center mb-4">Order Form</h3>

          {/* Pack Options */}
          <div className="mb-4">
            <h5>Select Packs</h5>
            <div className="d-flex gap-3">
              {packs.map((pack) => (
                <div
                  key={pack.id}
                  onClick={() => handlePackClick(pack.id)}
                  className={`card text-center p-3 ${
                    selectedPacks.has(pack.id) ? 'border-primary' : 'border-light'
                  }`}
                  style={{
                    cursor: 'pointer',
                    flex: 1,
                    boxShadow: selectedPacks.has(pack.id) ? '0 0 10px rgba(0, 123, 255, 0.5)' : 'none',
                  }}
                >
                  <h6>{pack.id}</h6>
                  <p style={{ fontSize: '0.875rem' }}>{pack.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pack Quantities */}
          {Array.from(selectedPacks.entries()).map(([packId, qty]) => (
            <div className="mb-3" key={packId}>
              <h6>{packId} Quantity</h6>
              <select
                className="form-control"
                value={qty}
                onChange={(e) => handlePackQuantityChange(packId, Number(e.target.value))}
              >
                {[...Array(10)].map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Extras Options */}
          <div className="mb-4">
            <h5>Select Extras</h5>
            <div className="row">
              {extras.map((extra, index) => (
                <div
                  key={index}
                  className="col-6 col-md-4"
                  onClick={() => handleExtraClick(extra.name)}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className={`p-3 text-center border rounded ${
                      selectedExtras.has(extra.name) ? 'border-primary' : 'border-secondary'
                    }`}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '80px',
                        backgroundColor: selectedExtras.has(extra.name) ? '#007bff' : '#ddd',
                        borderRadius: '5px',
                        marginBottom: '10px',
                      }}
                    ></div>
                    <h6 style={{ fontSize: '0.875rem' }}>{extra.name}</h6>
                    <p style={{ fontSize: '0.75rem' }}>{extra.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Extra Quantities */}
          {Array.from(selectedExtras.entries()).map(([extra, qty]) => (
            <div className="d-flex justify-content-between align-items-center mb-2" key={extra}>
              <span>{extra}</span>
              <select
                className="form-control w-25"
                value={qty}
                onChange={(e) => handleExtraQuantityChange(extra, Number(e.target.value))}
              >
                {[...Array(10)].map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Total Cost */}
          <div className="mb-4">
            <h5>Total Cost: ${totalCost}</h5>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;