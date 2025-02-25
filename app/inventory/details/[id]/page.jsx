'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdArrowBack } from 'react-icons/md';
import React from 'react';
import { fetchImagesByNames } from '@utils/api/images';

const InventoryDetails = ({ params }) => {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  
  const [item, setItem] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`/api/inventory/${id}`);
        if (!response.ok) throw new Error('Failed to fetch item');
        const data = await response.json();
        setItem(data);
        
        if (data.imagesnames && data.imagesnames.length > 0) {
          const fetchedImages = await fetchImagesByNames(data.imagesnames);
          console.log('Fetched images:', fetchedImages);
          setImages({ images: fetchedImages }); // Match the expected structure
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleBack = () => {
    // Navigate back to dashboard inventory with stock list active
    router.push('/dashboard/inventory?view=stock');
  };

  if (loading) return (
    <div className="h-screen w-screen bg-gray-900 text-gray-100">
      <div className="animate-pulse text-gray-400">Loading...</div>
    </div>
  );
  
  if (!item) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-gray-400">Item not found</div>
    </div>
  );

  return (
    <div className="h-screen w-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="p-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <MdArrowBack size={24} />
          <span>Back to Stock List</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 p-4">
        {/* Left Column - Images */}
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
            {images && images.images && images.images[selectedImageIndex] ? (
              <img
                src={images.images[selectedImageIndex].imageData}
                alt={item.name}
                className="w-full h-[500px] object-contain rounded-lg transition-all duration-300"
              />
            ) : (
              <div className="w-full h-[500px] bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No Image Available</span>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            {images?.images?.map((img, index) => (
              <div 
                key={index} 
                onClick={() => handleImageClick(index)}
                className={`w-24 h-24 bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all cursor-pointer
                  ${selectedImageIndex === index 
                    ? 'ring-2 ring-blue-500 scale-105' 
                    : 'hover:ring-2 ring-blue-500/50 hover:scale-105'
                  }`}
              >
                <img
                  src={img.imageData}
                  alt={`${item.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h1 className="text-4xl font-bold mb-4">{item.name}</h1>
            <p className="text-3xl font-bold text-green-400 mb-6">
              Rp. {new Intl.NumberFormat("id-ID").format(item.price)},-
            </p>

            <div className="grid grid-cols-2 gap-6">
              <InfoCard title="Manufacturing" value={item.manufacture} />
              <InfoCard title="Category" value={item.category} />
              <InfoCard title="Stock" value={`${item.stock} units`} />
              <InfoCard title="SKU" value={item.sku} />
              <InfoCard title="Condition" value={item.condition} />
              <InfoCard title="Package Type" value={item.packagetype} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Storage Location</h2>
            <p className="text-gray-400">
              {item.stroage} - Row {item.row}, Column {item.column}
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-400 whitespace-pre-line leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Info Card Component
const InfoCard = ({ title, value }) => (
  <div className="bg-gray-700/50 rounded-xl p-4">
    <p className="text-sm text-gray-400 mb-1">{title}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default InventoryDetails;
