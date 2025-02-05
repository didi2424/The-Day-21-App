import { MdArrowOutward } from "react-icons/md";

const InventoryCard = ({ title, subTitle, stock, price, quantity, brands }) => {
  return (
    <div className="flex-1 bg-[#feffff] p-3 rounded-md gap-3">
      <div className="flex justify-between ">
        <div>
          <div className="flex text-black font-medium">{title}</div>
          <div className="text-black text-sm">{subTitle}</div>
        </div>
        <div className="bg-[#b9ec8f] text-xs text-white rounded-full w-7 h-7 flex items-center justify-center">
          <MdArrowOutward className="text-black" />
        </div>
      </div>

      <div>
        <div className="flex justify-between">
          <div className="flex mt-6 font-light text-sm">Stock</div>
          <div className="flex mt-6 font-light text-sm">{price}</div>
        </div>
        <div className="flex font-medium text-2xl">{quantity} pcs</div>
      </div>

      <div>
        <div className="flex mt-10 font-light text-sm ">Brand</div>
        <div className="flex gap-2 mt-2  ">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="bg-black text-white pl-2 pr-1 pt-1 pb-1 gap-2 rounded-full flex items-center justify-between"
            >
              <div className="text-xs">{brand.name}</div>
              <div className="bg-white text-xs text-black rounded-full w-5 h-5 flex items-center justify-center">
                {brand.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;