import { useState, useEffect } from "react";
import { FaTrash, FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";

const DeviceImageEditHardwareReplacement = ({
  transactionId,
  type = "main",
  onImageChange,
}) => {
  const [images, setImages] = useState([]);
  const [pendingImages, setPendingImages] = useState([]); // Add state for pending images
  const maxImages = 3;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `/api/transaction/images/replacehardware?transactionId=${transactionId}`
        );
        const data = await response.json();
        const filteredImages = data.filter((img) => img.imageType === type);
        setImages(
          filteredImages.map((img) => ({
            id: img._id,
            imageData: img.imageData,
          }))
        );
      } catch (error) {
        console.error("Error fetching images:", error);
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
      reader.onloadend = () => {
        const imageData = reader.result;
        setPendingImages((prev) => [...prev, { imageData }]); // Store in pending instead of saving
        if (onImageChange) onImageChange(imageData, type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      // Save all pending images
      for (const image of pendingImages) {
        const response = await fetch(
          "/api/transaction/images/replacehardware",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transactionId,
              imageType: type,
              imageData: image.imageData,
            }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          setImages((prev) => [
            ...prev,
            { id: data._id, imageData: image.imageData },
          ]);
        }
      }

      // Clear pending images after successful save
      setPendingImages([]);
      toast.success("Hardware replacement images saved successfully");
    } catch (error) {
      console.error("Error saving images:", error);
      toast.error("Failed to save hardware replacement images");
    }
  };

  const handleRemoveImage = async (imageId) => {
    try {
      await fetch(`/api/transaction/images/replacehardware?id=${imageId}`, {
        method: "DELETE",
      });
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      if (onImageChange) onImageChange(null, type);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="w-full  flex flex-col">
      <div className="bg-white/1 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg">
        <label className="block text-sm font-medium mb-2">
          Replaced Hardware
        </label>
        
        <div className="grid grid-cols-3 gap-2">
          {/* Show both saved and pending images */}
          {[...images, ...pendingImages].map((image, index) => (
            <div key={image.id || index} className="relative">
              <img
                src={image.imageData}
                alt={`Preview ${index + 1}`}
                className="w-full h-[150px] object-cover rounded-lg"
              />
              <button
                className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white/90 rounded-full"
                onClick={() =>
                  image.id
                    ? handleRemoveImage(image.id)
                    : setPendingImages((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                }
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

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={pendingImages.length === 0}
          className={`px-4 py-2 rounded-md ${
            pendingImages.length === 0
              ? "px-4 py-2 rounded-xl bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-blue-600/30 backdrop-blur-xl shadow-xl border border-white/30 opacity-50 cursor-not-allowed"
              : "px-4 py-2 rounded-xl bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-blue-600/30 backdrop-blur-xl shadow-xl border border-white/30"
          }`}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default DeviceImageEditHardwareReplacement;
