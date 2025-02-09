import { useState } from "react"; // Make sure to import useState

const StockAdd = () => {
  const [formData, setFormData] = useState({
    ProductName: "",
    Price: "",
    Manufacture: "",
    Category: "",
    SubCategory: "",
    PackageType: "",
    Details: "",
    Stock: "",
    SKU: "",
    Condition: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log the formData to the console
    console.log(formData);

    // Optionally, you can still handle any error messages
    try {
      // You can remove the fetch part if you're just logging the data
    } catch (error) {
      toast.error(`Error: ${error.message}`);
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
              name="ProductName"
              value={formData.ProductName}
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
                name="Price"
                placeholder="Price"
                value={formData.Price}
                onChange={handleChange}
                className="w-full rounded-md bg-[#efefef] p-2"
              />
            </div>

            <div className="flex flex-col w-1/2 gap-2">
              <div className="font-sm font-medium">Manufacture</div>
              <select
                id="category"
                value={formData.Manufacture} // Make sure to bind the selected value to formData.Category
                onChange={(e) => handleChange(e)}
                name="Manufacture"
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
              <div className="font-sm font-medium">Category</div>
              <input
                type="text"
                name="Category"
                value={formData.Category}
                onChange={handleChange}
                className="w-full rounded-md bg-[#efefef] p-2"
              />
            </div>

            <div className="flex flex-col w-1/2 gap-2">
              <div className="font-sm font-medium">Sub Category</div>
              <input
                type="text"
                name="SubCategory"
                value={formData.SubCategory}
                onChange={handleChange}
                className="w-full rounded-md bg-[#efefef] p-2"
              />
            </div>

            <div className="flex flex-col w-1/2 gap-2">
              <div className="font-sm font-medium">Package Type</div>
              <input
                type="text"
                name="PackageType"
                value={formData.PackageType}
                onChange={handleChange}
                className="w-full rounded-md bg-[#efefef] p-2"
              />
            </div>
          </div>

          {/* col 4 */}
          <div className="mt-5 gap-2">
            <div className="font-sm font-medium">Details</div>
            <textarea
              name="Details"
              value={formData.Details}
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
                  name="Stock"
                  value={formData.Stock}
                  onChange={handleChange}
                  placeholder="Stock"
                  className="w-full rounded-md bg-[#efefef] p-2"
                />
              </div>

              <div className="flex flex-1 flex-col ">
                <p>Stock Keep Unit (SKU)</p>
                <input
                  type="text"
                  name="SKU"
                  value={formData.SKU}
                  onChange={handleChange}
                  placeholder="optional"
                  className="w-full rounded-md bg-[#efefef] p-2"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#f7f7f7] p-4 rounded-md gap-2 ">
            <p className="text-xl font-bold">Condition</p>

            <input
              type="text"
              name="Condition"
              placeholder="optional"
              value={formData.Condition}
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
