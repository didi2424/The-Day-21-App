"use client";
import React, { useState } from "react";
import Provider from "@components/Provider";
import { useSession } from "next-auth/react";

import InventoryCard from "./CardInventory/InventoryCard";
import SvgIcon from "./Drawyer/Drawyer5x5";

const Dashboard = () => {
  const { data: session } = useSession();
  const [hoveredGroup, setHoveredGroup] = useState("Not Selected");
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

  return (
    <div className="">
      <Provider>
        {session?.user ? (
          <>
            {/* Cards Section */}
            <section className="space-y-4   ">
              <h1 className="text-3xl font-bold">Inventory Assets</h1>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <div className="bg-[#f7f7f7] p-4 rounded-md">
                    <div className="grid grid-cols-3 gap-4">
                      {inventoryData.map((data, index) => (
                        <InventoryCard key={index} {...data} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="bg-[#feffff] p-4 rounded-md h-full">
                    <h2 className="text-xl font-bold text-black">AI assistance</h2>
                  </div>
                </div>
              </div>
            </section>

            {/* Drawer Section */}
            <section className="space-y-4 ">
              <h2 className="text-2xl font-bold">Drawyer</h2>
              <div className="flex justify-center items-start gap-8">
                <div className="text-4xl font-bold">D1</div>
                <div className="w-[500px] h-[400px] flex justify-center items-center">
                  <SvgIcon setHoveredGroup={setHoveredGroup} />
                </div>
                <div className="w-[250px] space-y-6">
                  <div className="space-y-2">
                    <p className="text-sm font-light">Drawyer Number:</p>
                    <p className="text-sm font-medium">{hoveredGroup}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-light">What is in Drawyer:</p>
                    <p className="text-sm font-medium">Type: Voltage Regulator</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'APW7142', count: 3 },
                      { name: 'APW8722', count: 5 },
                      { name: 'NCP5230', count: 6 }
                    ].map((item, index) => (
                      <div key={index} className="bg-black text-white px-2 py-1 rounded-full flex items-center gap-2">
                        <span className="text-xs">{item.name}</span>
                        <span className="bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="flex justify-center items-center h-full">
            <h1 className="text-2xl font-bold">Please Login to Continue</h1>
          </div>
        )}
      </Provider>
    </div>
  );
};

export default Dashboard;