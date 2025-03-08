import React from 'react';
import { TbReportSearch } from "react-icons/tb";
import { MdOutbox, MdGridView, MdPersonAdd } from "react-icons/md";

const SidebarConstumers = ({ activeButton, setActiveButton }) => {
    return (
        <aside className="flex-shrink-0 p-4 flex flex-col h-full">
            {/* Top spacing */}
            <div className="flex-1"></div>

            {/* Centered section */}
            <div className='bg-[#efefef] p-3 rounded-full mx-auto shadow-md'>
                <ul className="space-y-2">
                    <li>
                        <div
                            onClick={() => setActiveButton('Customer List')}
                            className={`${activeButton === 'Customer List' ? 'active' : ''} sidebar_btnnew`}
                        >
                            <MdGridView className="text-xl" />
                        </div>
                    </li>
                    <li>
                        <div
                            onClick={() => setActiveButton('Add New Customer')}
                            className={`${activeButton === 'Add New Customer' ? 'active' : ''} sidebar_btnnew`}
                        >
                            <MdPersonAdd className="text-xl" />
                        </div>
                    </li>
                    <li>
                        <div
                            onClick={() => setActiveButton('Customer Profile')}
                            className={`${activeButton === 'Customer Profile' ? 'active' : ''} sidebar_btnnew`}
                        >
                            <MdOutbox className="text-xl" />
                        </div>
                    </li>
                    <li>
                        <div
                            onClick={() => setActiveButton('Service History')}
                            className={`${activeButton === 'Service History' ? 'active' : ''} sidebar_btnnew`}
                        >
                            <TbReportSearch className='text-xl'/>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Bottom spacing */}
            <div className="flex-1"></div>

          
        </aside>
    );
};

export default SidebarConstumers;
