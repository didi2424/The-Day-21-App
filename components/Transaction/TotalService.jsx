import React, { useState, useEffect } from 'react';
import { MdReceipt, MdBuild } from 'react-icons/md';

const TotalService = ({ transaction, currentStep, setCurrentStep }) => {
  const [hardware, setHardware] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHardware = async () => {
      if (!transaction?._id) return;
      
      try {
        const response = await fetch(`http://localhost:3000/api/transaction/hardware/byService/${transaction._id}`);
        const data = await response.json();
        setHardware(data);
      } catch (error) {
        console.error('Error fetching hardware:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHardware();
  }, [transaction?._id]);

  if (loading) return <div>Loading hardware data...</div>;

  // Format currency
  const formatCurrency = (amount) => {
    return `Rp ${amount?.toLocaleString('id-ID')}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <MdReceipt className="text-[#b9ec8f]" />
        Service Invoice
      </h2>

      {/* Replaced Hardware Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
          <MdBuild className="text-[#b9ec8f]" />
          Replaced Hardware
        </h3>
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Item</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Manufacture</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">Warranty</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Price</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Qty</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Total</th>
              </tr>
            </thead>
            <tbody>
              {hardware?.replacedHardware?.map((item) => (
                <tr key={item._id} className="border-t border-gray-200">
                  <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.manufacture}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">{item.warranty} months</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.price)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Costs Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
          <MdBuild className="text-[#b9ec8f]" />
          Service Costs
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Diagnosis Fee</span>
              <span className="font-medium">{formatCurrency(hardware?.serviceCost?.diagnosis)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Workmanship</span>
              <span className="font-medium">{formatCurrency(hardware?.serviceCost?.workmanship)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Other Costs</span>
              <span className="font-medium">{formatCurrency(hardware?.serviceCost?.other)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Total Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Hardware Total</span>
            <span className="font-medium">{formatCurrency(hardware?.replacedHardware?.reduce((acc, item) => acc + (item.price * item.quantity), 0))}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Service Total</span>
            <span className="font-medium">{formatCurrency(
              (hardware?.serviceCost?.diagnosis || 0) + 
              (hardware?.serviceCost?.workmanship || 0) + 
              (hardware?.serviceCost?.other || 0)
            )}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-gray-900">Grand Total</span>
              <span className="text-[#b9ec8f]">{formatCurrency(hardware?.totalCost)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => setCurrentStep(2)}
          className="px-4 py-2 bg-[#b9ec8f] text-black rounded-md hover:bg-[#a5d880]"
        >
          Back
        </button>
        <button
          onClick={() => console.log('Finish service')}
          className="px-4 py-2 bg-[#b9ec8f] text-black rounded-md hover:bg-[#a5d880]"
        >
          Finish Service
        </button>
      </div>
    </div>
  );
};

export default TotalService;
