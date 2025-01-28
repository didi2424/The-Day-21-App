// components/Sidebar.jsx
import React from 'react';
import { IoIosSettings } from "react-icons/io";
import { TbHelpSquareRoundedFilled } from "react-icons/tb";
import { TbReportSearch } from "react-icons/tb";
import { MdTask,MdOutlineBarChart  } from "react-icons/md";

const SidebarDashboard = ({ activeButton, setActiveButton }) => {

    return (
        <aside className="w-64 flex-shrink-0 p-4 flex flex-col justify-between">
            <div>
                <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
                <ul className="space-y-2">
                    {/* Overview Menu */}
                    <li>
                        <a
                            href="#"
                            onClick={() => setActiveButton('statistics')}
                            className={`${activeButton === 'statistics' ? 'active' : ''} sidebar_btn`}
                        >
                            <MdOutlineBarChart className="mr-2" />
                            Statistics
                        </a>
                    </li>

                    {/* Orders Menu */}
                    <li>
                        <a
                            onClick={() => setActiveButton('Task')} // Set activeButton to 'tracking'
                            className={`${activeButton === 'Task' ? 'active' : ''} sidebar_btn`}

                        >
                            <MdTask className="mr-2" />
                            Task
                        </a>
                    </li>

                    {/* Reports Menu */}
                    <li>
                        <a
                            onClick={() => setActiveButton('Reports')} // Set activeButton to 'tracking'
                            className={`${activeButton === 'Reports' ? 'active' : ''} sidebar_btn`}

                        >
                            <TbReportSearch className='mr-2'/>
                            Reports
                        </a>
                    </li>
                </ul>
            </div>

            {/* Settings Menu at the Bottom */}
            <div className="mt-auto space-y-2">
                
                <a
                    onClick={() => setActiveButton('Help Center')} // Set activeButton to 'tracking'
                    className={`${activeButton === 'Help Center' ? 'active' : ''} sidebar_btn`}

                >
                    <TbHelpSquareRoundedFilled className="mr-2" />
                    Help Center
                </a>
                <a
                    onClick={() => setActiveButton('Settings')} // Set activeButton to 'tracking'
                    className={`${activeButton === 'Settings' ? 'active' : ''} sidebar_btn`}

                >
                    <IoIosSettings className="mr-2" />
                    Settings
                </a>


            </div>
        </aside>
    );
};

export default SidebarDashboard;
