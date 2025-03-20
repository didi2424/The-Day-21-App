import { useState, useEffect } from "react";
import { format } from "date-fns";
import { MdDescription, MdInfo, MdSettings } from "react-icons/md";
import DeviceImage from "./DeviceImage";
import TotalService from "./TotalService";
import AddressPrint from "./AddressPrint";
const TransactionDetail = ({ transactionId }) => {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1); // Add this state

  useEffect(() => {
    const fetchTransactionDetail = async () => {
      try {
        const response = await fetch(`/api/transaction/${transactionId}`);
        const data = await response.json();
        setTransaction(data);
      } catch (error) {
        console.error("Error fetching transaction:", error);
      } finally {
        setLoading(false);
      }
    };

    if (transactionId) {
      fetchTransactionDetail();
    }
  }, [transactionId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const formatWarranty = (months) => {
    return `${months} Month${months > 1 ? 's' : ''}`;
  };

  const calculateItemTotal = (item) => {
    const subtotal = item.price * item.quantity;
    return subtotal - (subtotal * (item.discount || 0) / 100);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = document.getElementById('print-address');
    
    if (!printWindow || !printContent) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Service Address - ${transaction?.serviceNumber} - ${transaction.customer?.constumer_name} ${transaction.deviceModel}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="bg-white">
          <div class="max-w-4xl mx-auto p-8">
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Helper function to properly format accessories data
  const renderAccessories = (accessories) => {
    if (!accessories || !Array.isArray(accessories)) return null;

    return accessories.map((acc, index) => {
      // Handle if acc is a string (just the label)
      if (typeof acc === "string") {
        return (
          <span
            key={index}
            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
          >
            {acc}
          </span>
        );
      }

      // Handle if acc is an object with label property
      if (acc && acc.label) {
        return (
          <span
            key={index}
            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
          >
            {acc.label}
          </span>
        );
      }

      return null;
    });
  };

  if (loading) return <div>Loading...</div>;
  if (!transaction) return <div>Transaction not found</div>;

  const renderStep1 = () => (
    <div className="grid grid-cols-2 gap-4 h-[520px]">
      {/* Customer Info Card */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-blue-600/30 backdrop-blur-xl shadow-xl border border-white/30">
        <div className="flex items-center gap-2 mb-3">
          <MdInfo className="text-white text-xl" />
          <h2 className="text-lg font-semibold text-white">
            Customer Information
          </h2>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-600/40 to-purple-600/40 backdrop-blur-md rounded-lg border border-white/20">
            <div>
              <p className="font-medium text-base text-white">
                {transaction.customer?.constumer_name}
              </p>
              <p className="text-sm text-blue-100">
                {transaction.customer?.wa_number}
              </p>
            </div>
            <div className="text-right text-xs text-white">
              {[
                transaction.customer?.constumer_address?.street,
                transaction.customer?.constumer_address?.kabupaten,
                transaction.customer?.constumer_address?.province,
              ]
                .filter(Boolean)
                .join(", ")}
            </div>
          </div>
        </div>
        {/* Add Print Button */}
        <button
          onClick={() => handlePrint(transaction)}
          className="px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl
                         hover:opacity-90 transition-all duration-300 shadow-lg text-sm mt-2"
        >
          Print Adrress
        </button>
      </div>

      {/* Service Info Card */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-purple-600/30 backdrop-blur-xl shadow-xl border border-white/30">
        <div className="flex items-center gap-2 mb-3">
          <MdSettings className="text-white text-xl" />
          <h2 className="text-lg font-semibold text-white">Service Details</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <InfoCard
              label="Device Model"
              value={transaction.deviceModel}
              bgColor="bg-gradient-to-r from-blue-600/40 to-blue-500/40 backdrop-blur-md border border-white/20"
              textColor="text-white"
              labelColor="text-blue-100"
            />
            <InfoCard
              label="Service Type"
              value={transaction.serviceType}
              bgColor="bg-gradient-to-r from-purple-600/40 to-purple-500/40 backdrop-blur-md border border-white/20"
              textColor="text-white"
              labelColor="text-purple-100"
            />
            <InfoCard
              label="Technician"
              value={transaction.technician}
              bgColor="bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-blue-600/40 backdrop-blur-md border border-white/20"
              textColor="text-white"
              labelColor="text-blue-100"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-white mb-2">Issues</p>
            <div className="flex flex-wrap gap-2">
              {transaction.selectedIssues?.map((issue, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-red-600/40 to-purple-600/40 backdrop-blur-md border border-white/20 rounded-full text-sm text-white"
                >
                  {issue.label}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-white mb-2">Accessories</p>
            <div className="flex flex-wrap gap-2">
              {renderAccessories(transaction.accessories)}
            </div>
          </div>
        </div>
      </div>

      {/* Description Card */}
      <div className="col-span-2 p-4 rounded-xl bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-blue-600/30 backdrop-blur-xl shadow-xl border border-white/30">
        <div className="flex items-center gap-2 mb-3">
          <MdDescription className="text-white text-xl" />
          <h2 className="text-lg font-semibold text-white">
            Details & Condition
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gradient-to-r from-blue-600/40 to-purple-600/40 backdrop-blur-md rounded-lg border border-white/20">
            <h3 className="text-sm font-medium text-white mb-2">
              Problem Description
            </h3>
            <p className="text-sm text-white/90">
              {transaction.problemDescription}
            </p>
          </div>
          <div className="p-3 bg-gradient-to-r from-purple-600/40 to-blue-600/40 backdrop-blur-md rounded-lg border border-white/20">
            <h3 className="text-sm font-medium text-white mb-2">
              Device Condition
            </h3>
            <p className="text-sm text-white/90">
              {transaction.deviceCondition}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <DeviceImage
      transaction={transaction}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
    />
  );

  const renderStep3 = () => (
    <TotalService
      transaction={transaction}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
    />
  );

  return (
    <div className="">
      {/* Hidden Print Template */}
      <div id="print-address" className="hidden">
        <AddressPrint
          transaction={transaction}
          formatCurrency={formatCurrency}
          formatWarranty={formatWarranty}
          calculateItemTotal={calculateItemTotal}
        />
      </div>

      {/* Static Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-800/20 to-pink-900/20" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[700px] h-[700px] bg-pink-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 p-2 space-y-2">
        {/* Header Card */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold text-[#4ade80]">
                {transaction.serviceNumber}
              </h1>
              <p className="text-sm text-gray-600">
                Created:{" "}
                {format(new Date(transaction.createdAt), "MMM dd, yyyy HH:mm")}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                transaction.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : transaction.status === "in-progress"
                  ? "bg-blue-100 text-blue-700"
                  : transaction.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {transaction.status.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-2 shadow-2xl border border-white/10">
          <div className="relative overflow-hidden">
            <div
              className={`transition-all duration-500 transform ${
                currentStep === 1
                  ? "translate-x-0"
                  : currentStep === 2
                  ? "-translate-x-full"
                  : "-translate-x-[200%]"
              }`}
            >
              {renderStep1()}
            </div>
            <div
              className={`absolute top-0 w-full transition-all duration-500 transform ${
                currentStep === 2
                  ? "translate-x-0"
                  : currentStep === 1
                  ? "translate-x-full"
                  : "-translate-x-full"
              }`}
            >
              {renderStep2()}
            </div>
            <div
              className={`absolute top-0 w-full transition-all duration-500 transform ${
                currentStep === 3 ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {renderStep3()}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-end gap-4 mt-3">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl
                         hover:opacity-90 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Back
            </button>
          )}
          {currentStep < 3 && (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl
                         hover:opacity-90 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Update InfoCard component to handle label color
const InfoCard = ({ label, value, bgColor, textColor, labelColor }) => (
  <div className={`p-3 ${bgColor} rounded-lg`}>
    <p className={`text-xs ${labelColor}`}>{label}</p>
    <p className={`text-sm font-medium ${textColor}`}>{value}</p>
  </div>
);

export default TransactionDetail;
