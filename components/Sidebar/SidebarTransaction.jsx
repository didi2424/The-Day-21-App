// components/Sidebar.jsx
import React from 'react';
import { IoIosSettings } from "react-icons/io";
import { TbHelpSquareRoundedFilled } from "react-icons/tb";
import { MdOutbox ,MdGridView, MdAdd,MdPlaylistAddCheck,MdSubject      } from "react-icons/md";


const SidebarTransaction = ({ activeButton, setActiveButton }) => {

    return (
        <aside className="w-64 flex-shrink-0 p-4 flex flex-col justify-between">
            <div>
                <h2 className="text-2xl font-bold mb-8">Transaction</h2>
                <ul className="space-y-2">
                    {/* Overview Menu */}
                    <li>
                        <a
                            href="#"
                            onClick={() => setActiveButton('transaction')}
                            className={`${activeButton === 'transaction' ? 'active' : ''} sidebar_btn`}
                        >
                            <MdSubject className="mr-2" />
                            Transaction List
                        </a>
                    </li>

                    {/* in product */}
                    <li>
                        <a
                            onClick={() => setActiveButton('Add New Transaction')} // Set activeButton to 'tracking'
                            className={`${activeButton === 'Add New Transaction' ? 'active' : ''} sidebar_btn`}

                        >
                            <MdAdd  className="mr-2" />
                            Add New Transaction
                        </a>
                    </li>

                      {/* out product */}
                      <li>
                        <a
                            onClick={() => setActiveButton('Transaction Details')} // Set activeButton to 'tracking'
                            className={`${activeButton === 'Transaction Details' ? 'active' : ''} sidebar_btn`}

                        >
                            <MdOutbox  className="mr-2" />
                            Transaction Details
                        </a>
                    </li>

                    {/* Reports Menu */}
                    <li>
                        <a
                            onClick={() => setActiveButton('reports')} // Set activeButton to 'tracking'
                            className={`${activeButton === 'reports' ? 'active' : ''} sidebar_btn`}

                        >
                            <MdPlaylistAddCheck className='mr-2'/>
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

export default SidebarTransaction;
