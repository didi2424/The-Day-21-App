import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { MdDescription, MdInfo,  MdSettings} from 'react-icons/md';
import DeviceImage from './DeviceImage';
import TotalService from './TotalService';

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
        console.error('Error fetching transaction:', error);
      } finally {
        setLoading(false);
      }
    };

    if (transactionId) {
      fetchTransactionDetail();
    }
  }, [transactionId]);

  // Helper function to properly format accessories data
  const renderAccessories = (accessories) => {
    if (!accessories || !Array.isArray(accessories)) return null;
    
    return accessories.map((acc, index) => {
      // Handle if acc is a string (just the label)
      if (typeof acc === 'string') {
        return (
          <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
            {acc}
          </span>
        );
      }
      
      // Handle if acc is an object with label property
      if (acc && acc.label) {
        return (
          <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
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
    <div className="grid grid-cols-2 gap-4 ">
      {/* Customer Info Card */}
      <div className="p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <MdInfo className="text-[#b9ec8f] text-xl" />
          <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-base text-gray-900">{transaction.customer?.constumer_name}</p>
              <p className="text-sm text-gray-900">{transaction.customer?.wa_number}</p>
            </div>
            <div className="text-right text-xs text-gray-600">
              {[
                transaction.customer?.constumer_address?.street,
                transaction.customer?.constumer_address?.kabupaten,
                transaction.customer?.constumer_address?.province,
              ].filter(Boolean).join(', ')}
            </div>
          </div>
        </div>
      </div>

      {/* Updated Service Info Card with Issues & Accessories */}
      <div className=" p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <MdSettings className="text-[#b9ec8f] text-xl" />
          <h2 className="text-lg font-semibold text-gray-900">Service Details</h2>
        </div>
        <div className="space-y-4">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <InfoCard 
              label="Device Model" 
              value={transaction.deviceModel}
              bgColor="bg-blue-50"
              textColor="text-blue-700"
            />
            <InfoCard 
              label="Service Type" 
              value={transaction.serviceType}
              bgColor="bg-purple-50"
              textColor="text-purple-700"
            />
            <InfoCard 
              label="Technician" 
              value={transaction.technician}
              bgColor="bg-green-50"
              textColor="text-green-700"
            />
          </div>

          {/* Issues Section */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Issues</p>
            <div className="flex flex-wrap gap-2">
              {transaction.selectedIssues?.map((issue, index) => (
                <span key={index} 
                  className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                  {issue.label}
                </span>
              ))}
            </div>
          </div>

          {/* Accessories Section */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Accessories</p>
            <div className="flex flex-wrap gap-2">
              {renderAccessories(transaction.accessories)}
            </div>
          </div>
        </div>
      </div>

      {/* Description Card - More compact */}
      <div className="col-span-2 p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <MdDescription className="text-[#b9ec8f] text-xl" />
          <h2 className="text-lg font-semibold text-gray-900">Details & Condition</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-[#b9ec8f] mb-2">Problem Description</h3>
            <p className="text-sm text-gray-700">{transaction.problemDescription}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-[#b9ec8f] mb-2">Device Condition</h3>
            <p className="text-sm text-gray-700">{transaction.deviceCondition}</p>
          </div>
        </div>
      </div>
      <div className="col-span-2 flex justify-end mt-4">
        <button
          onClick={() => setCurrentStep(2)}
          className="px-4 py-2 bg-[#b9ec8f] text-black rounded-md hover:bg-[#a5d880]"
        >
          Next: View Images
        </button>
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
    <div className=" ">
      {/* Main Header - Made more compact */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{transaction.serviceNumber}</h1>
            <p className="text-sm text-gray-600">
              Created: {format(new Date(transaction.createdAt), "MMM dd, yyyy HH:mm")}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            transaction.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
            transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
            'bg-red-100 text-red-700'
          }`}>
            {transaction.status.toUpperCase()}
          </div>
        </div>
        
      </div>

      {/* Conditional Content Based on Step */}
      {currentStep === 1 ? renderStep1() : 
       currentStep === 2 ? renderStep2() : 
       renderStep3()}
    </div>
  );
};

// Fix InfoCard component syntax
const InfoCard = ({ label, value, bgColor, textColor }) => (
  <div className={`p-3 ${bgColor} rounded-lg`}>
    <p className="text-xs text-gray-600">{label}</p>
    <p className={`text-sm font-medium ${textColor}`}>{value}</p>
  </div>
);

export default TransactionDetail;
