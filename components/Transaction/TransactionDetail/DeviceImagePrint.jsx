import Image from 'next/image';

const DeviceImagePrint = ({ transaction }) => {
  const getAllImages = () => {
    if (!transaction) return [];
    const images = [];
    if (transaction.images?.main) {
      images.push({
        url: transaction.images.main.imageData,
        label: 'Main Image'
      });
    }
    if (transaction.images?.additional) {
      images.push(...transaction.images.additional.map((img, idx) => ({
        url: img.imageData,
        label: `Additional Image ${idx + 1}`
      })));
    }
    return images;
  };

  const images = getAllImages();
  
  return (
    <div className="min-h-[297mm] w-[210mm] mx-auto bg-white">
      {/* Header Section */}
      <div className="border-b-2 border-gray-200 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Hardware Documentation
              </h1>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-gray-600">
                <div>
                  <p className="text-sm font-semibold">Customer Name</p>
                  <p className="text-sm">{transaction.customer?.constumer_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Phone Number</p>
                  <p className="text-sm">{transaction.customer?.wa_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Device</p>
                  <p className="text-sm">{transaction.deviceModel || 'N/A'}</p>
                </div>
               
                <div>
                  <p className="text-sm font-semibold">Problem Description</p>
                  <p className="text-sm">{transaction.problemDescription || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Transaction ID</p>
                  <p className="font-mono text-xs">{transaction._id}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Print Date</p>
                  <p className="text-sm">{new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Total Images</p>
                  <p className="text-sm">{images.length} photos</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800">The Day 21 Group</h2>
            <p className="text-sm text-gray-600">Service | Repair | Cleaning VGA/GPU 🖥️</p>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 gap-6 auto-rows-max">
        {images.map((image, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-lg">
            <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-sm">
              <img
                src={image.url}
                alt={image.label}
                className="w-full h-full object-contain bg-white"
              />
            </div>
            <div className="mt-2">
              <p className="font-medium text-sm text-gray-800">{image.label}</p>
              <p className="text-xs text-gray-500">Photo {index + 1} of {images.length}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-xs text-gray-600">
          <div>
            <p className="font-medium">The Day 21 App Documentation</p>
            <p>Generated: {new Date().toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">Supercharging Happiness for Gamers & Creators</p>
            <p>© {new Date().getFullYear()} The Day 21 Group</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceImagePrint;
