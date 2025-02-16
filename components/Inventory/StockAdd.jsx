import { useState } from "react"; // Make sure to import useState
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const StockAdd = () => {
 
  const [formData, setFormData] = useState({
    name: "",
    marking:"",
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const validateForm = () => {
    const requiredFields = [
      "name", "price", "marking", "category", "subcategory", "packagetype", "stock"
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} harus diisi terlebih dahulu`, {
          position: "bottom-right",
          autoClose: 5000, // Close after 5 seconds
          hideProgressBar: false,  // Show progress bar
          closeOnClick: true,  // Allow closing the toast by clicking
        });
        return false;
      }
    }

    return true; // Form is valid
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Don't submit if validation fails
    }

    // Optionally, you can still handle any error messages
    try {
      // Send formData to the backend
      const response = await fetch('/api/inventory/new/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send the formData as a JSON string
      });
  
      // Check if the response was successful
      if (response.ok) {
        toast.success("Product Berhasil Disimpan", {
          position: "bottom-right",
          autoClose: 2000, // Close after 5 seconds
          hideProgressBar: false,  // Show progress bar
          closeOnClick: true,  // Allow closing the toast by clicking
        });
    
      } else if (response.status === 409) {
        // Handle case where the product already exists
        toast.error("Product sudah ada dalam inventory", {
          position: "bottom-right",
          autoClose: 2000, // Close after 5 seconds
          hideProgressBar: false,  // Show progress bar
          closeOnClick: true,  // Allow closing the toast by clicking
        });
      } else {
        // Handle other errors
        toast.error("Inventory Tidak Dapat Di input", {
          position: "bottom-right",
          autoClose: 2000, // Close after 5 seconds
          hideProgressBar: false,  // Show progress bar
          closeOnClick: true,  // Allow closing the toast by clicking
        });
      }
    } catch (error) {
      toast.error("Inventory Tidak Dapat Di input", {
        position: "bottom-right",
        autoClose: 2000, // Close after 5 seconds
        hideProgressBar: false,  // Show progress bar
        closeOnClick: true,  // Allow closing the toast by clicking
      });
    }
};

  return (
    <div>
      <div className="flex flex-1 justify-between items-center">
        <h2 className="text-2xl font-bold">Stock add</h2>
        {/* Button to open the modal */}
      </div>

      <div className="flex flex-1 gap-6">
        {/* left menu */}
        <div className="bg-[#f7f7f7]  p-4 rounded-md  mt-4 w-[60%]">
          <div className="text-xl font-bold">General Information</div>
          {/* col 1 */}
          <div className="flex flex-col gap-2">
            <div className="font-sm font-medium mt-2">Product Name</div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md bg-[#efefef] p-2"
            />
          </div>
          {/* col 2 */}
          <div className="flex flex-1 justify-between gap-4 mt-3">
            <div className="flex flex-col w-1/2 gap-2">
              <div className="font-sm font-medium">Price</div>
              <input
                type="text"
                name="price"
                placeholder="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full rounded-md bg-[#efefef] p-2"
              />
            </div>

            <div className="flex flex-col w-1/2 gap-2">
              <div className="font-sm font-medium">Manufacture</div>
              <select
                id="category"
                value={formData.manufacture} // Make sure to bind the selected value to formData.Category
                onChange={(e) => handleChange(e)}
                name="manufacture"
                className="w-full rounded-md bg-[#efefef] p-2"
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
                <option className="text-sm" value="Monolithic Power Systems">
                  Monolithic Power Systems
                </option>
                <option className="text-sm" value="Magnachip">
                  Magnachip
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
                className="w-full rounded-md bg-[#efefef] p-2"
              />
            </div>

            <div className="flex flex-col w-1/2 gap-2">
              <div className="font-sm font-medium">Category</div>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-md bg-[#efefef] p-2"
              />
            </div>

            

            <div className="flex flex-col w-1/2 gap-2">
              <div className="font-sm font-medium">Sub Category</div>
              <input
                type="text"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="w-full rounded-md bg-[#efefef] p-2"
              />
            </div>

            <div className="flex flex-col w-1/2 gap-2">
              <div className="font-sm font-medium">Package Type</div>
              <input
                type="text"
                name="packagetype"
                value={formData.packagetype}
                onChange={handleChange}
                className="w-full rounded-md bg-[#efefef] p-2"
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
                className="w-full rounded-md bg-[#efefef] p-2"
              />
            </div>

            <div className="flex flex-1 gap-3">
            <div className="flex flex-1 flex-col">
              <p className="font-sm font-medium">Row</p>
              <input
                type="text"
                name="row"
                value={formData.row}
                onChange={handleChange}
                placeholder="Row"
                className="w-full rounded-md bg-[#efefef] p-2"
              />
            </div>

            {/* Column input takes 1/3 of the container's width */}
            <div className="flex flex-1 flex-col">
              <p className="font-sm font-medium">Column</p>
              <input
                type="text"
                name="column"
                value={formData.column}
                onChange={handleChange}
                placeholder="Column"
                className="w-full rounded-md bg-[#efefef] p-2"
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
              className="w-full rounded-md bg-[#efefef] p-2 mt-2"
              rows="6"
            />
          </div>
        </div>

        {/* right menu */}
        <div className="flex flex-1 flex-col mt-4 w-[40%] gap-4">
          <div className="bg-[#f7f7f7] p-4 rounded-md">
            <p className="text-xl font-bold">Pictures</p>

            <div className="grid grid-cols-4 gap-4 justify-items-center items-center">
              {/* p0 will take 2 columns, centered horizontally and vertically */}
              <div className="bg-[#efefef] col-span-2 h-45 w-45">p0</div>

              {/* p1, p2, p3 are stacked vertically, centered in their container */}
              <div className="flex flex-col gap-2 justify-center items-center">
                <div className="bg-[#efefef] h-16 w-16 flex items-center justify-center">
                  p1
                </div>
                <div className="bg-[#efefef] h-16 w-16 flex items-center justify-center">
                  p2
                </div>
                <div className="bg-[#efefef] h-16 w-16 flex items-center justify-center">
                  p3
                </div>
              </div>
            </div>

            <button className="mt-2 black_btn"> Upload</button>
          </div>

          <div className="bg-[#f7f7f7] rounded-md p-4">
            <p className="text-xl font-bold">Stock</p>

            <div className="flex flex-1 gap-3">
              <div className="flex flex-1 flex-col">
                <p>Stock</p>
                <input
                  type="text"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                  className="w-full rounded-md bg-[#efefef] p-2"
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
                  className="w-full rounded-md bg-[#efefef] p-2"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#f7f7f7] p-4 flex flex-1 flex-col rounded-md gap-2 ">
            <p className="text-xl font-bold ">Condition</p>

            <input
              type="text"
              name="condition"
              placeholder="optional"
              value={formData.condition}
              onChange={handleChange}
              className="w-full rounded-md bg-[#efefef] p-2"
            />
          </div>
          <div
            className="topactive_btn inline-flex items-center justify-center px-4 py-2 rounded-md text-center cursor-pointer mt-4 max-w-max"
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
