'use client'
import React, { useState, useEffect } from 'react'
import NavbarAdmin from '../../../components/NavBar/NavbarAdmin'
import Provider from "@components/Provider";
import { useSession } from 'next-auth/react';
import SidebarTransaction from '../../../components/Sidebar/SidebarTransaction';

const DashboardTransactionContent = ({ activeButton, }) => {
    const { data: session } = useSession();
    switch (activeButton) {
        case 'transaction':
            return (
                <div>
                    <h2 className="text-2xl font-bold">Transaction List</h2>
                    <p>Here are your transaction data...</p>
                    {/* Add your statistics content here */}
                </div>
            );
        case 'Add New Transaction':
            return (
                <div>
                    <h2 className="text-2xl font-bold">Add New Transaction</h2>
                    <p>Add New Transaction...</p>
                    {/* Add your task content here */}
                </div>
            );
        case 'Transaction Details':
            return (
                <div>
                    <h2 className="text-2xl font-bold">Transaction Details</h2>
                    <p>Transaction Detailss...</p>
                    {/* Add your reports content here */}
                </div>
            );
        case 'reports':
            return (
                <div>
                    <h2 className="text-2xl font-bold">Stock Report</h2>
                    <p>Configure your settings...</p>
                    {/* Add your settings content here */}
                </div>
            );
        case 'Help Center':
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
                            <h1 className="text-3xl font-bold">Welcome {session?.user.name}</h1>
                            <p className="mt-4">Welcome to your transaction. Choose a menu item to get started.</p>
                        </>
                    ) : (
                        <h1>Login</h1>
                    )}
                </Provider>
            );
    }
}

function payments() {
    // State to track the active button
    const [activeButton, setActiveButton] = useState(null);

    const getBreadcrumb = () => {
        const basePath = 'Dashboard > Transaction';
        if (!activeButton) return basePath; // Just show the base path if no submenu is selected
        return `${basePath} > ${activeButton.charAt(0).toUpperCase() + activeButton.slice(1)}`; // Capitalize the active button name
    };



    return (
        <Provider>
            <div className="h-screen flex flex-col w-full">
                {/* Navbar */}
                <header className="p-4">

                    <NavbarAdmin />

                </header>
                <div className='justify-between flex pr-4 pl-4'>
                <div className="text-sm">
                        {getBreadcrumb()}
                    </div>

                    <div>
                        
                    </div>
                </div>
                {/* Main Content (Flex container) */}
                <div className="flex flex-1">
                    {/* Sidebar */}
                    <SidebarTransaction
                        activeButton={activeButton}
                        setActiveButton={setActiveButton}
                    />

                    {/* Main Content Section */}
                    <div className="flex-1 p-8 overflow-auto rounded-[20px] border border-gray-500 m-3 bg-[#fefdfb]">
                        <DashboardTransactionContent activeButton={activeButton} />
                    </div>
                </div>
            </div>
        </Provider>
    );
}

export default payments;