"use client";
import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../../components/NavBar/NavbarAdmin";
import Provider from "@components/Provider";
import SidebarInventory from "../../../components/Sidebar/SidebarInventory";
import StockList from "../../../components/Inventory/StockList"
import StockAdd from "../../../components/Inventory/StockAdd";
import Dashboard from "../../../components/Inventory/Dashboard";

import {MdArrowBack } from "react-icons/md";

const DashboardInvetoryContent = ({ activeButton, setActiveButton }) => {

  const handleBack = () => {
    setActiveButton(null);
  };

  switch (activeButton) {
    case "stock":
      return (
        <div>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <MdArrowBack size={20} />
            <span>Back to Dashboard</span>
          </button>
          <StockList />
        </div>
      );
    case "addstock":
      return (
        <div>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <MdArrowBack size={20} />
            <span>Back to Dashboard</span>
          </button>
          <StockAdd />
        </div>
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
        <Dashboard/>
      );
  }
};

function inventory() {
  const [activeButton, setActiveButton] = useState(null);

  // Handle query parameter on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const view = searchParams.get('view');
    if (view === 'stock') {
      setActiveButton('stock');
    }
  }, []);

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
          <div className="flex-1 p-5 overflow-auto rounded-[20px] border border-gray-500 m-3 bg-[#fefdfb]">
            <DashboardInvetoryContent 
              activeButton={activeButton}
              setActiveButton={setActiveButton}
            />
          </div>
        </div>
      </div>
    </Provider>
  );
}

export default inventory;
