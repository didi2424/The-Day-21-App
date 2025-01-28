// components/Sidebar.jsx
import React from 'react';
import { IoIosSettings } from "react-icons/io";
import { TbHelpSquareRoundedFilled } from "react-icons/tb";
import { TbReportSearch } from "react-icons/tb";
import { MdMoveToInbox ,MdOutbox ,MdGridView,MdOutlineInventory, MdInventory    } from "react-icons/md";

const SidebarInventory = ({ activeButton, setActiveButton }) => {

    return (
        <aside className="w-64 flex-shrink-0 p-4 flex flex-col justify-between">
            <div>
                <h2 className="text-2xl font-bold mb-8">Inventory</h2>
                <ul className="space-y-2">
                    {/* Overview Menu */}
                    <li>
                        <a
                            href="#"
                            onClick={() => setActiveButton('stock')}
                            className={`${activeButton === 'stock' ? 'active' : ''} sidebar_btn`}
                        >
                            <MdInventory className="mr-2" />
                            Stock
                        </a>
                    </li>

                    {/* in product */}
                    <li>
                        <a
                            onClick={() => setActiveButton('receive')} // Set activeButton to 'tracking'
                            className={`${activeButton === 'receive' ? 'active' : ''} sidebar_btn`}

                        >
                            <MdMoveToInbox  className="mr-2" />
                            Receive 
                        </a>
                    </li>

                      {/* out product */}
                      <li>
                        <a
                            onClick={() => setActiveButton('issue')} // Set activeButton to 'tracking'
                            className={`${activeButton === 'issue' ? 'active' : ''} sidebar_btn`}

                        >
                            <MdOutbox  className="mr-2" />
                            Issue 
                        </a>
                    </li>

                    {/* Reports Menu */}
                    <li>
                        <a
                            onClick={() => setActiveButton('reports')} // Set activeButton to 'tracking'
                            className={`${activeButton === 'reports' ? 'active' : ''} sidebar_btn`}

                        >
                            <MdOutlineInventory className='mr-2'/>
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

export default SidebarInventory;
