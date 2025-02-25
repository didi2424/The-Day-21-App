import { useState } from 'react';
import { MdPersonSearch, MdClose } from "react-icons/md";
import Image from "next/image";

const TransactionAdd = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    phoneModel: '',
    problemDescription: '',
    deviceCondition: '',
    accessories: '',
    serviceType: 'regular', // regular, urgent
    technician: '',
    status: 'pending',
    notes: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  // Predefined tags for device types
  const deviceTags = [
    "LCD", "Battery", "Motherboard", "Speaker", "Camera",
    "Charging Port", "Power Button", "Volume Button", "Software",
    "Water Damage"
  ];

  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);

  const [formStep, setFormStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTagClick = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!selectedTags.includes(tagInput.trim())) {
        setSelectedTags([...selectedTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleMainImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMainImage(URL.createObjectURL(file));
    }
  };

  const handleAdditionalImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + additionalImages.length <= 3) {
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setAdditionalImages(prev => [...prev, ...newPreviews]);
    }
  };

  const handleNext = () => {
    setFormStep(2);
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-6">New Service Registration</h2>
      
      {formStep === 1 ? (
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Customer Search & Details */}
          <div className="bg-[#f7f7f7] p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            
            {/* Search Bar */}
            <div className="relative mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search customer..."
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
              <MdPersonSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"/>
            </div>

            {/* Customer Details Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={selectedCustomer?.constumer_name || ''}
                  className="w-full px-3 py-2 bg-[#efefef] rounded-md"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  value={selectedCustomer?.wa_number || ''}
                  className="w-full px-3 py-2 bg-[#efefef] rounded-md"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <textarea
                  value={selectedCustomer?.constumer_address?.street || ''}
                  className="w-full px-3 py-2 bg-[#efefef] rounded-md"
                  rows="3"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Right Column - Service Details */}
          <div className="bg-[#f7f7f7] p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Service Details</h3>
            
            <div className="space-y-2">
              {/* Phone Model with Tags */}
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-1">Phone Model</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="phoneModel"
                    value={formData.phoneModel}
                    onChange={handleChange}
                    placeholder="e.g., iPhone 12 Pro Max"
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

                {/* Predefined Tags */}
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">Common Issues:</p>
                  <div className="flex flex-wrap gap-2">
                    {deviceTags.map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => handleTagClick(tag)}
                        className={`text-xs px-2 py-1 rounded-full ${
                          selectedTags.includes(tag)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Problem Description</label>
                <textarea
                  name="problemDescription"
                  value={formData.problemDescription}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#efefef] rounded-md"
                  rows="2"
                  placeholder="Describe the problem in detail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Device Condition</label>
                <textarea
                  name="deviceCondition"
                  value={formData.deviceCondition}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#efefef] rounded-md"
                  rows="2"
                  placeholder="Current device condition, any existing damage..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Accessories Included</label>
                <input
                  type="text"
                  name="accessories"
                  value={formData.accessories}
                  onChange={handleChange}
                  placeholder="e.g., Charger, Case, Box"
                  className="w-full px-3 py-2 bg-[#efefef] rounded-md"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Service Type</label>
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
                  <label className="block text-sm font-medium mb-1">Assign Technician</label>
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

              <div>
                <label className="block text-sm font-medium mb-1">Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#efefef] rounded-md"
                  rows="2"
                  placeholder="Any additional notes..."
                />
              </div>

              <button 
                onClick={handleNext}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors mt-4"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {/* Service Image Details Form */}
          <div className="bg-[#f7f7f7] p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Device Images</h3>
            
            {/* Main Device Image */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Main Device Image</label>
                <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                  {mainImage ? (
                    <Image
                      src={mainImage}
                      alt="Device front"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <label className="w-full h-full flex items-center justify-center cursor-pointer">
                      <span className="text-gray-500">+ Add Main Image</span>
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
                <label className="block text-sm font-medium mb-2">Additional Images</label>
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                      {additionalImages[index] ? (
                        <Image
                          src={additionalImages[index]}
                          alt={`Additional ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
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

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setFormStep(1)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => console.log('Submit form', formData)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Submit Service
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Image Guidelines */}
          <div className="bg-[#f7f7f7] p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Image Guidelines</h3>
            <div className="space-y-4 text-sm">
              <p>Please ensure your images meet the following requirements:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Clear, well-lit photos of the device</li>
                <li>Include images of any visible damage</li>
                <li>Capture all sides of the device if relevant</li>
                <li>Maximum file size: 5MB per image</li>
                <li>Supported formats: JPG, PNG</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionAdd;
