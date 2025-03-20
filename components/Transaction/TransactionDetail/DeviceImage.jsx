import { useState, useEffect } from "react";
import Image from "next/image";
import { MdFullscreen, MdClose } from "react-icons/md";
import DeviceImageHardwareReplacement from "./DeviceImageHardwareReplacement";
import DeviceImagePrint from "./DeviceImagePrint";

const FullscreenModal = ({
  imageUrl,
  onClose,
  onNext,
  onPrev,
  totalImages,
  currentIndex,
}) => (
  <div className="fixed inset-0 w-screen h-screen bg-black/90 z-[9999] flex items-center justify-center overflow-hidden">
    <div className="fixed inset-0 w-full h-full">
      <div className="absolute top-4 right-4 z-[9999] flex gap-2">
        <button
          onClick={onClose}
          className="p-2 bg-black/50 rounded-full text-white hover:bg-black/75"
        >
          <MdClose size={24} />
        </button>
      </div>

      <button
        onClick={onPrev}
        className="absolute left-8 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full text-white hover:bg-black/75 z-[9999]"
      >
        <span className="text-2xl">←</span>
      </button>

      <button
        onClick={onNext}
        className="absolute right-8 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full text-white hover:bg-black/75 z-[9999]"
      >
        <span className="text-2xl">→</span>
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full z-[9999]">
        {currentIndex + 1} / {totalImages}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-screen h-screen flex items-center justify-center p-8">
          <Image
            src={imageUrl}
            alt="Fullscreen view"
            width={1920}
            height={1080}
            className="object-contain max-w-full max-h-full w-auto h-auto"
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
        const customerResponse = await fetch(
          `/api/customers/${transaction.customerId}`
        );
        const customerData = await customerResponse.json();
        setCustomerData(customerData);

        // Fetch device data
        const deviceResponse = await fetch(
          `/api/devices/${transaction.deviceId}`
        );
        const deviceData = await deviceResponse.json();
        setDeviceData(deviceData);
      } catch (error) {
        console.error("Error fetching data:", error);
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
      images.push(...transaction.images.additional.map((img) => img.imageData));
    }
    return images;
  };

  const openFullscreen = (imageUrl) => {
    const allImages = getAllImages(transaction);
    const index = allImages.indexOf(imageUrl);
    setCurrentImageIndex(index);
    setFullscreenImage(imageUrl);
    document.body.style.overflow = "hidden";
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
    document.body.style.overflow = "auto";
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

  const handlePrint = (transaction) => {
    const printContent = document.getElementById("print-hardware")?.innerHTML;
    if (!printContent) return;
  
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Transaction_${transaction._id}</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            body { margin: 0; background: white; }
            .print-container { width: 210mm; min-height: 297mm; margin: 0 auto; background: white; padding: 20mm; }
            .print-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10mm; }
            .print-grid img { max-width: 100%; height: auto; max-height: 100mm; object-fit: contain; }
            @media print {
              @page { size: A4; margin: 0; }
              body { margin: 0; }
              .print-container { width: 210mm; min-height: 297mm; padding: 20mm; margin: 0; }
              #print-button { display: none; }
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
              document.title = "Transaction ${transaction?.serviceNumber} - ${transaction.customer?.constumer_name} ${transaction.deviceModel}"; 
              const images = document.getElementsByTagName('img');
              let loadedImages = 0;
              for(let img of images) {
                if(img.complete) {
                  loadedImages++;
                } else {
                  img.addEventListener('load', () => {
                    loadedImages++;
                    if(loadedImages === images.length) {
                      document.fonts.ready.then(() => {
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
  
    // Buat Blob dari HTML agar bisa dibuka sebagai file baru
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
  
    // Buka tab baru dengan URL Blob
    const printTab = window.open(url, "_blank");
  
    if (printTab) {
      // Tunggu sampai tab baru selesai dimuat
      printTab.onload = () => {
        printTab.document.title = `Transaction_${transaction._id}`;
        printTab.print();
  
        // Hapus URL Blob setelah dipakai
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      };
    } else {
      alert("Popup diblokir! Izinkan pop-up untuk mencetak dokumen.");
    }
  };
  return (
    <div className="h-[540px]">
      <div className=" p-6 rounded-lg  ">
        <div className="flex gap-6 ">
          {/* Original Device Images Section */}
          <div className="flex-1 space-y-6">
            {transaction.images?.main && (
              <div className="">
                <h4 className="text-sm font-medium mb-2 text-white">
                  Main Image
                </h4>
                <div className="relative aspect-square w-[250px] rounded-lg overflow-hidden group">
                  <Image
                    src={transaction.images.main.imageData}
                    alt="Main device"
                    fill
                    className="rounded-lg transition-transform group-hover:scale-105 object-cover"
                  />
                  <button
                    onClick={() =>
                      openFullscreen(transaction.images.main.imageData)
                    }
                    className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MdFullscreen size={24} />
                  </button>
                </div>
              </div>
            )}

            {transaction.images?.additional?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-white">
                  Additional Images
                </h4>
                <div className="grid grid-cols-4 gap-4 w-[300px]">
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

            <button
              onClick={() => handlePrint(transaction)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl
                         hover:opacity-90 transition-all duration-300 shadow-lg"
            >
              Print Device
            </button>
          </div>

          {/* Hardware Replacement Images Section */}
          <div className="flex-1 h-[460px] flex flex-col">
            <h3 className="text-sm font-medium mb-2 text-white">
              Hardware Replacement Images
            </h3>
            <div className="flex-grow">
              <DeviceImageHardwareReplacement transactionId={transaction._id} />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Print Template */}
      <div id="print-hardware" className="hidden">
        <DeviceImagePrint
          transaction={{
            ...transaction,
            customerData,
            deviceData,
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
