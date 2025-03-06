import { useState, useEffect } from 'react';
import { FaTrash, FaCamera } from 'react-icons/fa';

const DeviceImageEditHardwareReplacement = ({ transactionId, type = 'main', onImageChange }) => {
  const [images, setImages] = useState([]);
  const maxImages = 3;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`/api/transaction/images/replacehardware?transactionId=${transactionId}`);
        const data = await response.json();
        const filteredImages = data.filter(img => img.imageType === type);
        setImages(filteredImages.map(img => ({
          id: img._id,
          imageData: img.imageData
        })));
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    if (transactionId) {
      fetchImages();
    }
  }, [transactionId, type]);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    for (const file of files) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result;
        try {
          const response = await fetch('/api/transaction/images/replacehardware', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transactionId,
              imageType: type,
              imageData
            })
          });
          
          const data = await response.json();
          setImages(prev => [...prev, { id: data._id, imageData }]);
          if (onImageChange) onImageChange(imageData, type);
        } catch (error) {
          console.error('Error saving image:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async (imageId) => {
    try {
      await fetch(`/api/transaction/images/replacehardware?id=${imageId}`, {
        method: 'DELETE'
      });
      setImages(prev => prev.filter(img => img.id !== imageId));
      if (onImageChange) onImageChange(null, type);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <div className="w-full relative">
      <div className="grid grid-cols-3 gap-2">
        {images.map((image, index) => (
          <div key={image.id} className="relative">
            <img
              src={image.imageData}
              alt={`Preview ${index + 1}`}
              className="w-full h-[150px] object-cover rounded-lg"
            />
            <button
              className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white/90 rounded-full"
              onClick={() => handleRemoveImage(image.id)}
            >
              <FaTrash className="w-3 h-3 text-red-500" />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <label className="w-full h-[150px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
            <FaCamera className="w-8 h-8 text-gray-400" />
            <span className="mt-2 text-xs text-gray-500">
              Click to add image ({images.length}/{maxImages})
            </span>
          </label>
        )}
      </div>
    </div>
  );
};

export default DeviceImageEditHardwareReplacement;
