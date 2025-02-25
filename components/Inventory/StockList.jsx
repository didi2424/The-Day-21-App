import { useState, useEffect, useCallback } from "react";
import EditModal from "./EditModal";
import { MdPersonSearch, MdOutlineTimelapse, MdClose } from "react-icons/md"; // Tambah MdClose
import { useRouter } from 'next/navigation';

const StockList = () => {
  const [inventory, setInventory] = useState([]);
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);

  const [pageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const router = useRouter();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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
      const response = await fetch(`/api/inventory/getimages/allimage/?items=${itemIds.join(",")}`);
      if (!response.ok) {
        throw new Error("Gagal mengambil gambar.");
      }
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchInventory = useCallback(async (page = 1, limit = 5, searchTerm = "") => {
    try {
      setIsSearching(!!searchTerm);
      const queryParams = new URLSearchParams({
        page: page,
        limit: limit,
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/inventory?${queryParams}`);
      if (!response.ok) throw new Error("Failed to fetch inventory");
      
      const data = await response.json();
      setInventory(data.inventory || []);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setIsSearching(false);

    }
  }, []);

  useEffect(() => {
    fetchInventory(currentPage, pageSize, debouncedSearchTerm);
  }, [debouncedSearchTerm, currentPage, pageSize, fetchInventory]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Tambahkan fungsi untuk clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
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

const handleViewDetails = (itemId) => {
  router.push(`/inventory/details/${itemId}`);
};

  return (
    <div className="flex flex-col h-full">
      <div className="h-[50px] flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Stock List</h2>
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by name, SKU, or category..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 p-1 rounded-full"
            >
              <MdClose className="text-gray-500 text-xl hover:text-gray-700" />
            </button>
          )}
          {isSearching ? (
            <MdOutlineTimelapse className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"/>
          ) : (
            <MdPersonSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"/>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto pb-4">
        {inventory.length > 0 ? (
          <ul>
            {inventory.map((item) => {
              const matchedImages = getImagesForItem(item.imagesnames);

              return (
                <li key={item.id || item._id} className="mb-4">
                  <div className="pb-2 pt-2 pl-6 pr-6 shadow-sm rounded-lg  bg-white">
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
                        <button 
                          onClick={() => handleViewDetails(item._id)}
                          className="text-white font-bold text-sm bg-black rounded-md py-1 px-3 hover:bg-gray-800 transition-colors"
                        >
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
          <div className="flex justify-between mt-4">
          <p className="mt-2 text-sm">Page {currentPage} of {totalPages}</p>
          <div className='gap-4 flex'>
            <button onClick={handlePrevPage} disabled={currentPage === 1} className={`next_btn ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-[b9ec8f]'}`}>
              Back
            </button>
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className={`next_btn ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'hover:bg-[b9ec8f]'}`}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockList;
