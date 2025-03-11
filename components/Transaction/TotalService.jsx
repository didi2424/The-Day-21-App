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
      <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 p-6 rounded-xl">
        {/* Replaced Hardware Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2 text-blue-400">
            <MdBuild className="text-blue-400" />
            Replaced Hardware
          </h3>
          <div className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-700/50">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Item</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Manufacture</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-300">Warranty</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-300">Price</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-300">Qty</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-300">Disc%</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-300">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {hardware?.replacedHardware?.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-200">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{item.manufacture}</td>
                    <td className="px-4 py-3 text-sm text-gray-400 text-center">{formatWarranty(item.warranty)}</td>
                    <td className="px-4 py-3 text-sm text-gray-200 text-right">{formatCurrency(item.price)}</td>
                    <td className="px-4 py-3 text-sm text-gray-200 text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-200 text-right">{item.discount || 0}%</td>
                    <td className="px-4 py-3 text-sm text-right">
                      {item.discount > 0 && (
                        <span className="text-xs text-gray-500 line-through block">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      )}
                      <span className="text-purple-400">
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
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2 text-blue-400">
            <MdBuild className="text-blue-400" />
            Service Costs
          </h3>
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Diagnosis Fee</span>
                <span className="font-medium text-gray-200">{formatCurrency(hardware?.serviceCost?.diagnosis)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Workmanship</span>
                <span className="font-medium text-gray-200">{formatCurrency(hardware?.serviceCost?.workmanship)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Other Costs</span>
                <span className="font-medium text-gray-200">{formatCurrency(hardware?.serviceCost?.other)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Section */}
        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="font-medium text-gray-200">
                {formatCurrency(hardware?.replacedHardware?.reduce((acc, item) => acc + (item.price * item.quantity), 0))}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Discount</span>
              <span className="font-medium text-red-400">
                {formatCurrency(hardware?.replacedHardware?.reduce((acc, item) => {
                  const subtotal = item.price * item.quantity;
                  const discount = subtotal * (item.discount || 0) / 100;
                  return acc + discount;
                }, 0))}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Hardware Total (After Discount)</span>
              <span className="font-medium text-gray-200">
                {formatCurrency(hardware?.replacedHardware?.reduce((acc, item) => acc + calculateItemTotal(item), 0))}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Service Total</span>
              <span className="font-medium text-gray-200">{formatCurrency(
                (hardware?.serviceCost?.diagnosis || 0) + 
                (hardware?.serviceCost?.workmanship || 0) + 
                (hardware?.serviceCost?.other || 0)
              )}</span>
            </div>
            <div className="border-t border-gray-700/50 pt-2 mt-2">
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-gray-200">Grand Total</span>
                <span className="text-purple-400">{formatCurrency(hardware?.totalCost)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="px-4 py-2 mt-6 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 
            border border-blue-500/50 transition-all duration-300 flex items-center gap-2 
            shadow-[0_0_10px_rgba(59,130,246,0.3)]"
        >
          <MdPrint />
          Print Invoice
        </button>
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