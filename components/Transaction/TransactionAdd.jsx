import { useState, useEffect, useCallback } from "react";
import { MdPersonSearch, MdClose } from "react-icons/md";
import Image from "next/image";
import { convertToBase64 } from '@utils/format/convertobase64';
import { toast } from 'react-toastify';

const TransactionAdd = () => {
  const [formData, setFormData] = useState({
    customer: "", // Simpan customer ID
    phoneModel: "",
    problemDescription: "",
    deviceCondition: "",
    accessories: "",
    serviceType: "regular", // regular, urgent
    technician: "",
    status: "pending",
    serviceNumber: generateServiceNumber(), // Add new field
  });

  // Add function to generate service number (format: SVC-YYYYMMDD-XXXX)
  function generateServiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `SVC-${year}${month}${day}-${random}`;
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // Ganti deviceTags menjadi commonIssuesOptions untuk konsistensi
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

  // Update state name untuk konsistensi
  const [selectedIssues, setSelectedIssues] = useState([]);

  // Ganti handleTagClick dengan toggleIssue
  const toggleIssue = (issueId) => {
    setSelectedIssues(prev => {
      if (prev.includes(issueId)) {
        return prev.filter(id => id !== issueId);
      } else {
        return [...prev, issueId];
      }
    });
  };

  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);

  const [formStep, setFormStep] = useState(1);

  // Add accessories options
  const accessoryOptions = [
    { id: "box", label: "Box" },
    { id: "pcie_case", label: "PCIe Case" },
    { id: "hdmi_case", label: "HDMI Case" },
    { id: "dp_case", label: "DP Case" },
  ];

  const [selectedAccessories, setSelectedAccessories] = useState([]);

  const handleAccessoryToggle = (accessoryId) => {
    setSelectedAccessories((prev) => {
      if (prev.includes(accessoryId)) {
        return prev.filter((id) => id !== accessoryId);
      } else {
        return [...prev, accessoryId];
      }
    });

    // Update formData accessories field
    const selectedLabels = accessoryOptions
      .filter((opt) => [...selectedAccessories, accessoryId].includes(opt.id))
      .map((opt) => opt.label)
      .join(", ");

    setFormData((prev) => ({
      ...prev,
      accessories: selectedLabels,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearching(true);
  };

  const handleTagClick = (tagId) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!selectedTags.includes(tagInput.trim())) {
        setSelectedTags([...selectedTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const [mainImageBase64, setMainImageBase64] = useState("");
  const [additionalImagesBase64, setAdditionalImagesBase64] = useState([]);

  const handleMainImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setMainImage(URL.createObjectURL(file));
        setMainImageBase64(base64);
      } catch (error) {
        console.error("Error converting main image:", error);
      }
    }
  };

  const handleAdditionalImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length + additionalImages.length <= 3) {
      try {
        const newPreviews = files.map(file => URL.createObjectURL(file));
        const newBase64Images = await Promise.all(
          files.map(file => convertToBase64(file))
        );

        setAdditionalImages(prev => [...prev, ...newPreviews]);
        setAdditionalImagesBase64(prev => [...prev, ...newBase64Images]);
      } catch (error) {
        console.error("Error converting additional images:", error);
      }
    }
  };

  const handleDeleteMainImage = () => {
    setMainImage(null);
    setMainImageBase64("");
  };

  const handleDeleteAdditionalImage = (index) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    setAdditionalImagesBase64(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    setFormStep(2);
  };

  // Tambah fungsi untuk mencari customer
  const searchCustomer = async (searchTerm) => {
    try {
      const response = await fetch(`/api/customers/search?term=${searchTerm}`);
      const data = await response.json();
      // Tampilkan hasil pencarian
      setCustomerResults(data);
    } catch (error) {
      console.error("Error searching customers:", error);
    }
  };

  // Fungsi saat customer dipilih
  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setFormData((prev) => ({
      ...prev,
      customer: customer._id,
    }));
    setSearchTerm("");
    setCustomerResults([]);
  };

  // Add new states for customer search
  const [customerResults, setCustomerResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Add new states for search handling
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Search function
  const searchCustomers = useCallback(async () => {
    if (!debouncedSearchTerm) {
      setCustomerResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/customer/search?term=${encodeURIComponent(debouncedSearchTerm)}`
      );
      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      setCustomerResults(data.customers); // Pastikan mengambil array customers dari response
    } catch (error) {
      console.error("Search error:", error);
      setCustomerResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [debouncedSearchTerm]);

  // Effect for search
  useEffect(() => {
    searchCustomers();
  }, [debouncedSearchTerm, searchCustomers]);

  const handleSubmitService = async () => {
    // Get selected issue labels
    const selectedIssueLabels = selectedIssues.map(issueId => 
      commonIssuesOptions.find(option => option.id === issueId)?.label
    ).filter(Boolean);

    // Prepare data for submission
    const submissionData = {
      ...formData,
      customerDetails: {
        id: selectedCustomer?._id,
        name: selectedCustomer?.constumer_name,
        phone: selectedCustomer?.wa_number,
        address: selectedCustomer?.constumer_address
      },
      serviceDetails: {
        deviceModel: formData.phoneModel,
        issues: selectedIssueLabels,
        accessories: selectedAccessories.map(id => 
          accessoryOptions.find(opt => opt.id === id)?.label
        ),
        problemDescription: formData.problemDescription,
        serviceType: formData.serviceType,
        technician: formData.technician
      },
      deviceCondition: formData.deviceCondition,
      images: {
        main: mainImageBase64,
        additional: additionalImagesBase64
      },
      serviceNumber: formData.serviceNumber,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      const data = await response.json();

      if (response.status === 409) {
        toast.error(data.message || 'Service Number Sudah Ada');
        // Generate new service number
        setFormData(prev => ({
          ...prev,
          serviceNumber: generateServiceNumber()
        }));
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create transaction');
      }
      toast.success('Service registration successful!');
      setFormStep(1);
      
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error(error.message || 'Failed to register service');
    }
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-6">New Service Registration</h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Customer Search & Details - Always visible */}
        <div className="bg-[#f7f7f7] p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Customer Information</h3>

          {/* Modified Search Results Section */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search customer by name or phone..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 p-1 rounded-full"
              >
                <MdClose className="text-gray-500 text-xl hover:text-gray-700" />
              </button>
            )}
            <MdPersonSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />

            {/* Enhanced Search Results Dropdown */}
            {customerResults.length > 0 && (
              <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-[300px] overflow-auto">
                {customerResults.map((customer) => (
                  <div
                    key={customer._id}
                    onClick={() => handleCustomerSelect(customer)}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-0 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-900">
                          {customer.constumer_name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {customer.wa_number}
                        </div>
                      </div>
                      {customer.constumer_address && (
                        <div className="text-xs text-gray-500 max-w-[300px] truncate">
                          {customer.constumer_address.street},{" "}
                          {customer.constumer_address.kabupaten},{" "}
                          {customer.constumer_address.province}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Loading State */}
            {isSearching && customerResults.length === 0 && (
              <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-4 text-center text-gray-500">
                Searching...
              </div>
            )}

            {/* No Results State */}
            {!isSearching && searchTerm && customerResults.length === 0 && (
              <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-4 text-center text-gray-500">
                No customers found
              </div>
            )}
          </div>

          {/* Display Selected Customer Info */}
          {selectedCustomer ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Customer Name
                </label>
                <div className="w-full px-3 py-2 bg-[#efefef] rounded-md">
                  {selectedCustomer.constumer_name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <div className="w-full px-3 py-2 bg-[#efefef] rounded-md">
                  {selectedCustomer.wa_number}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <div className="w-full px-3 py-2 bg-[#efefef] rounded-md min-h-[72px]">
                  {[
                    selectedCustomer.constumer_address?.street,
                    selectedCustomer.constumer_address?.kabupaten,
                    selectedCustomer.constumer_address?.province,
                  ]
                    .filter(Boolean) // Hapus nilai yang kosong/null
                    .join(", ")}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Search for a customer to begin
            </div>
          )}
        </div>

        {/* Right Column - Conditional Content based on formStep */}
        <div className="bg-[#f7f7f7] p-4 rounded-lg flex flex-col min-h-[700px]">
          {formStep === 1 ? (
            <>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-4">Service Details</h3>
                <div className="space-y-4">
                  {/* Service Number - Add this block first */}
                  <div className="bg-gray-100 p-3 rounded-md mb-4">
                    <label className="block text-sm font-medium text-gray-600">
                      Service Number
                    </label>
                    <div className="text-lg font-mono font-bold text-[#b9ec8f]">
                      {formData.serviceNumber}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Please keep this number for tracking your service status
                    </p>
                  </div>

                  {/* Phone Model with Tags */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium mb-1">
                      Device Model
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="phoneModel"
                        value={formData.phoneModel}
                        onChange={handleChange}
                        placeholder="e.g., RTX 3080 ASUS TUF"
                        className="flex-1 px-3 py-2 bg-[#efefef] rounded-md"
                      />
                      <input
                        type="text"
                        value={tagInput}
                        onChange={handleTagInputChange}
                        onKeyDown={handleTagInputKeyDown}
                        placeholder="Common Issues..."
                        className="w-1/3 px-3 py-2 bg-[#efefef] rounded-md"
                      />
                    </div>

                    {/* Selected Tags */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="hover:text-blue-600"
                          >
                            <MdClose size={16} />
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Replace the existing Common Issues section */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Common Issues</label>
                      <div className="flex flex-wrap gap-2">
                        {commonIssuesOptions.map((issue) => (
                          <button
                            key={issue.id}
                            onClick={() => toggleIssue(issue.id)}
                            className={`text-xs px-2 py-1 rounded-full border transition-colors
                              ${selectedIssues.includes(issue.id)
                                ? 'bg-[#b9ec8f] border-[#b9ec8f] text-black'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            {issue.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Replace existing accessories section */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Accessories Included
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {accessoryOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleAccessoryToggle(option.id)}
                          className={`text-xs px-2 py-1 rounded-full border transition-colors
                            ${
                              selectedAccessories.includes(option.id)
                                ? "bg-[#b9ec8f] border-[#b9ec8f] text-black"
                                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Problem Description
                    </label>
                    <textarea
                      name="problemDescription"
                      value={formData.problemDescription}
                      onChange={handleChange}
                      className="w-full px-3 py-1 bg-[#efefef] rounded-md"
                      rows="4"
                      placeholder="Describe the problem in detail..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">
                        Service Type
                      </label>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-[#efefef] rounded-md"
                      >
                        <option value="regular">Regular</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">
                        Assign Technician
                      </label>
                      <select
                        name="technician"
                        value={formData.technician}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-[#efefef] rounded-md"
                      >
                        <option value="">Select Technician</option>
                        <option value="tech1">Technician 1</option>
                        <option value="tech2">Technician 2</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleNext}
                className="w-full bg-[#b9ec8f] text-black py-2 rounded-md  "
              >
                Next
              </button>
            </>
          ) : (
            <>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-4">
                  Device Images & Condition
                </h3>
                <div className="space-y-4">
                  {/* Main Device Image */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Main Device Image
                    </label>
                    <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden relative">
                      {mainImage ? (
                        <>
                          <Image
                            src={mainImage}
                            alt="Device front"
                            width={400}
                            height={400}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={handleDeleteMainImage}
                            className="absolute bottom-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <MdClose size={20} />
                          </button>
                        </>
                      ) : (
                        <label className="w-full h-full flex items-center justify-center cursor-pointer">
                          <span className="text-gray-500">
                            + Add Main Image
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleMainImageUpload}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Additional Device Images Grid */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Additional Images
                    </label>
                    <div className="flex gap-2">
                      {" "}
                      {/* Changed from grid to flex */}
                      {[...Array(3)].map((_, index) => (
                        <div
                          key={index}
                          className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden relative"
                        >
                          {" "}
                          {/* Changed size to 24 (96px) */}
                          {additionalImages[index] ? (
                            <>
                              <Image
                                src={additionalImages[index]}
                                alt={`Additional ${index + 1}`}
                                width={96} // Reduced size
                                height={96} // Reduced size
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() =>
                                  handleDeleteAdditionalImage(index)
                                }
                                className="absolute bottom-1 right-1 bg-red-500 text-white p-0.5 rounded-full hover:bg-red-600 transition-colors"
                              >
                                <MdClose size={16} />
                              </button>
                            </>
                          ) : (
                            <label className="w-full h-full flex items-center justify-center cursor-pointer">
                              <span className="text-gray-500">+</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAdditionalImageUpload}
                              />
                            </label>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Moved Device Condition here */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium mb-2">
                      Device Condition
                    </label>
                    <textarea
                      name="deviceCondition"
                      value={formData.deviceCondition}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#efefef] rounded-md"
                      rows="3"
                      placeholder="Current device condition, any existing damage..."
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Buttons - Now aligned with Next button position */}
              <div className="flex gap-4">
                <button
                  onClick={() => setFormStep(1)}
                  className="flex-1 px-4 py-2 border border-gray-300  text-sm rounded-md hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitService}
                  className="flex-1 bg-[#b9ec8f] text-black font-bold text-sm py-2 rounded-md"
                >
                  Submit Service
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionAdd;
