import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditModal = ({
  isModalOpen,
  closeModal,
  selectedInventory,
  refreshData,
}) => {
  if (!isModalOpen) return null; // Jangan render modal jika tidak terbuka
  const [images, setImages] = useState([]); // State untuk menyimpan gambar
  const [mainImage, setMainImage] = useState(null); // Gambar utama besar

  const fetchImagesByNames = async (imagesnames) => {
    if (!Array.isArray(imagesnames) || imagesnames.length === 0) {
      console.error("Invalid imagesnames format:", imagesnames);
      return [];
    }
    try {
      const queryParams = imagesnames
        .map((name) => `names=${encodeURIComponent(name)}`)
        .join("&");
      const response = await fetch(
        `/api/inventory/getimages/imagesbyname?${queryParams}`
      );

      if (!response.ok) throw new Error("Failed to fetch images");
      const data = await response.json();
      const extractedImages = data.flatMap((item) =>
        item.images.map((img) => ({
          imageName: img.imageName,
          imageData: img.imageData,
        }))
      );
      return extractedImages;
    } catch (error) {
      return [];
    }
  };

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    price: "",
    manufacture: "",
    category: "",
    subcategory: "",
    stroage: "",
    condition: "",
    marking: "",
    packagetype: "",
    row: "",
    column: "",
    description: "",
    sku: "",
    imagesnames: [],
  });

  useEffect(() => {
    if (selectedInventory && Object.keys(selectedInventory).length > 0) {
      setFormData({
        _id: selectedInventory._id || "",
        name: selectedInventory.name || "",
        price: selectedInventory.price || "",
        manufacture: selectedInventory.manufacture || "",
        category: selectedInventory.category || "",
        subcategory: selectedInventory.subcategory || "",
        stroage: selectedInventory.stroage || "",
        condition: selectedInventory.condition || "",
        marking: selectedInventory.marking || "",
        packagetype: selectedInventory.packagetype || "",
        row: selectedInventory.row || "",
        column: selectedInventory.column || "",
        description: selectedInventory.description || "",
        sku: selectedInventory.sku || "",
        imagesnames: Array.isArray(selectedInventory.imagesnames)
          ? selectedInventory.imagesnames
          : [],
      });
    }
  }, [selectedInventory]);

  useEffect(() => {
    if (selectedInventory?.imagesnames?.length > 0) {
      fetchImagesByNames(selectedInventory.imagesnames).then((fetchedImages) => {
        setImages(fetchedImages);
        if (fetchedImages.length > 0) {
          setMainImage(fetchedImages[0]); // Set gambar pertama sebagai yang utama
        }
      });
    }
  }, [selectedInventory]); // Gunakan `selectedInventory` sebagai dependency

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/inventory/${formData._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update inventory");
      }
      toast.success("Inventory updated successfully!");
      refreshData();
      closeModal(); // Tutup modal setelah berhasil update
    } catch (error) {
      console.error("Error updating inventory:", error);
      toast.error("Failed to update inventory");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-2/3">
        <h2 className="text-xl font-bold">Edit {formData.name}</h2>
        <div className="">{formData._id}</div>

        <div className="grid grid-cols-[2fr_1fr] gap-10">
          {/* section menu left */}
          <div>
            <div>
              <label className="block text-sm font-medium mt-6">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-md bg-gray-100 p-2"
                placeholder="Enter name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full rounded-md bg-gray-100 p-2"
                  placeholder="Enter price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Manufacture</label>
                <input
                  type="text"
                  name="manufacture"
                  value={formData.manufacture}
                  onChange={handleChange}
                  className="w-full rounded-md bg-gray-100 p-2"
                  placeholder="Enter manufacture"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-3">
              <div>
                <label className="block text-sm font-medium">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-md bg-gray-100 p-2"
                  placeholder="Enter category"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Subcategory</label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="w-full rounded-md bg-gray-100 p-2"
                  placeholder="Enter subcategory"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Storage</label>
                <input
                  type="text"
                  name="stroage"
                  value={formData.stroage}
                  onChange={handleChange}
                  className="w-full rounded-md bg-gray-100 p-2"
                  placeholder="Enter storage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Condition</label>
                <select
                  id="condition"
                  value={formData.condition} // Make sure to bind the selected value to formData.Category
                  onChange={(e) => handleChange(e)}
                  name="condition"
                  className="w-full rounded-md bg-[#efefef] p-2"
                >
                  <option className="text-sm" value="New">
                    New
                  </option>
                  <option className="text-sm" value="Refurbished">
                    Refurbished
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-3">
              <div>
                <label className="block text-sm font-medium">Marking</label>
                <input
                  type="text"
                  name="marking"
                  value={formData.marking}
                  onChange={handleChange}
                  className="w-full rounded-md bg-gray-100 p-2"
                  placeholder="Enter marking"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Package Type
                </label>
                <input
                  type="text"
                  name="packagetype"
                  value={formData.packagetype}
                  onChange={handleChange}
                  className="w-full rounded-md bg-gray-100 p-2"
                  placeholder="Enter package type"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Row</label>
                <input
                  type="text"
                  name="row"
                  value={formData.row}
                  onChange={handleChange}
                  className="w-full rounded-md bg-gray-100 p-2"
                  placeholder="Enter row"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Column</label>
                <input
                  type="text"
                  name="column"
                  value={formData.column}
                  onChange={handleChange}
                  className="w-full rounded-md bg-gray-100 p-2"
                  placeholder="Enter column"
                />
              </div>
            </div>

            <div>
              <div className="col-span-2 mt-3">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full rounded-md bg-gray-100 p-2 "
                  placeholder="Enter description"
                  rows={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full rounded-md bg-gray-100 p-2"
                  placeholder="Enter SKU"
                />
              </div>
            </div>
          </div>

          {/* section menu right */}
          <div >
            <p className="mt-6 block text-sm font-medium">Product Images</p>
            <div className="flex flex-col items-center">
            {mainImage ? (
              <img
                src={mainImage.imageData}
                alt={mainImage.imageName}
                className="w-60 h-60 object-cover rounded-md transition-all duration-300 mt-6"
              />
            ) : (
              <p className="text-gray-500 text-sm">No images available</p>
            )}

            {/* Gambar kecil di bawah */}
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img.imageData}
                    alt={img.imageName}
                    className="w-16 h-16 object-cover rounded-md cursor-pointer hover:opacity-80 transition-all"
                    onClick={() => setMainImage(img)} // Saat diklik, ubah gambar utama
                  />
                ))}
              </div>
            )}
          </div>

          </div>


        </div>

        <div className="mt-4 flex justify-end gap-4">
          <button
            className="bg-gray-400 text-white p-2 rounded-md"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="text-white font-bold text-sm border bg-black rounded-md pt-1 pb-1 pl-2 pr-2"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
