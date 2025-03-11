import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";

import {
  handleImageUpload,
  fetchImagesByNames,
  deleteImagesFromServer,
} from "@/utils/api/images";

import {formatToRupiah} from "@/utils/format/currency";
import { convertToBase64 } from "@/utils/format/convertobase64";

const EditModal = ({ isModalOpen, closeModal, selectedInventory, refreshData }) => {
  if (!isModalOpen) return null;

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    price: "",
    manufacture: "",
    category: "",
    subcategory: "",
    stock: "",
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

  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [pendingImages, setPendingImages] = useState([]); // Gambar yang akan diupload
  const [deletedImages, setDeletedImages] = useState([]); // Gambar yang akan dihapus
  const [displayPrice, setDisplayPrice] = useState(""); // Untuk tampilan harga dalam Rupiah

  // Fetch images by names
  const handleFetchImages = useCallback(async () => {
    if (!formData.imagesnames || formData.imagesnames.length === 0) return;
    try {
      const fetchedImages = await fetchImagesByNames(formData.imagesnames);
      setImages(fetchedImages);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }, [formData.imagesnames]);

  // useEffect utama (menggabungkan beberapa efek menjadi satu)
  useEffect(() => {
    if (!selectedInventory || Object.keys(selectedInventory).length === 0) return;

    // Update formData dengan data dari selectedInventory
    setFormData((prevData) => ({
      ...prevData,
      ...selectedInventory,
      price: selectedInventory.price || "",
      imagesnames: Array.isArray(selectedInventory.imagesnames)
        ? selectedInventory.imagesnames
        : [],
    }));

    // Format harga untuk tampilan
    if (selectedInventory.price) {
      setDisplayPrice(formatToRupiah(selectedInventory.price));
    }

    // Fetch images jika ada daftar nama gambar
    if (selectedInventory.imagesnames?.length > 0) {
      fetchImagesByNames(selectedInventory.imagesnames).then((fetchedImages) => {
        setImages(fetchedImages);
        if (fetchedImages.length > 0) {
          setMainImage(fetchedImages[0]); // Set gambar pertama sebagai yang utama
        }
      });
    }

    // Panggil handleFetchImages untuk memastikan gambar diperbarui
    handleFetchImages();
  }, [selectedInventory, handleFetchImages]);

  // Handle perubahan harga di input
  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Hanya angka
    setFormData((prevData) => ({
      ...prevData,
      price: rawValue, // Simpan angka asli
    }));
    setDisplayPrice(rawValue); // Tampilkan angka mentah di input saat mengetik
  };

  // Format harga saat input kehilangan fokus
  const handlePriceBlur = () => {
    setDisplayPrice(formatToRupiah(formData.price));
  };

  // Handle perubahan input lainnya
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "price" ? value.replace(/\D/g, "") : value,
    }));
  };

  // Handle delete image
  const handleDelete = (image) => {
    setDeletedImages((prev) => [...prev, image.imageName]);
    const updatedImages = images.filter((img) => img.imageName !== image.imageName);
    setImages(updatedImages);

    // Jika gambar utama yang dihapus, ganti dengan gambar lain atau set ke null
    if (mainImage && image.imageName === mainImage.imageName) {
      setMainImage(updatedImages.length > 0 ? updatedImages[0] : null);
    }
  };

  // Handle file upload (convert to base64 untuk preview)
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const base64Image = await convertToBase64(file);
      const newImage = {
        imageName: file.name,
        imageData: base64Image, // Base64 untuk preview
      };

      setImages((prevImages) => [...prevImages, newImage]); // Update preview
      setPendingImages((prev) => [...prev, newImage]); // Simpan untuk diupload nanti

      toast.success("Image added to preview!");
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
    }
  };

  // Handle update inventory
  const handleUpdate = async () => {
    try {
      // Hapus gambar dari server sebelum update
      if (deletedImages.length > 0) {
        const success = await deleteImagesFromServer(deletedImages);
        if (!success) {
          toast.error("Failed to delete images from server");
          return;
        }
      }

      // Upload semua gambar baru di `pendingImages`
      const uploadedImageNames = [];
      for (const image of pendingImages) {
        const uploadedName = await handleImageUpload(image);
        if (uploadedName) {
          uploadedImageNames.push(uploadedName);
        } else {
          toast.error(`Failed to upload image: ${image.imageName}`);
          return;
        }
      }

      // Hapus deletedImages dari imagesnames sebelum update
      const updatedImagesNames = [
        ...formData.imagesnames.filter((name) => !deletedImages.includes(name)),
        ...uploadedImageNames, // Tambahkan gambar baru
      ];

      const updatedFormData = {
        ...formData,
        imagesnames: updatedImagesNames,
      };

      // Update inventory di server
      const response = await fetch(`/api/inventory/${formData._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        throw new Error("Failed to update inventory");
      }

      toast.success("Inventory updated successfully!");
      refreshData();

      // Reset state setelah update
      setDeletedImages([]);
      setPendingImages([]);
      closeModal();
    } catch (error) {
      console.error("Error updating inventory:", error);
      toast.error("Failed to update inventory");
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 ">
      <div className=" w-2/3 bg-white/1 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg  ">
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
                className="w-full px-3 py-2 p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                placeholder="Enter name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="text"
                  name="price"
                  value={displayPrice}
                  onChange={handlePriceChange}
                  onBlur={handlePriceBlur}
                  className="w-full px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
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
                  className="w-full px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
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
                  className="w-full px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
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
                  className="w-full px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
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
                  className="w-full px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
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
                  className="w-full px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
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
                  className="w-full px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
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
                  className="w-full px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
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
                  className="w-full px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                  placeholder="Enter column"
                />
              </div>
            </div>

            <div>
              <div className="col-span-2 mt-3">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  type="text"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500 "
                  placeholder="Enter description"
                  rows={6}
                />
              </div>


              <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-sm font-medium">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                  placeholder="Enter SKU"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                  placeholder="Enter SKU"
                />
              </div>

              </div>
            </div>
          </div>

          <div>
            <p className="mt-6 block text-sm font-medium">Product Images</p>
            <div className="flex flex-col items-center relative">
              {mainImage ? (
                <div className="relative">
                  <img
                    src={mainImage.imageData}
                    alt={mainImage.imageName}
                    className="w-60 h-60 object-cover rounded-md transition-all duration-300 mt-6 shadow-md"
                  />
                  {/* Icon delete di gambar besar */}
                  <MdDelete
                    className="absolute bottom-2 right-2 bg-white text-black p-1 rounded-full shadow-md hover:bg-gray-400 transition text-3xl"
                    onClick={() => handleDelete(mainImage)}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center mt-6">
                  <p className="text-gray-500 text-sm mb-2">
                    No images available
                  </p>
                  {/* Tombol Add Image di tengah jika tidak ada gambar */}
                  <label className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md text-gray-500 hover:bg-gray-200 transition-all cursor-pointer">
                    +
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}

              {/* Gambar kecil di bawah + tombol tambah gambar */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {images
                    .filter((img) => img.imageName !== mainImage?.imageName)
                    .map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img.imageData}
                          alt={img.imageName}
                          className="w-16 h-16 object-cover rounded-md cursor-pointer hover:opacity-80 transition-all"
                          onClick={() => setMainImage(img)}
                        />
                        {/* Icon delete di gambar kecil */}
                        <MdDelete
                          className="absolute bottom-2 right-2 bg-white text-black p-1 rounded-full shadow-md hover:bg-gray-400 transition"
                          onClick={() => handleDelete(img)}
                        />
                      </div>
                    ))}

                  {/* Tombol Tambah Gambar di samping gambar kecil */}
                  <label className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md text-gray-500 hover:bg-gray-200 transition-all cursor-pointer">
                    +
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
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
