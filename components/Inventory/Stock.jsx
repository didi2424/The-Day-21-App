import { useState, useEffect } from "react";
import EditModal from "./EditModal";

const Stock = () => {
  const [inventory, setInventory] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false); // To toggle the modal visibility
  const [selectedInventory, setSelectedInventory] = useState(null);

  const handleEdit = (item) => {
    setSelectedInventory(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInventory(null);
  };

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/inventory/getimages");
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

  const fetchInventory = async () => {
    try {
      const response = await fetch("/api/inventory");
      if (!response.ok) {
        throw new Error("Failed to fetch inventory");
      }
      const data = await response.json();
      setInventory(data.inventory || []);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
    fetchInventory();
  }, []);

  const refreshData = () => {
    fetchInventory();
    fetchImages();
  };

  const getImagesForItem = (imageNames) => {
    if (!imageNames) return [];
    const imageArray = Array.isArray(imageNames) ? imageNames : [imageNames];
    const matchedImages = images
      .flatMap((img) => img.images)
      .filter((img) => imageArray.includes(img.imageName));

    return matchedImages;
  };

  return (
    <div>
      <div className="flex flex-1 justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">Stock List</h2>
      </div>
      {inventory.length > 0 ? (
        <ul>
          {inventory.map((item) => {
            const matchedImages = getImagesForItem(item.imagesnames);

            return (
              <li key={item.id || item._id} className="mb-2">
                <div className="p-4 shadow-sm rounded-md border">
                  <div className="grid grid-cols-8 gap-2 items-center ">
                    {/* Nama */}

                    <div>
                      <div className="font-bold text-lg">{item.name}</div>
                      <div>
                        Price: Rp.
                        {new Intl.NumberFormat("id-ID").format(item.price)},-
                      </div>
                    </div>

                    {/* Stok */}
                    <div>Stock: {item.stock}</div>

                    {/* Penyimpanan & Lokasi */}
                    <div>
                      <div>Stroage: {item.stroage}</div>
                      <div>
                        Row Column: R{item.row} C{item.column}
                      </div>
                    </div>

                    {/* Manufaktur & Kategori */}
                    <div>
                      <div>{item.manufacture}</div>
                      <div>Category: {item.category}</div>
                    </div>

                    {/* Manufaktur & Kategori */}
                    <div>
                      <div>SKU: {item.sku}</div>
                      <div>Condition: {item.condition}</div>
                    </div>

                    <div className="flex gap-5">
                      <button className="text-white font-bold text-sm border bg-black rounded-md pt-1 pb-1 pl-2 pr-2">
                        Description
                      </button>

                      <button
                        onClick={() => handleEdit(item)}
                        className="text-white font-bold text-sm border bg-green-400 rounded-md pt-1 pb-1 pl-2 pr-2"
                      >
                        Edit
                      </button>
                    </div>

                    {/* Gambar */}
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
                              className="w-20 h-20 object-cover rounded-md"
                            />
                            {!img.imageName && (
                              <p className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 bg-white bg-opacity-70 rounded-md">
                                No Image
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="w-20 h-20 bg-gray-300 rounded-md flex items-center justify-center">
                          <span className="text-xs text-gray-500">
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
    </div>
  );
};

export default Stock;
