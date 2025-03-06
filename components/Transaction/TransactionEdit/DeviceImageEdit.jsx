import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DeviceImageEditHardwareReplacement from './DeviceImageEditHardwareReplacement';

const DeviceImageEdit = ({ formStep, setFormStep, transaction, handleSubmit, setCurrentComponent }) => {
  const [mainImage, setMainImage] = useState(transaction.images?.main?.imageData || null);
  const [additionalImages, setAdditionalImages] = useState(
    transaction.images?.additional?.map(img => img.imageData) || []
  );
  const [mainImageBase64, setMainImageBase64] = useState(transaction.images?.main?.imageData || '');
  const [additionalImagesBase64, setAdditionalImagesBase64] = useState(
    transaction.images?.additional?.map(img => img.imageData) || []
  );

  useEffect(() => {
    console.log('Transaction ID:', transaction._id);
    // Fetch existing images on mount
    const fetchImages = async () => {
      try {
        const response = await fetch(`/api/transaction/images/${transaction._id}`);
        const data = await response.json();
        console.log('Fetched images from API:', data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, [transaction._id]);

  const handleImageChange = async (e, type, index) => {
    const file = e.target.files[0];
    console.log(`Image change triggered - Type: ${type}, Index: ${index}, File:`, file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'main') {
          console.log('Updating main image');
          setMainImage(URL.createObjectURL(file));
          setMainImageBase64(reader.result);
        } else {
          console.log(`Updating additional image at index: ${index}`);
          const newImages = [...additionalImages];
          const newBase64Images = [...additionalImagesBase64];
          newImages[index] = URL.createObjectURL(file);
          newBase64Images[index] = reader.result;
          setAdditionalImages(newImages);
          setAdditionalImagesBase64(newBase64Images);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (type, index) => {
    console.log(`Deleting image - Type: ${type}, Index: ${index}`);
    if (type === 'main') {
      setMainImage(null);
      setMainImageBase64('');
    } else {
      const newImages = [...additionalImages];
      const newBase64Images = [...additionalImagesBase64];
      newImages[index] = null;
      newBase64Images[index] = '';
      setAdditionalImages(newImages);
      setAdditionalImagesBase64(newBase64Images);
    }
  };

  const handleSaveImages = async () => {
    console.log('Starting image save process for transaction:', transaction._id);
    
    try {
      // Filter out empty images
      const validAdditionalImages = additionalImagesBase64
        .filter(base64 => base64 && base64.trim() !== '')
        .map(preview => ({ imageData: preview }));

      const imageData = {
        images: {
          main: mainImageBase64 ? { imageData: mainImageBase64 } : null,
          additional: validAdditionalImages
        }
      };
      
      console.log('Submitting images:', {
        hasMain: !!imageData.images.main,
        additionalCount: imageData.images.additional.length
      });

      const response = await fetch(`/api/transaction/images/${transaction._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imageData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.message || 'Failed to save images');
      }

      const savedImages = await response.json();
      console.log('Successfully saved images:', savedImages.length);
      
      await handleSubmit(imageData);
      toast.success('Images saved successfully');
    } catch (error) {
      console.error('Save Error:', error);
      toast.error(error.message || 'Failed to save images');
    }
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Device Image Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Device Image</h3>
          <div className="w-full relative">
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Main Image */}
              <div>
                <label className="block text-sm font-medium mb-2">Main Image</label>
                <div className="relative aspect-square w-[300px] rounded-lg overflow-hidden group">
                  <Image 
                    src={mainImage || '/placeholder.jpg'}
                    alt="Main device"
                    fill
                    className="rounded-lg object-cover"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'main')}
                    className="hidden"
                    id="main-image"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <label
                      htmlFor="main-image"
                      className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
                    >
                      Change
                    </label>
                    {mainImage && (
                      <button
                        onClick={() => handleDeleteImage('main')}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Images */}
              <div>
                <label className="block text-sm font-medium mb-2">Additional Images</label>
                <div className="grid grid-cols-4 gap-4 w-[300px]">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="relative aspect-square">
                      <div className="w-full h-full rounded-lg overflow-hidden group">
                        {additionalImages[index] ? (
                          <>
                            <Image
                              src={additionalImages[index]}
                              alt={`Additional ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                              <label
                                htmlFor={`additional-image-${index}`}
                                className="px-2 py-1 bg-blue-500 text-white rounded cursor-pointer text-xs hover:bg-blue-600"
                              >
                                Change
                              </label>
                              <button
                                onClick={() => handleDeleteImage('additional', index)}
                                className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                              >
                                Delete
                              </button>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, 'additional', index)}
                              className="hidden"
                              id={`additional-image-${index}`}
                            />
                          </>
                        ) : (
                          <label
                            htmlFor={`additional-image-${index}`}
                            className="w-full h-full flex items-center justify-center bg-gray-200 cursor-pointer hover:bg-gray-300 transition-colors"
                          >
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, 'additional', index)}
                              className="hidden"
                              id={`additional-image-${index}`}
                            />
                            <span className="text-gray-500 text-2xl">+</span>
                          </label>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

             
            </div>
          </div>
        </div>

        {/* Hardware Replacement Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Hardware Replacement Image</h3>
          <DeviceImageEditHardwareReplacement
            transactionId={transaction._id}
            type="main"
            onImageChange={(imageData, type) => {
              // Optional: Handle hardware replacement image changes
            }}
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={() => setFormStep(1)}
          className="px-4 py-2 border rounded-md hover:bg-gray-100"
        >
          Back
        </button>
        <button
          onClick={handleSaveImages}
          className="px-4 py-2 bg-[#b9ec8f] text-black rounded-md hover:bg-[#a5d880]"
        >
          Next: Add Hardware & Costs
        </button>
      </div>
    </div>
  );
};

export default DeviceImageEdit;
