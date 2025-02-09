import { useState } from "react"; // Make sure to import useState

const StockAdd = () => {
  return (
    <div>
      <div className="flex flex-1 justify-between items-center">
        <h2 className="text-2xl font-bold">Stock add</h2>
        {/* Button to open the modal */}
      </div>

      <div className="flex flex-1 gap-6">
        {/* left menu */}
        <div className="bg-[#f7f7f7]  p-6 rounded-md  mt-4 w-[60%]">
          <div className="text-xl font-bold">General Information</div>
          {/* col 1 */}
          <div className="flex flex-col gap-2">
            <div className="font-sm font-medium mt-2">Product Name</div>
            <input
              type="text"
              name="lastName"
              className="w-full rounded-md bg-[#efefef] p-2"
            />
          </div>
          {/* col 2 */}
          <div className="flex flex-1 justify-between gap-4 mt-3">
            <div className="flex flex-col w-1/2 gap-2">
              <div className="font-sm font-medium">Price</div>
              <input
                type="text"
                name="lastName"
                placeholder="Price"
                className="w-full rounded-md bg-[#efefef] p-2"
              />
            </div>

            <div className="flex flex-col w-1/2 gap-2">
              <div className="font-sm font-medium">Manufacture</div>
              <select
                id="category"
                defaultValue={"category1"}
                className="w-full rounded-md bg-[#efefef] p-2"
              >
                <option className="text-sm" value="category1">
                  Category 1
                </option>
                <option className="text-sm" value="category2">
                  Category 2
                </option>
                <option className="text-sm" value="category3">
                  Category 3
                </option>
                <option className="text-sm" value="category4">
                  Category 4
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
                name="lastName"
                className="w-full rounded-md bg-[#efefef] p-2"
              />
            </div>

            <div className="flex flex-col w-1/2 gap-2">
              <div className="font-sm font-medium">Sub Category</div>
              <input
                type="text"
                name="lastName"
                className="w-full rounded-md bg-[#efefef] p-2"
              />
            </div>

            <div className="flex flex-col w-1/2 gap-2">
              <div className="font-sm font-medium">Package Type</div>
              <input
                type="text"
                name="lastName"
                className="w-full rounded-md bg-[#efefef] p-2"
              />
            </div>
          </div>

          {/* col 4 */}
          <div className="mt-5 gap-2">
            <div className="font-sm font-medium">Details</div>
            <textarea
              name="details"
              className="w-full rounded-md bg-[#efefef] p-2 mt-2"
              rows="4"
            />
          </div>
        </div>

        {/* right menu */}
        <div className="flex flex-1 flex-col mt-4 w-[40%] gap-4">
          <div className="bg-[#f7f7f7]  p-4 rounded-md">
            <p className="text-xl font-bold">Pictures</p>
            <div className=" flex justify-between  ">
              <div>p0</div>

              <div>
                <div>p1</div>

                <div>p2</div>

                <div>p3</div>
              </div>
            </div>
          </div>

          <div className="bg-[#f7f7f7] rounded-md p-4">
            <p className="text-xl font-bold">Stock</p>

            <div className="flex flex-1 gap-3">
              <div className="flex flex-1 flex-col">
                <p>Stock</p>
                <input
                  type="text"
                  name="Stock"
                  placeholder="Stock"
                  className="w-full rounded-md bg-[#efefef] p-2"
                />
              </div>

              <div className="flex flex-1 flex-col ">
                <p>Stock Keep Unit (SKU)</p>
                <input
                  type="text"
                  name="lastName"
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
              name="lastName"
              placeholder="optional"
              className="w-full rounded-md bg-[#efefef] p-2"
            />
          </div>
        </div>
      </div>

      {/* Add your statistics content here */}
    </div>
  );
};

export default StockAdd;
