import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DeviceImageEdit from "./DeviceImageEdit";
import TransactionUpdatePage2 from "./TransactionUpdatePage2";
import TransactionUpdatePage3 from "./TransactionUpdatePage3"; // Add this import

const TransactionUpdate = ({ setActiveButton, selectedTransactionId }) => {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    serviceNumber: "",
    deviceModel: "",
    status: "",
    serviceType: "",
    technician: "",
    problemDescription: "",
    deviceCondition: "",
  });

  const [selectedIssues, setSelectedIssues] = useState([]);
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [mainImageBase64, setMainImageBase64] = useState("");
  const [additionalImagesBase64, setAdditionalImagesBase64] = useState([]);
  const [formStep, setFormStep] = useState(1); // Add this state
  const [currentComponent, setCurrentComponent] = useState("basic"); // Add this state
  const [totalCost, setTotalCost] = useState(0); // Add this state

  // Add this handler
  const handleTotalCostChange = (cost) => {
    setTotalCost(cost);
  };

  // Options for form selects
  const commonIssuesOptions = [
    { id: "no-display", label: "No Display" },
    { id: "artifacts", label: "Artifacts" },
    { id: "fan-issue", label: "Fan Issue" },
    { id: "overheating", label: "Overheating" },
    { id: "short-5v", label: "Short 5v" },
    { id: "driver-crash", label: "Driver Crash" },
    { id: "no-power", label: "No Power" },
    { id: "memory-error", label: "Memory Error" },
    { id: "short-1.8v", label: "Short 1.8v" },
    { id: "short-pex", label: "Short PEX" },
    { id: "short-12v", label: "Short 12v" },
    { id: "performance", label: "Performance Drop" },
    { id: "black-screen", label: "Black Screen" },
    { id: "missing-1.8v", label: "Missing 1.8v" },
    { id: "missing-Pex", label: "Missing Pex" },
    { id: "missing-3v3", label: "Missing 3v3" },
    { id: "error-43", label: "Error 43" },
    { id: "missing-NVDD", label: "Missing NVDD" },
    { id: "deadcore", label: "DeadCore" },
  ];

  const accessoryOptions = [
    { id: "box", label: "Box" },
    { id: "pcie_case", label: "PCIe Case" },
    { id: "hdmi_case", label: "HDMI Case" },
    { id: "dp_case", label: "DP Case" },
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "waiting-parts", label: "Waiting Parts" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const serviceTypeOptions = [
    { value: "regular", label: "Regular" },
    { value: "urgent", label: "Urgent" },
  ];

  const technicianOptions = [
    { value: "tech1", label: "Technician 1" },
    { value: "tech2", label: "Technician 2" },
    { value: "tech3", label: "Technician 3" },
  ];
  

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(
          `/api/transaction/${selectedTransactionId}`
        );
        const data = await response.json();
        setTransaction(data);
        setFormData({
          serviceNumber: data.serviceNumber,
          deviceModel: data.deviceModel,
          status: data.status,
          serviceType: data.serviceType,
          technician: data.technician,
          problemDescription: data.problemDescription,
          deviceCondition: data.deviceCondition,
        });

        // Extract IDs from existing issues and accessories
        const existingIssueIds =
          data.selectedIssues
            ?.map(
              (issue) =>
                // Check both id and label to handle different data structures
                issue.id ||
                commonIssuesOptions.find((opt) => opt.label === issue.label)?.id
            )
            .filter(Boolean) || [];

        const existingAccessoryIds =
          data.accessories
            ?.map(
              (acc) =>
                // Check both id and label to handle different data structures
                acc.id ||
                accessoryOptions.find((opt) => opt.label === acc.label)?.id
            )
            .filter(Boolean) || [];

        setSelectedIssues(existingIssueIds);
        setSelectedAccessories(existingAccessoryIds);

        // Set images
        if (data.images?.main) {
          setMainImage(data.images.main.imageData);
          setMainImageBase64(data.images.main.imageData);
        }
        if (data.images?.additional) {
          setAdditionalImages(
            data.images.additional.map((img) => img.imageData)
          );
          setAdditionalImagesBase64(
            data.images.additional.map((img) => img.imageData)
          );
        }

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    if (selectedTransactionId) {
      fetchTransaction();
    }
  }, [selectedTransactionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleIssue = (issueId) => {
    setSelectedIssues((prev) => {
      if (prev.includes(issueId)) {
        return prev.filter((id) => id !== issueId);
      }
      return [...prev, issueId];
    });
  };

  const handleAccessoryToggle = (accessoryId) => {
    setSelectedAccessories((prev) => {
      if (prev.includes(accessoryId)) {
        return prev.filter((id) => id !== accessoryId);
      }
      return [...prev, accessoryId];
    });
  };

  const handleSubmit = async () => {
    // Get reference to TransactionUpdatePage2 component
    const hardwareComponent = document.querySelector('[data-hardware-component]');
    if (hardwareComponent && hardwareComponent.handleSave) {
      const hardwareSaved = await hardwareComponent.handleSave();
      if (!hardwareSaved) {
        return;
      }
    }
  
    const imageData = {
      images: {
        main: { imageData: mainImageBase64 },
        additional: additionalImagesBase64.map(img => ({ imageData: img }))
      }
    };
  
    try {
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
        images: imageData.images
      };
  
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
  

  const handleImageSubmit = async () => {
    try {
      const imageData = {
        images: {
          main: { imageData: mainImageBase64 },
          additional: additionalImagesBase64.map((img) => ({ imageData: img })),
        },
      };

      // Skip handleSaveImages call since it's not needed here
      const updateData = {
        ...formData,
        customer: transaction.customer?._id,
        selectedIssues: selectedIssues.map((issueId) => ({
          id: issueId,
          label: commonIssuesOptions.find((opt) => opt.id === issueId)?.label,
        })),
        accessories: selectedAccessories.map((id) => ({
          id,
          label: accessoryOptions.find((opt) => opt.id === id)?.label,
        })),
        images: imageData.images,
      };

      const response = await fetch(
        `/api/transaction/${selectedTransactionId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );

      if (response.ok) {
        toast.success("Images updated successfully");
      } else {
        throw new Error("Failed to update transaction");
      }
    } catch (error) {
      toast.error("Failed to update transaction");
      console.error("Update error:", error);
    }
  };

  if (loading)
    return (
      <div>
        <h2 className="text-2xl font-bold">Transaction Update</h2>
        <p className="text-gray-500 mt-2">
          Please select a transaction to update
        </p>
      </div>
    );

  if (!transaction)
    return (
      <div>
        <h2 className="text-2xl font-bold">Transaction Update</h2>
        <p className="text-gray-500 mt-2">Transaction not found</p>
      </div>
    );

  const renderComponent = () => {
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-2 shadow-2xl border border-white/10">
        <div className="relative overflow-hidden">
          {/* Form Step 1 */}
          <div
            className={`transition-all duration-500 transform ${
              formStep === 1
                ? "translate-x-0"
                : formStep === 2
                ? "-translate-x-full"
                : "-translate-x-[200%]"
            }`}
          >
            {/* Basic Form Content */}
            <form className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Customer Info */}
                <div className=" p-4 rounded-xl bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-blue-600/30 backdrop-blur-xl shadow-xl border border-white/30">
                  <h3 className="font-semibold mb-4">Customer Information</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-500">Name:</span>{" "}
                      {transaction.customer?.constumer_name}
                    </p>
                    <p>
                      <span className="text-gray-500">Phone:</span>{" "}
                      {transaction.customer?.wa_number}
                    </p>
                  </div>
                </div>

                {/* Service Details */}
                <div className=" p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold">Service Details</h3>

                  {/* Device Model */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Device Model
                    </label>
                    <input
                      type="text"
                      name="deviceModel"
                      value={formData.deviceModel}
                      onChange={handleChange}
                      className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                    />
                  </div>

                  {/* Service Type */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Service Type
                    </label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                    >
                      {serviceTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Technician */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Technician
                    </label>
                    <select
                      name="technician"
                      value={formData.technician}
                      onChange={handleChange}
                      className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                    >
                      <option value="">Select Technician</option>
                      {technicianOptions.map((option) => (
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
                <div className=" p-4 rounded-lg">
                  <h3 className="font-semibold mb-4">Issues & Accessories</h3>

                  {/* Issues */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Issues
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {commonIssuesOptions.map((issue) => (
                        <button
                          key={issue.id}
                          type="button"
                          onClick={() => toggleIssue(issue.id)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            selectedIssues.includes(issue.id)
                              ? "px-3 py-1 bg-gradient-to-r from-red-600/40 to-purple-600/40 backdrop-blur-md border border-white/20 rounded-full text-sm text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {issue.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accessories */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Accessories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {accessoryOptions.map((acc) => (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => handleAccessoryToggle(acc.id)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            selectedAccessories.includes(acc.id)
                              ? "px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {acc.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description & Condition */}
                <div className=" p-4 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Problem Description
                    </label>
                    <textarea
                      name="problemDescription"
                      value={formData.problemDescription}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Device Condition
                    </label>
                    <textarea
                      name="deviceCondition"
                      value={formData.deviceCondition}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-2  bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Replace Submit Button with Next */}
            </form>
          </div>

          {/* Form Step 2 */}
          <div
            className={`absolute top-0 w-full transition-all duration-500 transform ${
              formStep === 2
                ? "translate-x-0"
                : formStep === 1
                ? "translate-x-full"
                : "-translate-x-full"
            }`}
          >
            <DeviceImageEdit
              formStep={formStep}
              transaction={transaction}
              handleSubmit={handleImageSubmit}
              setMainImageBase64={setMainImageBase64}
              setAdditionalImagesBase64={setAdditionalImagesBase64}
            />
          </div>

          {/* Form Step 3 */}
          <div
            className={`absolute top-0 w-full transition-all duration-500 transform ${
              formStep === 3 ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <TransactionUpdatePage2
              selectedTransactionId={selectedTransactionId}
              setActiveButton={setActiveButton}
              setFormStep={setFormStep}
              onTotalCostChange={handleTotalCostChange} // Add this prop
              data-hardware-component
            />
          </div>

          {/* Add Form Step 4 */}
          <div
            className={`absolute top-0 w-full transition-all duration-500 transform ${
              formStep === 4 ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <TransactionUpdatePage3
              selectedTransactionId={selectedTransactionId}
              setActiveButton={setActiveButton}
              setFormStep={setFormStep}
              totalAmount={totalCost} // Pass totalCost as totalAmount
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className=" rounded-lg ">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-800/20 to-pink-900/20" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[700px] h-[700px] bg-pink-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Edit Transaction</h2>
          <p className="text-gray-500">
            Transaction: {transaction.serviceNumber}
          </p>
        </div>
      </div>

      {renderComponent()}

      <div className="col-span-2 flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={() => setActiveButton("transaction")}
          className="px-8 py-3 bg-slate-700 text-white rounded-xl
                         hover:opacity-90 transition-all duration-300 shadow-lg transform hover:scale-105"
        >
          Cancel
        </button>
        {formStep === 1 && (
          <button
            type="button"
            onClick={() => setFormStep(2)}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl
                         hover:opacity-90 transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            Next: Edit Images
          </button>
        )}
        {formStep === 2 && (
          <>
            <button
              type="button"
              onClick={() => setFormStep(1)}
              className="px-8 py-3 bg-slate-700 text-white rounded-xl
                         hover:opacity-90 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setFormStep(3)} // Remove the nested function call
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl
                         hover:opacity-90 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Next: Hardware
            </button>
          </>
        )}
        {formStep === 3 && (
          <>
            <button
              type="button"
              onClick={() => setFormStep(2)}
              className="px-8 py-3 bg-slate-700 text-white rounded-xl
                         hover:opacity-90 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setFormStep(4)} // Changed to move to payment step
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl
                         hover:opacity-90 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Next: Payment
            </button>
          </>
        )}
        {formStep === 4 && (
          <>
            <button
              type="button"
              onClick={() => setFormStep(3)}
              className="px-8 py-3 bg-slate-700 text-white rounded-xl
                         hover:opacity-90 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl
                         hover:opacity-90 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Finish
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionUpdate;
