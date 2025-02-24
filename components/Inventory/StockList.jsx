import { useState, useEffect } from "react";
import EditModal from "./EditModal";
const StockList = () => {
  const [inventory, setInventory] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);

  const [pageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchInventory(currentPage, pageSize);
    fetchImages();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const fetchImages = async (itemIds = []) => {
    try {
      const response = await fetch(`/api/inventory/getimages?items=${itemIds.join(",")}`);
      if (!response.ok) {
        throw new Error("Gagal mengambil gambar.");
      }
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
      setError(error.message);
    }
  };

  const fetchInventory = async (page = 1, limit = 5) => {
    try {
      const response = await fetch(`/api/inventory?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch inventory");
      }
      const data = await response.json();
      setInventory(data.inventory || []);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getImagesForItem = (imageNames) => {
    if (!imageNames) return [];
    const imageArray = Array.isArray(imageNames) ? imageNames : [imageNames];
    return images
      .flatMap((img) => img.images)
      .filter((img) => imageArray.includes(img.imageName));
  };

  const handleEdit = (item) => {
    setSelectedInventory(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInventory(null);
  };

useEffect(() => {
  if (inventory && Array.isArray(inventory) && inventory.length > 0) {
    const itemIds = inventory.map((item) => item.id || item._id);
    fetchImages(itemIds);
  }
}, [inventory]);

const refreshData = async () => {
  await fetchInventory(currentPage, pageSize); // Tunggu hingga inventory diperbarui
  if (inventory.length > 0) {
    const itemIds = inventory.map((item) => item.id || item._id);
    fetchImages(itemIds); // Fetch images berdasarkan inventory terbaru
  }
};

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Stock List</h2>
      </div>
      {inventory.length > 0 ? (
        <ul>
          {inventory.map((item) => {
            const matchedImages = getImagesForItem(item.imagesnames);

            return (
              <li key={item.id || item._id} className="mb-4">
                <div className="p-4 shadow-md rounded-lg border bg-white">
                  <div className="grid grid-cols-8 gap-4 items-center">
                    <div>
                      <div className="font-bold text-lg">{item.name}</div>
                      <div className="text-gray-500">
                        Price: Rp. {new Intl.NumberFormat("id-ID").format(item.price)},-
                      </div>
                    </div>
                    <div>Stock: {item.stock}</div>
                    <div>
                      <div>Storage: {item.stroage}</div>
                      <div>Row Column: R{item.row} C{item.column}</div>
                    </div>
                    <div>
                      <div>{item.manufacture}</div>
                      <div className="text-gray-500">Category: {item.category}</div>
                    </div>
                    <div>
                      <div>SKU: {item.sku}</div>
                      <div className="text-gray-500">Condition: {item.condition}</div>
                    </div>
                    <div className="flex gap-5">
                      <button className="text-white font-bold text-sm bg-black rounded-md py-1 px-3">
                        Description
                      </button>
                      <button onClick={() => handleEdit(item)} className="text-white font-bold text-sm bg-green-500 hover:bg-green-600 rounded-md py-1 px-3 transition-colors">
                        Edit
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      {matchedImages.length > 0 ? (
                        matchedImages.map((img, index) => (
                          <div key={`${item._id}-${index}`} className="relative">
                            <img src={img.imageData} alt={img.imageName || "No Image"} className="w-20 h-20 object-cover rounded-md" />
                          </div>
                        ))
                      ) : (
                        <div className="w-20 h-20 bg-gray-300 rounded-md flex items-center justify-center">
                          <span className="text-xs text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500">No inventory items available</p>
      )}
      {isModalOpen && (
        <EditModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          selectedInventory={selectedInventory}
          refreshData={refreshData}
        />
      )}
      <div className="flex justify-center mt-4 gap-4">
        <button className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50" onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <span className="font-semibold">Page {currentPage} of {totalPages}</span>
        <button className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50" onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default StockList;
