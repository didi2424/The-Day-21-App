import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdClose, MdAdd } from 'react-icons/md';

const TransactionUpdatePage2 = ({ selectedTransactionId, setActiveButton, setCurrentComponent }) => {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formStep, setFormStep] = useState(1);
  const [totalCost, setTotalCost] = useState(0);
  
  // State untuk hardware yang diganti
  const [replacedHardware, setReplacedHardware] = useState([
    { id: Date.now(), name: '', brand: '', price: '', warranty: '3' }
  ]);

  // State untuk biaya servis
  const [serviceCost, setServiceCost] = useState({
    diagnosis: '',
    workmanship: '',
    other: ''
  });

  // Opsi garansi
  const warrantyOptions = [
    { value: '0', label: 'No Warranty' },
    { value: '3', label: '3 Months' },
    { value: '6', label: '6 Months' },
    { value: '12', label: '12 Months' }
  ];

  // Tambah hardware baru
  const addHardware = () => {
    setReplacedHardware([
      ...replacedHardware,
      { id: Date.now(), name: '', brand: '', price: '', warranty: '3' }
    ]);
  };

  // Hapus hardware
  const removeHardware = (id) => {
    setReplacedHardware(replacedHardware.filter(hw => hw.id !== id));
  };

  // Update hardware
  const updateHardware = (id, field, value) => {
    setReplacedHardware(replacedHardware.map(hw => {
      if (hw.id === id) {
        return { ...hw, [field]: value };
      }
      return hw;
    }));
  };

  // Update service cost
  const handleServiceCostChange = (field, value) => {
    setServiceCost(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculate total cost
  useEffect(() => {
    const hardwareTotal = replacedHardware.reduce((sum, hw) => 
      sum + (parseFloat(hw.price) || 0), 0
    );
    
    const serviceTotal = Object.values(serviceCost).reduce((sum, cost) => 
      sum + (parseFloat(cost) || 0), 0
    );

    setTotalCost(hardwareTotal + serviceTotal);
  }, [replacedHardware, serviceCost]);

  const handleSubmit = async () => {
    try {
      const updateData = {
        replacedHardware,
        serviceCost,
        totalCost,
        status: 'in-progress', // Update status when hardware is added
        serviceId: selectedTransactionId
      };

      const response = await fetch(`/api/transaction/${selectedTransactionId}/hardware`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update hardware details');
      }

      toast.success('Hardware and service costs updated successfully');
      setActiveButton('transaction'); // Return to transaction list
    } catch (error) {
      toast.error('Failed to update service details');
      console.error('Update error:', error);
    }
  };

  const handleBack = () => {
    setCurrentComponent('basic');
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="space-y-6">
        {/* Replaced Hardware Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Replaced Hardware</h3>
            <button
              onClick={addHardware}
              className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <MdAdd /> Add Hardware
            </button>
          </div>

          <div className="space-y-4">
            {replacedHardware.map((hw) => (
              <div key={hw.id} className="grid grid-cols-5 gap-4 items-center bg-white p-3 rounded-md">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Hardware Name</label>
                  <input
                    type="text"
                    value={hw.name}
                    onChange={(e) => updateHardware(hw.id, 'name', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., SSD, RAM, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Brand</label>
                  <input
                    type="text"
                    value={hw.brand}
                    onChange={(e) => updateHardware(hw.id, 'brand', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Brand name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="number"
                    value={hw.price}
                    onChange={(e) => updateHardware(hw.id, 'price', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="0"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Warranty</label>
                    <select
                      value={hw.warranty}
                      onChange={(e) => updateHardware(hw.id, 'warranty', e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      {warrantyOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => removeHardware(hw.id)}
                    className="mb-1 p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <MdClose />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Costs Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Service Costs</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Diagnosis Fee</label>
              <input
                type="number"
                value={serviceCost.diagnosis}
                onChange={(e) => handleServiceCostChange('diagnosis', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Workmanship</label>
              <input
                type="number"
                value={serviceCost.workmanship}
                onChange={(e) => handleServiceCostChange('workmanship', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Other Costs</label>
              <input
                type="number"
                value={serviceCost.other}
                onChange={(e) => handleServiceCostChange('other', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Total Cost Display */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Total Cost</h3>
            <div className="text-2xl font-bold text-green-600">
              Rp {totalCost.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleBack}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#b9ec8f] text-black rounded-md hover:bg-[#a5d880]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionUpdatePage2;
