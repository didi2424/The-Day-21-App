import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MdClose } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';

const DeviceImageEdit = ({ formStep, setFormStep, transaction, handleSubmit }) => {
  const [mainImage, setMainImage] = useState(transaction.images?.main?.imageData || null);
  const [additionalImages, setAdditionalImages] = useState(
    transaction.images?.additional?.map(img => img.imageData) || []
  );
  const [mainImageBase64, setMainImageBase64] = useState(transaction.images?.main?.imageData || '');
  const [additionalImagesBase64, setAdditionalImagesBase64] = useState(
    transaction.images?.additional?.map(img => img.imageData) || []
  );

  const handleImageChange = async (e, type, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'main') {
          setMainImage(URL.createObjectURL(file));
          setMainImageBase64(reader.result);
        } else {
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

  const handleFinishUpdate = async () => {
    try {
      // Update images first
      const imageData = {
        images: {
          main: {
            imageData: mainImageBase64
          },
          additional: additionalImagesBase64
            .filter(Boolean)
            .map(base64 => ({
              imageData: base64
            }))
        }
      };

      const imageResponse = await fetch(`/api/transaction/images/${transaction._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imageData)
      });

      if (!imageResponse.ok) {
        throw new Error('Failed to update images');
      }

      // Then update transaction
      handleSubmit(imageData);

    } catch (error) {
      console.error('Error updating images:', error);
      toast.error('Failed to update images');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Device Images</h3>
      
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
          onClick={handleFinishUpdate}
          className="px-4 py-2 bg-[#b9ec8f] text-black rounded-md hover:bg-[#a5d880]"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default DeviceImageEdit;
