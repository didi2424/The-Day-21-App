'use client'
import React, { useState, useEffect } from 'react'
import NavbarAdmin from '../../../components/NavBar/NavbarAdmin'
import Provider from "@components/Provider";
import { useSession } from 'next-auth/react';
import { MdArrowBack } from "react-icons/md"; // Add this import
import SidebarTransaction from '../../../components/Sidebar/SidebarTransaction';
import TransactionAdd from '../../../components/Transaction/TransactionAdd';	
import TransactionList from '../../../components/Transaction/TransactionList';
import TransactionDetail from '../../../components/Transaction/TransactionDetail';
import TransactionUpdate from '../../../components/Transaction/TransactionUpdate';

const DashboardTransactionContent = ({ activeButton, selectedTransactionId, setActiveButton, setSelectedTransactionId }) => {
    const { data: session } = useSession();
    
    switch (activeButton) {
        case 'transaction':
            return <TransactionList 
              setActiveButton={setActiveButton}
              setSelectedTransactionId={setSelectedTransactionId}
            />;
            
        case 'Add New Transaction':
            return <TransactionAdd />;
            
        case 'Transaction Details':
            return selectedTransactionId ? (
                <div className="w-full">
                    <button
                        onClick={() => {
                            setActiveButton('transaction');
                            setSelectedTransactionId(null);
                        }}
                        className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <MdArrowBack className="mr-2" />
                        Back to Transaction List
                    </button>
                    <TransactionDetail transactionId={selectedTransactionId} />
                </div>
            ) : (
                <div>
                   <h2 className="text-2xl font-bold">Transaction Details</h2>
                   <p className="text-gray-500 mt-2">Please select a transaction</p>
                </div>
            );

        case 'Transaction Update':
            return <TransactionUpdate 
                setActiveButton={setActiveButton} 
                selectedTransactionId={selectedTransactionId}
            />;
            
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
    const [activeButton, setActiveButton] = useState(null);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);

    // Handle query parameter on component mount
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const view = searchParams.get('view');
        const transactionId = searchParams.get('id');
        
        if (view === 'transaction') {
            setActiveButton('transaction');
        } else if (transactionId) {
            setActiveButton('Transaction Details');
            setSelectedTransactionId(transactionId);
        }
    }, []);

    const getBreadcrumb = () => {
        const basePath = 'Dashboard > Transaction';
        if (!activeButton) return basePath;
        return `${basePath} > ${activeButton.charAt(0).toUpperCase() + activeButton.slice(1)}`;
    };

    return (
        <Provider>
            <div className="h-screen flex flex-col w-full">
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
                <div className="flex flex-1">
                    <SidebarTransaction
                        activeButton={activeButton}
                        setActiveButton={setActiveButton}
                    />
                    <div className="flex-1 p-5 overflow-auto rounded-[20px] border border-gray-500 m-3 bg-[#fefdfb]">
                        <DashboardTransactionContent 
                            activeButton={activeButton}
                            selectedTransactionId={selectedTransactionId}
                            setActiveButton={setActiveButton}
                            setSelectedTransactionId={setSelectedTransactionId}
                        />
                    </div>
                </div>
            </div>
        </Provider>
    );
}

export default payments;