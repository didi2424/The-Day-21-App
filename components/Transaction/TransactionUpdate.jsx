import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { MdClose } from 'react-icons/md';
import DeviceImageEdit from './DeviceImageEdit';

const TransactionUpdate = ({ setActiveButton, selectedTransactionId }) => {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    serviceNumber: '',
    deviceModel: '',
    status: '',
    serviceType: '',
    technician: '',
    problemDescription: '',
    deviceCondition: ''
  });

  const [selectedIssues, setSelectedIssues] = useState([]);
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [mainImageBase64, setMainImageBase64] = useState('');
  const [additionalImagesBase64, setAdditionalImagesBase64] = useState([]);
  const [formStep, setFormStep] = useState(1); // Add this state

  // Options for form selects
  const commonIssuesOptions = [
    { id: 'no-display', label: 'No Display' },
    { id: 'artifacts', label: 'Artifacts' },
    { id: 'fan-issue', label: 'Fan Issue' },
    { id: 'overheating', label: 'Overheating' },
    { id: 'bsod', label: 'BSOD' },
    { id: 'driver-crash', label: 'Driver Crash' },
    { id: 'no-power', label: 'No Power' },
    { id: 'memory-error', label: 'Memory Error' },
    { id: 'pcie-error', label: 'PCIe Error' },
    { id: 'coil-whine', label: 'Coil Whine' },
    { id: 'performance', label: 'Performance Drop' },
    { id: 'black-screen', label: 'Black Screen' }
  ];

  const accessoryOptions = [
    { id: "box", label: "Box" },
    { id: "pcie_case", label: "PCIe Case" },
    { id: "hdmi_case", label: "HDMI Case" },
    { id: "dp_case", label: "DP Case" },
  ];


  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const serviceTypeOptions = [
    { value: 'regular', label: 'Regular' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const technicianOptions = [
    { value: 'tech1', label: 'Technician 1' },
    { value: 'tech2', label: 'Technician 2' },
    { value: 'tech3', label: 'Technician 3' }
  ];

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(`/api/transaction/${selectedTransactionId}`);
        const data = await response.json();
        setTransaction(data);
        setFormData({
          serviceNumber: data.serviceNumber,
          deviceModel: data.deviceModel,
          status: data.status,
          serviceType: data.serviceType,
          technician: data.technician,
          problemDescription: data.problemDescription,
          deviceCondition: data.deviceCondition
        });

        // Extract IDs from existing issues and accessories
        const existingIssueIds = data.selectedIssues?.map(issue => 
          // Check both id and label to handle different data structures
          issue.id || commonIssuesOptions.find(opt => opt.label === issue.label)?.id
        ).filter(Boolean) || [];
        
        const existingAccessoryIds = data.accessories?.map(acc => 
          // Check both id and label to handle different data structures
          acc.id || accessoryOptions.find(opt => opt.label === acc.label)?.id
        ).filter(Boolean) || [];

        setSelectedIssues(existingIssueIds);
        setSelectedAccessories(existingAccessoryIds);

        // Set images
        if (data.images?.main) {
          setMainImage(data.images.main.imageData);
          setMainImageBase64(data.images.main.imageData);
        }
        if (data.images?.additional) {
          setAdditionalImages(data.images.additional.map(img => img.imageData));
          setAdditionalImagesBase64(data.images.additional.map(img => img.imageData));
        }

        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    if (selectedTransactionId) {
      fetchTransaction();
    }
  }, [selectedTransactionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleIssue = (issueId) => {
    setSelectedIssues(prev => {
      if (prev.includes(issueId)) {
        return prev.filter(id => id !== issueId);
      }
      return [...prev, issueId];
    });
  };

  const handleAccessoryToggle = (accessoryId) => {
    setSelectedAccessories(prev => {
      if (prev.includes(accessoryId)) {
        return prev.filter(id => id !== accessoryId);
      }
      return [...prev, accessoryId];
    });
  };

  const handleSubmit = async (imageData) => {
    const updateData = {
      ...formData,
      customer: transaction.customer?._id,
      selectedIssues: selectedIssues.map(issueId => ({
        id: issueId,
        label: commonIssuesOptions.find(opt => opt.id === issueId)?.label
      })),
      accessories: selectedAccessories.map(id => ({
        id,
        label: accessoryOptions.find(opt => opt.id === id)?.label
      })),
      images: imageData.images // Use the new image structure directly
    };

    try {
      const response = await fetch(`/api/transaction/${selectedTransactionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        toast.success('Transaction updated successfully');
        setActiveButton('transaction');
      } else {
        throw new Error('Failed to update transaction');
      }
    } catch (error) {
      toast.error('Failed to update transaction');
      console.error('Update error:', error);
    }
  };

  if (loading) return (
    <div>
      <h2 className="text-2xl font-bold">Transaction Update</h2>
      <p className="text-gray-500 mt-2">Please select a transaction to update</p>
    </div>
  );
  
  if (!transaction) return (
    <div>
      <h2 className="text-2xl font-bold">Transaction Update</h2>
      <p className="text-gray-500 mt-2">Transaction not found</p>
    </div>
  );

  const handleNext = () => {
    setFormStep(2);
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Edit Transaction</h2>
          <p className="text-gray-500">Transaction: {transaction.serviceNumber}</p>
        </div>
        <button
          onClick={() => setActiveButton('transaction')}
          className="px-4 py-2 bg-[#b9ec8f] text-black rounded-md hover:bg-[#a5d880]"
        >
          Back
        </button>
      </div>

      {formStep === 1 ? (
        <form className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4">Customer Information</h3>
              <div className="space-y-2">
                <p><span className="text-gray-500">Name:</span> {transaction.customer?.constumer_name}</p>
                <p><span className="text-gray-500">Phone:</span> {transaction.customer?.wa_number}</p>
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold">Service Details</h3>
              
              {/* Device Model */}
              <div>
                <label className="block text-sm font-medium mb-1">Device Model</label>
                <input
                  type="text"
                  name="deviceModel"
                  value={formData.deviceModel}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium mb-1">Service Type</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  {serviceTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Technician */}
              <div>
                <label className="block text-sm font-medium mb-1">Technician</label>
                <select
                  name="technician"
                  value={formData.technician}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Technician</option>
                  {technicianOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Issues & Accessories */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4">Issues & Accessories</h3>
              
              {/* Issues */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Issues</label>
                <div className="flex flex-wrap gap-2">
                  {commonIssuesOptions.map(issue => (
                    <button
                      key={issue.id}
                      type="button"
                      onClick={() => toggleIssue(issue.id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedIssues.includes(issue.id)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {issue.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessories */}
              <div>
                <label className="block text-sm font-medium mb-2">Accessories</label>
                <div className="flex flex-wrap gap-2">
                  {accessoryOptions.map(acc => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleAccessoryToggle(acc.id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedAccessories.includes(acc.id)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {acc.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description & Condition */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Problem Description</label>
                <textarea
                  name="problemDescription"
                  value={formData.problemDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Device Condition</label>
                <textarea
                  name="deviceCondition"
                  value={formData.deviceCondition}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Replace Submit Button with Next */}
          <div className="col-span-2 flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => setActiveButton('transaction')}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-[#b9ec8f] text-black rounded-md hover:bg-[#a5d880]"
            >
              Next: Edit Images
            </button>
          </div>
        </form>
      ) : (
        <DeviceImageEdit
          formStep={formStep}
          setFormStep={setFormStep}
          transaction={transaction}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default TransactionUpdate;
