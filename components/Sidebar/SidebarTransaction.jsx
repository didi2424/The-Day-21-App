import React from 'react';
import { IoIosSettings } from "react-icons/io";
import { TbHelpSquareRoundedFilled } from "react-icons/tb";
import { MdOutbox, MdAdd, MdSubject, MdPlaylistAddCheck,MdInsertDriveFile  } from "react-icons/md";

const SidebarTransaction = ({ activeButton, setActiveButton }) => {
    return (
        <aside className="flex-shrink-0 p-4 flex flex-col h-full">
            {/* Top spacing */}
            <div className="flex-1"></div>

            {/* Centered section */}
            <div className='bg-[#efefef] p-3 rounded-full mx-auto shadow-md'>
                <ul className="space-y-2">
                    <li>
                        <div
                            onClick={() => setActiveButton('transaction')}
                            className={`${activeButton === 'transaction' ? 'active' : ''} sidebar_btnnew`}
                        >
                            <MdSubject className="text-xl" />
                        </div>
                    </li>
                    <li>
                        <div
                            onClick={() => setActiveButton('Add New Transaction')}
                            className={`${activeButton === 'Add New Transaction' ? 'active' : ''} sidebar_btnnew`}
                        >
                            <MdAdd className="text-xl" />
                        </div>
                    </li>
                    <li>
                        <div
                            onClick={() => setActiveButton('Transaction Details')}
                            className={`${activeButton === 'Transaction Details' ? 'active' : ''} sidebar_btnnew`}
                        >
                            <MdInsertDriveFile className="text-xl" />
                        </div>
                    </li>
                    <li>
                        <div
                            onClick={() => setActiveButton('Transaction Update')}
                            className={`${activeButton === 'Transaction Update' ? 'active' : ''} sidebar_btnnew`}
                        >
                            <MdPlaylistAddCheck className='text-xl'/>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Bottom spacing */}
            <div className="flex-1"></div>

            {/* Settings Menu at the Bottom */}
            <div className="space-y-2">
                <a
                    onClick={() => setActiveButton('Help Center')}
                    className={`${activeButton === 'Help Center' ? 'active' : ''} sidebar_btnnew`}
                >
                    <TbHelpSquareRoundedFilled className="mr-2" />
                    Help Center
                </a>
                <a
                    onClick={() => setActiveButton('Settings')}
                    className={`${activeButton === 'Settings' ? 'active' : ''} sidebar_btnnew`}
                >
                    <IoIosSettings className="mr-2" />
                    Settings
                </a>
            </div>
        </aside>
    );
};

export default SidebarTransaction;
