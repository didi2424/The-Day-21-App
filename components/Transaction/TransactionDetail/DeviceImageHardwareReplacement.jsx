'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';

const DeviceImageHardwareReplacement = ({ transactionId }) => {
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`/api/transaction/images/replacehardware?transactionId=${transactionId}`);
        const data = await response.json();
        console.log('Fetched images:', data); // Debug log
        setImages(data);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    if (transactionId) {
      fetchImage();
    }
  }, [transactionId]);

  const getImageSrc = (imageData) => {
    // Remove the prefix if it exists in the imageData
    const base64Data = imageData.replace('data:image/jpeg;base64,', '');
    return `data:image/jpeg;base64,${base64Data}`;
  };

  const getGridClass = (totalImages) => {
    switch(totalImages) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-3';
      default:
        return 'grid-cols-1';
    }
  };

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction) => {
    if (direction === 'next') {
      setSelectedImageIndex((prev) => 
        prev === images.length - 1 ? 0 : prev + 1
      );
    } else {
      setSelectedImageIndex((prev) => 
        prev === 0 ? images.length - 1 : prev - 1
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') navigateImage('next');
    if (e.key === 'ArrowLeft') navigateImage('prev');
    if (e.key === 'Escape') closeModal();
  };

  return (
    <>
      <div className="w-full">
        <div className={`grid ${getGridClass(images.length)} gap-3`}>
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <div 
                key={image._id} 
                className="relative h-[200px] border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => openModal(index)}
              >
                {image.imageData ? (
                  <>
                    <Image
                      src={getImageSrc(image.imageData)}
                      alt="Hardware replacement image"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      priority
                    />
                   
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    No image data
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg text-gray-500">
              No hardware replacement images available
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && images.length > 0 && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
              onClick={closeModal}
            >
              <IoClose size={30} />
            </button>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 p-2 text-white hover:text-gray-300 transition-colors"
                  onClick={() => navigateImage('prev')}
                >
                  <MdNavigateBefore size={40} />
                </button>
                <button
                  className="absolute right-4 p-2 text-white hover:text-gray-300 transition-colors"
                  onClick={() => navigateImage('next')}
                >
                  <MdNavigateNext size={40} />
                </button>
              </>
            )}

            {/* Main image */}
            <div className="relative w-full max-w-5xl aspect-[4/3] mx-auto">
              <Image
                src={getImageSrc(images[selectedImageIndex].imageData)}
                alt={`Hardware replacement image ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
                priority
                quality={100}
              />
            </div>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white px-4 py-2 bg-black/50 rounded-full text-sm">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeviceImageHardwareReplacement;
