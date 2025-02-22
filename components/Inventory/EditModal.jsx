import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";

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
  const [displayPrice, setDisplayPrice] = useState(""); // Untuk tampilan harga dalam Rupiah

  useEffect(() => {
    if (selectedInventory?.price) {
      setFormData((prevData) => ({
        ...prevData,
        price: selectedInventory.price, // Simpan angka asli di formData
      }));

      setDisplayPrice(formatToRupiah(selectedInventory.price)); // Format untuk tampilan
    }
  }, [selectedInventory]);

  const formatToRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  
  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Hanya angka
    setFormData((prevData) => ({
      ...prevData,
      price: rawValue, // Simpan angka asli di state
    }));
    setDisplayPrice(rawValue); // Tampilkan angka mentah di input saat mengetik
  };

  const handlePriceBlur = () => {
    setDisplayPrice(formatToRupiah(formData.price)); // Ubah ke format Rupiah saat kehilangan fokus
  };
  const [deletedImages, setDeletedImages] = useState([]);

  const handleDelete = (image) => {
    console.log("Deleting image:", image.imageName);

    // Tambahkan nama gambar ke deletedImages
    setDeletedImages((prev) => [...prev, image.imageName]);

    // Hapus gambar dari daftar images
    const updatedImages = images.filter(
      (img) => img.imageName !== image.imageName
    );
    setImages(updatedImages);

    // Jika gambar utama yang dihapus, ganti dengan gambar lain atau set ke null
    if (mainImage && image.imageName === mainImage.imageName) {
      setMainImage(updatedImages.length > 0 ? updatedImages[0] : null);
    }
  };

  const deleteImagesFromServer = async () => {
    if (deletedImages.length === 0) {
      console.warn("No images to delete");
      return;
    }

    const queryParams = deletedImages
      .map((name) => `names=${encodeURIComponent(name)}`)
      .join("&");

    try {
      const response = await fetch(
        `/api/inventory/getimages/imagesbyname?${queryParams}`,
        { method: "DELETE" }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Deleted images:", data);
        setDeletedImages([]); // Reset array setelah berhasil dihapus
      } else {
        console.error("Error deleting images:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = {
          imageName: file.name,
          imageData: reader.result, // Base64 image
        };
        setImages((prevImages) => [...prevImages, newImage])
        // Jika belum ada mainImage, set gambar baru jadi mainImage
        if (!mainImage) {
          setMainImage(newImage);
        }
      };
      reader.readAsDataURL(file);
      console.log(file)
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

  console.log(selectedInventory);

  useEffect(() => {
    if (selectedInventory?.imagesnames?.length > 0) {
      fetchImagesByNames(selectedInventory.imagesnames).then(
        (fetchedImages) => {
          setImages(fetchedImages);
          if (fetchedImages.length > 0) {
            setMainImage(fetchedImages[0]); // Set gambar pertama sebagai yang utama
          }
        }
      );
    }
  }, [selectedInventory]); // Gunakan `selectedInventory` sebagai dependency

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Hapus semua karakter selain angka
    const numericValue = value.replace(/\D/g, "");

    setFormData((prevData) => ({
      ...prevData,
      [name]: numericValue,
    }));
  };

  const handleUpdate = async () => {
    try {
      // Hapus deletedImages dari formData.imagesnames sebelum update
      const updatedImagesNames = formData.imagesnames.filter(
        (name) => !deletedImages.includes(name)
      );

      const updatedFormData = {
        ...formData,
        imagesnames: updatedImagesNames,
      };

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

      console.log("Deleted images before sending to server:", deletedImages);

      await deleteImagesFromServer(); // Hapus gambar dari server setelah update berhasil

      closeModal(); // Tutup modal setelah berhasil update
    } catch (error) {
      console.error("Error updating inventory:", error);
      toast.error("Failed to update inventory");
    }
  };

  const handleImageUpload = async (image) => {
    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(image),
      });
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      console.log("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };


  const handletest = async (image) => {
    handleImageUpload()
  }




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
                  type="text"
                  name="price"
                  value={displayPrice}
                  onChange={handlePriceChange}
                  onBlur={handlePriceBlur}
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
