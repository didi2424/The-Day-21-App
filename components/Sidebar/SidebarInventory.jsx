// components/Sidebar.jsx
import React from "react";
import {
  MdOutbox,
  MdOutlineInventory,
  MdInventory,
  MdAddBox,
} from "react-icons/md";

const SidebarInventory = ({ activeButton, setActiveButton }) => {
  return (
    <aside className="flex-shrink-0 p-4 flex flex-col h-full">
      {/* Top spacing */}
      <div className="flex-1"></div>

      {/* Centered purple section */}
      <div className="bg-[#efefef] p-3 rounded-full mx-auto shadow-md">
        <ul className="space-y-2">
          <li>
            <div
              onClick={() => setActiveButton("stock")}
              className={`${
                activeButton === "stock" ? "active" : ""
              } sidebar_btnnew`}
            >
              <MdInventory className="text-xl" />
            </div>
          </li>
          <li>
            <div
              onClick={() => setActiveButton("addstock")}
              className={`${
                activeButton === "addstock" ? "active" : ""
              } sidebar_btnnew`}
            >
              <MdAddBox className="text-xl" />
            </div>
          </li>
          <li>
            <div
              onClick={() => setActiveButton("issue")}
              className={`${
                activeButton === "issue" ? "active" : ""
              } sidebar_btnnew`}
            >
              <MdOutbox className="text-xl" />
            </div>
          </li>
          <li>
            <div
              onClick={() => setActiveButton("reports")}
              className={`${
                activeButton === "reports" ? "active" : ""
              } sidebar_btnnew`}
            >
              <MdOutlineInventory className="text-xl" />
            </div>
          </li>
        </ul>
      </div>

      {/* Bottom spacing */}
      <div className="flex-1"></div>
    </aside>
  );
};

export default SidebarInventory;
