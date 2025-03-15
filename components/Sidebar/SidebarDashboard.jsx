import React from "react";
import { TbReportSearch } from "react-icons/tb";
import { MdTask, MdOutlineBarChart } from "react-icons/md";

const SidebarDashboard = ({ activeButton, setActiveButton }) => {
  return (
    <aside className="flex-shrink-0 p-4 flex flex-col h-full">
      {/* Top spacing */}
      <div className="flex-1"></div>

      {/* Centered section */}
      <div className="bg-gray-900/40 backdrop-blur-2xl border rounded-full border-indigo-900/50 p-3 mx-auto shadow-[0_0_25px_rgba(99,102,241,0.15)]">
        <ul className="space-y-3">
          <li>
            <div
              onClick={() => setActiveButton("statistics")}
              className={`${
                activeButton === "statistics"
                  ? "bg-blue-600/30 border-blue-400/70 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                  : "border-indigo-800/50 text-gray-400 hover:bg-indigo-900/40 hover:border-indigo-600/50 hover:text-indigo-300"
              } p-2.5 rounded-full border backdrop-blur-2xl transition-all duration-300 cursor-pointer`}
            >
              <MdOutlineBarChart className="text-xl" />
            </div>
          </li>
          <li>
            <div
              onClick={() => setActiveButton("Task")}
              className={`${
                activeButton === "Task"
                  ? "bg-violet-600/30 border-violet-400/70 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]"
                  : "border-indigo-800/50 text-gray-400 hover:bg-indigo-900/40 hover:border-indigo-600/50 hover:text-indigo-300"
              } p-2.5 rounded-full border backdrop-blur-2xl transition-all duration-300 cursor-pointer`}
            >
              <MdTask className="text-xl" />
            </div>
          </li>
          <li>
            <div
              onClick={() => setActiveButton("Reports")}
              className={`${
                activeButton === "Reports"
                  ? "bg-cyan-600/30 border-cyan-400/70 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                  : "border-indigo-800/50 text-gray-400 hover:bg-indigo-900/40 hover:border-indigo-600/50 hover:text-indigo-300"
              } p-2.5 rounded-full border backdrop-blur-2xl transition-all duration-300 cursor-pointer`}
            >
              <TbReportSearch className="text-xl" />
            </div>
          </li>
        </ul>
      </div>

      {/* Bottom spacing */}
      <div className="flex-1"></div>
    </aside>
  );
};

export default SidebarDashboard;
