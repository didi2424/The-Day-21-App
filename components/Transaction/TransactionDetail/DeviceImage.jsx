import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';
import { MdFullscreen, MdClose } from 'react-icons/md';
import DeviceImageHardwareReplacement from './DeviceImageHardwareReplacement';
import DeviceImagePrint from './DeviceImagePrint';


const FullscreenModal = ({ imageUrl, onClose, onNext, onPrev, totalImages, currentIndex }) => (
  <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
    <div className="relative w-full h-full">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={onClose}
          className="p-2 bg-black/50 rounded-full text-white hover:bg-black/75"
        >
          <MdClose size={24} />
        </button>
      </div>

      <button
        onClick={onPrev}
        className="absolute left-8 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full text-white hover:bg-black/75 z-20"
      >
        <span className="text-2xl">←</span>
      </button>
      
      <button
        onClick={onNext}
        className="absolute right-8 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full text-white hover:bg-black/75 z-20"
      >
        <span className="text-2xl">→</span>
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full z-20">
        {currentIndex + 1} / {totalImages}
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-12">
        <div className="relative w-auto h-auto max-w-[85vw] max-h-[85vh]">
          <Image
            src={imageUrl}
            alt="Fullscreen view"
            width={1920}
            height={1080}
            className="object-contain w-auto h-auto max-w-full max-h-full"
            quality={100}
            priority
          />
        </div>
      </div>
    </div>
  </div>
);

const DeviceImage = ({ transaction, setCurrentStep }) => {
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [customerData, setCustomerData] = useState(null);
  const [deviceData, setDeviceData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customer data
        const customerResponse = await fetch(`/api/customers/${transaction.customerId}`);
        const customerData = await customerResponse.json();
        setCustomerData(customerData);

        // Fetch device data
        const deviceResponse = await fetch(`/api/devices/${transaction.deviceId}`);
        const deviceData = await deviceResponse.json();
        setDeviceData(deviceData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (transaction?.customerId && transaction?.deviceId) {
      fetchData();
    }
  }, [transaction]);

  const getAllImages = (transaction) => {
    if (!transaction) return [];
    const images = [];
    if (transaction.images?.main) {
      images.push(transaction.images.main.imageData);
    }
    if (transaction.images?.additional) {
      images.push(...transaction.images.additional.map(img => img.imageData));
    }
    return images;
  };

  const openFullscreen = (imageUrl) => {
    const allImages = getAllImages(transaction);
    const index = allImages.indexOf(imageUrl);
    setCurrentImageIndex(index);
    setFullscreenImage(imageUrl);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
    document.body.style.overflow = 'auto';
  };

  const handlePrevImage = () => {
    const allImages = getAllImages(transaction);
    setCurrentImageIndex((prev) => {
      const newIndex = prev - 1 < 0 ? allImages.length - 1 : prev - 1;
      setFullscreenImage(allImages[newIndex]);
      return newIndex;
    });
  };

  const handleNextImage = () => {
    const allImages = getAllImages(transaction);
    setCurrentImageIndex((prev) => {
      const newIndex = prev + 1 >= allImages.length ? 0 : prev + 1;
      setFullscreenImage(allImages[newIndex]);
      return newIndex;
    });
  };

  const handleNextClick = () => {
    console.log('Next button clicked, changing to step 3');
    setCurrentStep(3);
  };

  const handlePrint = (transaction) => {
    const printTab = window.open('', '_blank');
    if (!printTab) {
      alert('Please allow popups for this website');
      return;
    }

    const printContent = document.getElementById('print-hardware')?.innerHTML;
    if (!printContent) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hardware Images - ${transaction._id}</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            body { 
              margin: 0;
              background: white;
            }
            .print-container {
              width: 210mm;
              min-height: 297mm;
              margin: 0 auto;
              background: white;
              padding: 20mm;
            }
            .print-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10mm;
            }
            .print-grid img {
              max-width: 100%;
              height: auto;
              max-height: 100mm;
              object-fit: contain;
            }
            @media print {
              @page {
                size: A4;
                margin: 0;
              }
              body {
                margin: 0;
              }
              .print-container {
                width: 210mm;
                min-height: 297mm;
                padding: 20mm;
                margin: 0;
              }
              #print-button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <button 
              id="print-button"
              onclick="window.print()"
              style="margin-bottom: 20px; padding: 8px 16px; background: #b9ec8f; border: none; border-radius: 4px; cursor: pointer;"
            >
              Print Images
            </button>
            ${printContent}
          </div>
          <script>
            window.onload = () => {
              const images = document.getElementsByTagName('img');
              let loadedImages = 0;
              for(let img of images) {
                if(img.complete) {
                  loadedImages++;
                } else {
                  img.addEventListener('load', () => {
                    loadedImages++;
                    if(loadedImages === images.length) {
                      // All images loaded
                      document.fonts.ready.then(() => {
                        // Fonts loaded too
                        if(!window.chrome) window.print();
                      });
                    }
                  });
                }
              }
              if(loadedImages === images.length) {
                document.fonts.ready.then(() => {
                  if(!window.chrome) window.print();
                });
              }
            };
            window.onafterprint = () => window.close();
          </script>
        </body>
      </html>
    `;

    printTab.document.open();
    printTab.document.write(html);
    printTab.document.close();
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Device Images</h2>
        
        <div className="flex gap-6">
          {/* Original Device Images Section */}
          <div className="flex-1 space-y-6">
            {transaction.images?.main && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-700">Main Image</h4>
                <div className="relative aspect-square w-[250px] rounded-lg overflow-hidden group">
                  <Image 
                    src={transaction.images.main.imageData}
                    alt="Main device"
                    fill
                    className="rounded-lg transition-transform group-hover:scale-105 object-cover"
                  />
                  <button
                    onClick={() => openFullscreen(transaction.images.main.imageData)}
                    className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MdFullscreen size={24} />
                  </button>
                </div>
              </div>
            )}

            {transaction.images?.additional?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-700">Additional Images</h4>
                <div className="grid grid-cols-4 gap-4 w-[400px]">
                  {transaction.images.additional.map((img, index) => (
                    <div key={index} className="relative aspect-square">
                      <div className="w-full h-full rounded-lg overflow-hidden group">
                        <Image
                          src={img.imageData}
                          alt={`Additional ${index + 1}`}
                          fill
                          className="rounded-lg transition-transform group-hover:scale-105 object-cover"
                        />
                        <button
                          onClick={() => openFullscreen(img.imageData)}
                          className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MdFullscreen size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Print Button */}
            <button
              onClick={() => handlePrint(transaction)}
              className="px-4 py-2 bg-[#b9ec8f] text-black rounded-md hover:bg-[#a5d880]"
            >
              Print Images
            </button>
          </div>

          {/* Hardware Replacement Images Section */}
          <div className="flex-1">
            <h3 className="text-sm font-medium mb-2 text-gray-700">Hardware Replacement Images</h3>
            <DeviceImageHardwareReplacement transactionId={transaction._id} />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={() => setCurrentStep(1)}
            className="px-4 py-2 bg-[#b9ec8f] text-black rounded-md hover:bg-[#a5d880]"
          >
            Back
          </button>
          <button
            onClick={handleNextClick}
            className="px-4 py-2 bg-[#b9ec8f] text-black rounded-md hover:bg-[#a5d880]"
          >
            Next
          </button>
        </div>
      </div>

       {/* Hidden Print Template */}
       <div id="print-hardware" className="hidden">
        <DeviceImagePrint 
          transaction={{
            ...transaction,
            customerData,
            deviceData
          }}
        />
      </div>

      {fullscreenImage && (
        <FullscreenModal
          imageUrl={fullscreenImage}
          onClose={closeFullscreen}
          onNext={handleNextImage}
          onPrev={handlePrevImage}
          totalImages={getAllImages(transaction).length}
          currentIndex={currentImageIndex}
        />
      )}
    </div>
  );
};

export default DeviceImage;
