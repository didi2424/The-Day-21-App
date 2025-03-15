import { useState, useEffect, useCallback } from "react";
import EditModal from "./EditModal";
import { MdPersonSearch, MdOutlineTimelapse, MdClose } from "react-icons/md"; // Tambah MdClose
import { useRouter } from "next/navigation";

const StockList = () => {
  const [inventory, setInventory] = useState([]);
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);

  const [pageSize] = useState(4);
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

  const refreshData = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: pageSize,
        ...(debouncedSearchTerm && { 
          search: debouncedSearchTerm,
          searchFields: 'name,sku,marking,category'  // Add marking to search fields
        }),
      });

      const response = await fetch(`/api/inventory?${queryParams}`);
      if (!response.ok) throw new Error("Failed to fetch inventory");
      const data = await response.json();
      
      setInventory(data.inventory || []);
      setTotalPages(data.totalPages);

      if (data.inventory?.length > 0) {
        const itemIds = data.inventory.map(item => item._id);
        const imageResponse = await fetch(
          `/api/inventory/getimages/allimage/?items=${itemIds.join(",")}`
        );
        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          setImages(imageData);
        }
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const handleViewDetails = (itemId) => {
    router.push(`/inventory/details/${itemId}`);
  };

  // Hapus useEffect yang terpisah untuk fetchInventory dan fetchImages
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsSearching(true);
        
        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: pageSize,
          ...(debouncedSearchTerm && { 
            search: debouncedSearchTerm,
            searchFields: 'name,sku,marking,category'  // Add marking to search fields
          }),
        });

        const response = await fetch(`/api/inventory?${queryParams}`);
        if (!response.ok) throw new Error("Failed to fetch inventory");
        const data = await response.json();
        
        // Reset data lama sebelum mengisi data baru
        setInventory([]);
        setImages([]);
        
        // Set data baru
        setInventory(data.inventory || []);
        setTotalPages(data.totalPages);

        // Fetch images hanya jika ada inventory baru
        if (data.inventory?.length > 0) {
          const itemIds = data.inventory.map(item => item._id);
          const imageResponse = await fetch(
            `/api/inventory/getimages/allimage/?items=${itemIds.join(",")}`
          );
          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            setImages(imageData);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsSearching(false);
      }
    };

    loadData();
  }, [currentPage, pageSize, debouncedSearchTerm]);

  return (
    <div className="bg-gray-900 rounded-xl p-4 text-gray-100">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-800/20 to-pink-900/20" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[700px] h-[700px] bg-pink-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Stock List</h2>
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by name, SKU, marking, or category..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 
                  focus:outline-none backdrop-blur-xl"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 hover:bg-gray-700/50 p-1 rounded-full"
            >
              <MdClose className="text-gray-400 text-xl hover:text-gray-200" />
            </button>
          )}
          {isSearching ? (
            <MdOutlineTimelapse className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          ) : (
            <MdPersonSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto pb-4">
        {inventory.length > 0 ? (
          <ul className="space-y-4">
            {inventory.map((item) => {
              const matchedImages = getImagesForItem(item.imagesnames);

              return (
                <li key={item.id || item._id}>
                  <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-4 hover:bg-gray-800/60 transition-colors">
                    <div className="grid grid-cols-9 gap-4 items-center">
                      <div>
                        <div className="font-bold text-lg text-blue-400">
                          {item.name}
                        </div>
                        <div className="text-gray-400">
                          Price: Rp.{" "}
                          {new Intl.NumberFormat("id-ID").format(item.price)},-
                        </div>
                      </div>
                      <div className="text-gray-300">Stock: {item.stock}</div>
                      <div className="text-gray-300">
                        <div>Storage: {item.stroage}</div>
                        <div>
                          Row Column: R{item.row} C{item.column}
                        </div>
                      </div>

                      <div className="text-gray-300">
                        <div>Marking</div>
                        <div>
                          {item.marking} 
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-300">{item.manufacture}</div>
                        <div className="text-gray-400">
                          Category: {item.category}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-300">SKU: {item.sku}</div>
                        <div className="text-gray-400">
                          Condition: {item.condition}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleViewDetails(item._id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Description
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="flex space-x-2">
                        {matchedImages.length > 0 ? (
                          matchedImages.map((img, index) => (
                            <div
                              key={`${item._id}-${index}`}
                              className="relative"
                            >
                              <img
                                src={img.imageData}
                                alt={img.imageName || "No Image"}
                                className="w-20 h-20 object-cover rounded-lg border border-gray-700"
                              />
                            </div>
                          ))
                        ) : (
                          <div className="w-20 h-20 bg-gray-700/50 rounded-lg flex items-center justify-center border border-gray-600">
                            <span className="text-xs text-gray-400">
                              No Image
                            </span>
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
          <p className="text-gray-400 text-center py-8">
            No inventory items available
          </p>
        )}

        <div className="flex justify-between mt-6">
          <p className="text-gray-400 text-sm">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-3">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg text-sm ${
                currentPage === 1
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg text-sm ${
                currentPage === totalPages
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <EditModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          selectedInventory={selectedInventory}
          refreshData={refreshData}
        />
      )}
    </div>
  );
};

export default StockList;
