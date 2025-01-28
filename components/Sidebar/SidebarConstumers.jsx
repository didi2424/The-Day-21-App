// components/Sidebar.jsx
import React from 'react';
import { IoIosSettings } from "react-icons/io";
import { TbHelpSquareRoundedFilled } from "react-icons/tb";
import { TbReportSearch } from "react-icons/tb";
import { MdOutbox ,MdGridView, MdPersonAdd,   } from "react-icons/md";
const SidebarConstumers = ({ activeButton, setActiveButton }) => {

    return (
        <aside className="w-64 flex-shrink-0 p-4 flex flex-col justify-between">
            <div>
                <h2 className="text-2xl font-bold mb-8">Customers</h2>
                <ul className="space-y-2">
                    {/* Overview Menu */}
                    <li>
                        <a
                            href="#"
                            onClick={() => setActiveButton('Customer List')}
                            className={`${activeButton === 'Customer List' ? 'active' : ''} sidebar_btn`}
                        >
                            <MdGridView className="mr-2" />
                            Customer List
                        </a>
                    </li>

                    {/* in product */}
                    <li>
                        <a
                            onClick={() => setActiveButton('Add New Customer')} // Set activeButton to 'tracking'
                            className={`${activeButton === 'Add New Customer' ? 'active' : ''} sidebar_btn`}

                        >
                            <MdPersonAdd  className="mr-2" />
                            Add New Customer 
                        </a>
                    </li>

                      {/* out product */}
                      <li>
                        <a
                            onClick={() => setActiveButton('Customer Profile')} // Set activeButton to 'tracking'
                            className={`${activeButton === 'Customer Profile' ? 'active' : ''} sidebar_btn`}

                        >
                            <MdOutbox  className="mr-2" />
                            Customer Profile 
                        </a>
                    </li>

                    {/* Reports Menu */}
                    <li>
                        <a
                            onClick={() => setActiveButton('Service History')} // Set activeButton to 'tracking'
                            className={`${activeButton === 'Service History' ? 'active' : ''} sidebar_btn`}

                        >
                            <TbReportSearch className='mr-2'/>
                            Service History 
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

export default SidebarConstumers;
