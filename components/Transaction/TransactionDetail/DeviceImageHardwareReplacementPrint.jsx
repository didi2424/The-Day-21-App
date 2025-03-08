import Image from 'next/image';

const DeviceImageHardwareReplacementPrint = ({ transaction, images }) => {
  const getImageSrc = (imageData) => {
    const base64Data = imageData.replace('data:image/jpeg;base64,', '');
    return `data:image/jpeg;base64,${base64Data}`;
  };

  return (
    <div className="min-h-[297mm] w-[210mm] mx-auto bg-white p-8">
      {/* Header Section */}
      <div className="border-b-2 border-gray-200 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Replaced Hardware Documentation
              </h1>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-gray-600">
                <div>
                  <p className="text-sm font-semibold">Customer Name</p>
                  <p className="text-sm">{transaction.customer?.constumer_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Phone Number</p>
                  <p className="text-sm">{transaction.customer?.wa_number  || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Device</p>
                  <p className="text-sm">{transaction.deviceModel || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Problem</p>
                  <p className="text-sm">{transaction.problemDescription  || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800">The Day 21 Group</h2>
            <p className="text-sm text-gray-600">Service | Repair | Cleaning VGA/GPU</p>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 gap-4">
        {images?.map((image, index) => (
          <div key={index} className="border rounded-lg p-2">
            <img
              src={getImageSrc(image.imageData)}
              alt={`Hardware Image ${index + 1}`}
              className="w-full h-auto object-contain"
              style={{ maxHeight: '120mm' }}
            />
            <p className="text-center mt-2 text-sm text-gray-600">Image {index + 1}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
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

export default DeviceImageHardwareReplacementPrint;
