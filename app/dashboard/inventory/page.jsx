"use client";
import React, { useState } from "react";
import NavbarAdmin from "../../../components/NavBar/NavbarAdmin";
import Provider from "@components/Provider";
import { useSession } from "next-auth/react";
import SidebarInventory from "../../../components/Sidebar/SidebarInventory";
import InventoryCard from "../../../components/Inventory/CardInventory/InventoryCard"; // Adjust path if necessary
import StockList from "../../../components/Inventory/StockList"
import StockAdd from "../../../components/Inventory/StockAdd";

import SvgIcon from "../../../components/Inventory/Drawyer/Drawyer5x5";

const DashboardInvetoryContent = ({ activeButton }) => {
  const { data: session } = useSession();
  const inventoryData = [
    {
      title: "Voltage Regulator",
      subTitle: "LDO",
      stock: "142 pcs",
      price: "Rp.24.614.314",
      quantity: 142,
      brands: [
        { name: "Onsemi", count: 77 },
        { name: "MPS", count: 61 },
        { name: "Alpha & Omega", count: 4 },
      ],
    },
    {
      title: "DrMos",
      subTitle: "Power Module",
      stock: "50 pcs",
      price: "Rp.15.128.000",
      quantity: 57,
      brands: [
        { name: "Alpha & Omega", count: 27 },
        { name: "MPS", count: 30 },
      ],
    },
    {
      title: "MOSFET",
      subTitle: " N-Channel Mosfet",
      stock: "100 pcs",
      price: "Rp.18.590.000",
      quantity: 105,
      brands: [
        { name: "Sinopower", count: 64 },
        { name: "Magnachip", count: 41 },
      ],
    },
  ];

  const [hoveredGroup, setHoveredGroup] = useState("Not Selected");
  switch (activeButton) {
    case "stock":
      return (
        <StockList/>
      );
    case "addstock":
      return (
        <StockAdd/>
      );
    case "issue":
      return (
        <div>
          <h2 className="text-2xl font-bold">Issues Report</h2>
          <p>View and manage your reports...</p>
          {/* Add your reports content here */}
        </div>
      );
    case "reports":
      return (
        <div>
          <h2 className="text-2xl font-bold">Stock Report</h2>
          <p>Configure your settings...</p>
          {/* Add your settings content here */}
        </div>
      );
    case "Help Center":
      return (
        <div>
          <h2 className="text-2xl font-bold">Help Center</h2>
          <p>Help Center...</p>
          {/* Add your settings content here */}
        </div>
      );
    default:
      return (
        <Provider>
          {session?.user ? (
            <>
              <div className="flex p-4 bg-[#f7f7f7] rounded-md gap-4">
                <div className="flex-1 gap-2">
                  <h1 className="text-3xl font-bold">Inventory Assets</h1>

                  <div className="flex gap-3 mt-3">
                    {inventoryData.map((data, index) => (
                      <InventoryCard key={index} {...data} />
                    ))}
                  </div>
                </div>

                {/* Right side: Other Content */}
                <div className="w-1/3 bg-[#feffff] p-4 rounded-md">
                  <h2 className="text-xl text-black">AI assistance</h2>
                </div>
              </div>

              <div className="mt-4 text-2xl font-bold">Drawyer</div>

              <div className="flex flex-row justify-between mt-3">
                <div> </div>

                <div className="flex flex-col md:flex-row">
                  <div className="text-4xl font-bold mr-3">D1</div>
                  <div
                    className="flex justify-center items-center"
                    style={{ width: "500px", height: "400px" }}
                  >
                    <SvgIcon setHoveredGroup={setHoveredGroup} />
                  </div>

                  <div
                    className="ml-3 "
                    style={{ width: "200px", height: "400px" }}
                  >
                    <p className="mt-20 text-sm font-light">{`Drawyer Number:`}</p>
                    <p className=" text-sm font-medium">{`${hoveredGroup}`}</p>

                    <p className="mt-5 text-sm font-light">{`What is in Drawyer:`}</p>
                    <p className=" text-sm font-medium">
                      Type : Voltage Regulator
                    </p>

                    <div className="flex gap-2 mt-2">
                      <div className="bg-black text-white pl-2 pr-1 pt-1 pb-1 gap-2 rounded-full flex items-center justify-between">
                        <div className="text-xs">APW7142</div>
                        <div className="bg-white text-xs text-black rounded-full w-5 h-5 flex items-center justify-center">
                          3
                        </div>
                      </div>

                      <div className="bg-black text-white pl-2 pr-1 pt-1 pb-1 gap-2 rounded-full flex items-center justify-between">
                        <div className="text-xs">APW8722</div>
                        <div className="bg-white text-xs text-black rounded-full w-5 h-5 flex items-center justify-center">
                          5
                        </div>
                      </div>

                      <div className="bg-black text-white pl-2 pr-1 pt-1 pb-1 gap-2 rounded-full flex items-center justify-between">
                        <div className="text-xs">NCP5230</div>
                        <div className="bg-white text-xs text-black rounded-full w-5 h-5 flex items-center justify-center">
                          6
                        </div>
                      </div>



                    </div>
                  </div>
                </div>

                <div> </div>
              </div>
            </>
          ) : (
            <h1>Login</h1>
          )}
        </Provider>
      );
  }
};

function inventory() {
  const [activeButton, setActiveButton] = useState(null);

  const getBreadcrumb = () => {
    const basePath = "Dashboard > Inventory";
    if (!activeButton) return basePath;
    return `${basePath} > ${
      activeButton.charAt(0).toUpperCase() + activeButton.slice(1)
    }`; // Capitalize the active button name
  };

  return (
    <Provider>
      <div className="h-screen flex flex-col w-full">
        {/* Navbar */}
        <header className="p-4">
          <NavbarAdmin />
        </header>
        <div className="justify-between flex pr-4 pl-4">
          <div className="text-sm">{getBreadcrumb()}</div>

          <div></div>
        </div>
        {/* Main Content (Flex container) */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <SidebarInventory
            activeButton={activeButton}
            setActiveButton={setActiveButton}
          />

          {/* Main Content Section */}
          <div className="flex-1 p-8 overflow-auto rounded-[20px] border border-gray-500 m-3 bg-[#fefdfb]">
            <DashboardInvetoryContent activeButton={activeButton} />
          </div>
        </div>
      </div>
    </Provider>
  );
}

export default inventory;
