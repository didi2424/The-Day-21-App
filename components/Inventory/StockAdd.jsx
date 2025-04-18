import { useState } from "react"; // Make sure to import useState
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

const StockAdd = () => {
  const [formData, setFormData] = useState({
    name: "",
    marking: "",
    manufacture: "",
    price: "",
    packagetype: "",
    subcategory: "",
    category: "",
    description: "",
    stock: "",
    sku: "",
    condition: "",
    stroage: "",
    row: "",
    column: "",
    imagesnames: [],
  });

  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [mainImageBase64, setMainImageBase64] = useState("");
  const [additionalImagesBase64, setAdditionalImagesBase64] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Konversi gambar ke Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleMainImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setMainImage(URL.createObjectURL(file));
      setMainImageBase64(base64);
    }
  };

  const handleAdditionalImageUpload = async (event) => {
    const files = Array.from(event.target.files);

    if (files.length + additionalImages.length <= 3) {
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      const newBase64Images = await Promise.all(
        files.map((file) => convertToBase64(file))
      );

      setAdditionalImages((prev) => [...prev, ...newPreviews]);
      setAdditionalImagesBase64((prev) => [...prev, ...newBase64Images]);
    }
  };

  const handleUploadImage = async () => {
    if (!mainImageBase64) {
      toast.error("Harap unggah gambar utama sebelum menyimpan produk.");
      return null;
    }

    try {
      const imageUploads = await Promise.all(
        [mainImageBase64, ...additionalImagesBase64].map(async (base64) => {
          const response = await fetch("/api/inventory/newimage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64 }),
          });

          if (!response.ok) {
            throw new Error("Gagal mengunggah gambar.");
          }

          const data = await response.json();
          return data.imageName;
        })
      );
      toast.success("Semua gambar berhasil diunggah.");

      return imageUploads;
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Terjadi kesalahan saat mengunggah gambar.");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uploadedNames = await handleUploadImage();
    if (!uploadedNames || uploadedNames.length === 0) {
      toast.error("Harap unggah gambar terlebih dahulu.");
      return;
    }

    const finalFormData = {
      ...formData,
      imagesnames: uploadedNames,
    };

    try {
      const response = await fetch("/api/inventory/newInventory/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalFormData),
      });

      if (response.ok) {
        toast.success("Produk berhasil disimpan.");
        setFormData({
          name: "",
          marking: "",
          manufacture: "",
          price: "",
          packagetype: "",
          subcategory: "",
          category: "",
          description: "",
          stock: "",
          sku: "",
          condition: "",
          stroage: "",
          row: "",
          column: "",
          imagesnames: [],
        });
        setMainImage(null);
        setAdditionalImages([]);
        setMainImageBase64("");
        setAdditionalImagesBase64([]);
      } else if (response.status === 409) {
        toast.error("Produk sudah ada dalam inventory.");
      } else {
        toast.error("Gagal menyimpan produk.");
      }
    } catch (error) {
      toast.error("Kesalahan server, coba lagi nanti.");
    }
  };
  return (
    <div className="  text-gray-100 h-[540px]">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-800/20 to-pink-900/20" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[700px] h-[700px] bg-pink-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
      </div>

      <h2 className="text-2xl font-bold">Stock Add</h2>

      <div className="flex flex-1 gap-6">
        {/* left menu */}
        <div className=" p-4 rounded-md  w-[60%]">

          {/* col 1 */}
          <div className="flex flex-col gap-2">
            <div className="font-sm font-medium mt-2">Product Name</div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Input Name"
              className="flex-1 px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
            />
          </div>
          {/* col 2 */}
          <div className="flex flex-1 justify-between gap-4 mt-3">
            <div className="flex flex-col w-1/2 gap-2">
              <div className="font-sm font-medium">Price</div>
              <input
                type="number"
                name="price"
                placeholder="Input Price"
                value={formData.price}
                onChange={handleChange}
                className="flex-1 px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
              />
            </div>

            <div className="flex flex-col w-1/2 gap-2">
              <div className="font-sm font-medium">Manufacture</div>
              <select
                id="category"
                value={formData.manufacture} // Make sure to bind the selected value to formData.Category
                onChange={(e) => handleChange(e)}
                name="manufacture"
                className="flex-1 px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
              >
                <option className="text-sm" value="Alpha & Omega">
                  Alpha & Omega
                </option>
                <option className="text-sm" value="ON Semiconductor">
                  ON Semiconductor
                </option>
                <option className="text-sm" value="Infineon Technologies">
                  Infineon Technologies
                </option>
                <option className="text-sm" value="uPI Semiconductor">
                  uPI Semiconductor
                </option>
                <option className="text-sm" value="Monolithic Power Systems">
                  Monolithic Power Systems
                </option>
                <option className="text-sm" value="Magnachip">
                  Magnachip
                </option>
                <option className="text-sm" value="Thermalright Odyssey">
                  Thermalright Odyssey
                </option>
                <option className="text-sm" value="ARCTIC">
                  ARCTIC
                </option>
                <option className="text-sm" value="Gstek">
                  Gstek
                </option>
                <option className="text-sm" value="SinoPower">
                  SinoPower
                
                </option>
              </select>
            </div>
          </div>
          {/* col 3 */}
          <div className="flex flex-1 justify-between gap-4 mt-3">
            <div className="flex flex-col w-1/2 gap-2">
              <div className="font-sm font-medium">Marking</div>
              <input
                type="text"
                name="marking"
                value={formData.marking}
                onChange={handleChange}
                className="flex-1 px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
              />
            </div>

            <div className="flex flex-col w-1/2 gap-2">
              <div className="font-sm font-medium">Category</div>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="flex-1 px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
              />
            </div>

            <div className="flex flex-col w-1/2 gap-2">
              <div className="font-sm font-medium">Sub Category</div>
              <input
                type="text"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="flex-1 px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
              />
            </div>

            <div className="flex flex-col w-1/2 gap-2">
              <div className="font-sm font-medium">Package Type</div>
              <input
                type="text"
                name="packagetype"
                value={formData.packagetype}
                onChange={handleChange}
                className="flex-1 px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
              />
            </div>
          </div>

          {/* col 4 */}
          <div className="flex flex-1 gap-3 mt-3">
            {/* Storage input takes full width */}
            <div className="flex flex-1 flex-col">
              <p className="font-sm font-medium">Storage</p>
              <input
                type="text"
                name="stroage"
                value={formData.stroage}
                onChange={handleChange}
                placeholder="Storage"
                className="flex-1 px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
              />
            </div>

            <div className="flex flex-1 gap-3">
              <div className="flex flex-1 flex-col">
                <p className="font-sm font-medium">Row</p>
                <input
                  type="number"
                  name="row"
                  value={formData.row}
                  onChange={handleChange}
                  placeholder="Row"
                  className="flex-1 px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                />
              </div>

              {/* Column input takes 1/3 of the container's width */}
              <div className="flex flex-1 flex-col">
                <p className="font-sm font-medium">Column</p>
                <input
                  type="number"
                  name="column"
                  value={formData.column}
                  onChange={handleChange}
                  placeholder="Column"
                  className="flex-1 px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* col 5 */}
          <div className="mt-5 gap-2">
            <div className="font-sm font-medium">Details</div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Input Details. ie, This is a PWM Controller....."
              className=" w-full px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500 mt-2"
              rows="5"
            />
          </div>
        </div>

        {/* right menu */}
        <div className="flex flex-1 flex-col mt-4 w-[40%] gap-4 ">
          <div className="bg-[#1a2237]/40 backdrop-blur-lg p-6 rounded-xl border border-[#2a3548] shadow-lg flex flex-col  ">
            <h2 className="text-lg font-bold mb-2">Product Images</h2>
            <div className="flex p-4 gap-2 justify-center">
              <label className="w-48 h-48 bg-gray-300 flex items-center justify-center cursor-pointer overflow-hidden rounded-md">
                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt="Main"
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-gray-600">Add Images</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleMainImageUpload}
                />
              </label>
              <div className="flex flex-col gap-2">
                {[...Array(3)].map((_, index) => (
                  <label
                    key={index}
                    className="w-16 h-16 bg-gray-300 flex items-center justify-center cursor-pointer overflow-hidden"
                  >
                    {additionalImages[index] ? (
                      <Image
                        src={additionalImages[index]}
                        alt={`Additional ${index}`}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full rounded-md"
                      />
                    ) : (
                      <span className="text-gray-600">+</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAdditionalImageUpload}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className=" bg-[#1a2237]/40 backdrop-blur-lg p-4 rounded-xl border border-[#2a3548] shadow-lg flex flex-col ">
            <p className="text-xl font-bold">Stock</p>

            <div className="flex flex-1 gap-3">
              <div className="flex flex-1 flex-col">
                <p>Stock</p>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                  className="flex-1 px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                />
              </div>

              <div className="flex flex-1 flex-col ">
                <p>Stock Keep Unit (SKU)</p>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="optional"
                  className="flex-1 px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          <div className=" p-4 flex flex-1 flex-col rounded-md gap-2 bg-[#1a2237]/40 backdrop-blur-lg border border-[#2a3548] shadow-lg  ">
            <p className="text-xl font-bold ">Condition</p>

            <select
              id="condition"
              value={formData.condition} // Make sure to bind the selected value to formData.Category
              onChange={(e) => handleChange(e)}
              name="condition"
              className="flex-1 px-3 py-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
            >
              <option className="text-sm" value="New">
                New
              </option>
              <option className="text-sm" value="Refurbished">
                Refurbished
              </option>
            </select>
          </div>
          <div
            className="topactive_btn inline-flex items-center justify-center px-6 py-2 rounded-md text-center cursor-pointer mt-4 max-w-max border border-[#2a3548]"
            onClick={handleSubmit}
          >
            Save
          </div>
        </div>
      </div>

      {/* Add your statistics content here */}
    </div>
  );
};

export default StockAdd;
