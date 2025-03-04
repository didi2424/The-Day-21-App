import React, { useState, useEffect } from 'react';
import { MdReceipt, MdBuild, MdPrint } from 'react-icons/md';
import TransactionPrintInvoice from './TransactionPrintInvoice';

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

  // Add warranty formatter
  const formatWarranty = (warrantyValue) => {
    if (warrantyValue === 0) return "Tanpa Garansi";
    if (warrantyValue === 0.25) return "1 Minggu";
    if (warrantyValue === 1) return "1 Bulan";
    if (warrantyValue === 3) return "3 Bulan";
    if (warrantyValue === 6) return "6 Bulan";
    if (warrantyValue === 12) return "12 Bulan";
    return `${warrantyValue} Bulan`;
  };

  // Add calculate item total with discount
  const calculateItemTotal = (item) => {
    const subtotal = item.price * item.quantity;
    const discountAmount = subtotal * (item.discount || 0) / 100;
    return subtotal - discountAmount;
  };

  const handlePrint = () => {
    const printTab = window.open('about:blank', '_blank');
    if (!printTab) return;

    const printContent = document.getElementById('print-invoice')?.innerHTML;
    if (!printContent) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Service Invoice - ${transaction?.serviceNumber || ''}</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            body { 
              margin: 0; 
              padding: 16px; 
            }
            @media print {
              @page { 
                size: auto; 
                margin: 0mm; 
              }
              #print-button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div style="max-width: 1000px; margin: 0 auto;">
            <button 
              id="print-button"
              onclick="window.print()"
              style="margin-bottom: 20px; padding: 8px 16px; background: #b9ec8f; border: none; border-radius: 4px; cursor: pointer;"
            >
              Print Invoice
            </button>
            ${printContent}
          </div>
          <script>
            window.onafterprint = () => window.close();
          </script>
        </body>
      </html>
    `;

    printTab.document.open();
    printTab.document.write(html);
    printTab.document.close();
  };

  return (
    <>
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
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Disc%</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Total</th>
                </tr>
              </thead>
              <tbody>
                {hardware?.replacedHardware?.map((item) => (
                  <tr key={item._id} className="border-t border-gray-200">
                    <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.manufacture}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-center">{formatWarranty(item.warranty)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.price)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.discount || 0}%</td>
                    <td className="px-4 py-3 text-sm text-right">
                      {item.discount > 0 && (
                        <span className="text-xs text-gray-500 line-through block">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      )}
                      <span className="text-gray-900">
                        {formatCurrency(calculateItemTotal(item))}
                      </span>
                    </td>
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
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">
                {formatCurrency(hardware?.replacedHardware?.reduce((acc, item) => acc + (item.price * item.quantity), 0))}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Discount</span>
              <span className="font-medium text-red-600">
                {formatCurrency(hardware?.replacedHardware?.reduce((acc, item) => {
                  const subtotal = item.price * item.quantity;
                  const discount = subtotal * (item.discount || 0) / 100;
                  return acc + discount;
                }, 0))}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Hardware Total (After Discount)</span>
              <span className="font-medium">
                {formatCurrency(hardware?.replacedHardware?.reduce((acc, item) => acc + calculateItemTotal(item), 0))}
              </span>
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
            onClick={handlePrint}
            className="px-4 py-2 bg-[#b9ec8f] text-black rounded-md hover:bg-[#a5d880] flex items-center gap-2"
          >
            <MdPrint />
            Print Invoice
          </button>
        </div>
      </div>

      {/* Hidden Print Template */}
      <div id="print-invoice" className="hidden">
        <TransactionPrintInvoice 
          hardware={hardware}
          transaction={transaction}
          formatCurrency={formatCurrency}
          formatWarranty={formatWarranty}
          calculateItemTotal={calculateItemTotal}
        />
      </div>
    </>
  );
};

export default TotalService;
