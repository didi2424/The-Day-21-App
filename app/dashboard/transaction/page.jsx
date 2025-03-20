"use client";
import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../../components/NavBar/NavbarAdmin";
import Provider from "@components/Provider";
import { useSession } from "next-auth/react";
import { MdArrowBack } from "react-icons/md"; // Add this import
import SidebarTransaction from "../../../components/Sidebar/SidebarTransaction";
import TransactionAdd from "../../../components/Transaction/TransactionAdd";
import TransactionList from "../../../components/Transaction/TransactionList";
import TransactionDetail from "../../../components/Transaction/TransactionDetail/TransactionDetail";
import TransactionUpdate from "../../../components/Transaction/TransactionEdit/TransactionUpdate";

const useCountAnimation = (endValue, duration = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const startValue = 0;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        const currentCount = Math.floor(startValue + (endValue - startValue) * progress);
        setCount(currentCount);
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [endValue, duration]);

  return count;
};

const DashboardTransactionContent = ({
  activeButton,
  selectedTransactionId,
  setActiveButton,
  setSelectedTransactionId,
}) => {
  const { data: session } = useSession();
  const [totalCost, setTotalCost] = useState(0);
  const [paidTransactions, setPaidTransactions] = useState([]);
  const [unpaidTotal, setPaidTotal] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);

  const animatedTotal = useCountAnimation(totalCost);
  const animatedPaid = useCountAnimation(totalPaid);
  const animatedUnpaid = useCountAnimation(unpaidTotal);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions with consistent parameter naming
        const transactionResponse = await fetch('/api/transaction/hardware');
        const transactionData = await transactionResponse.json();
        
        const transactions = Array.isArray(transactionData) ? transactionData : [transactionData];
        
        // Update payment fetch to use consistent parameter
        const paymentsResponse = await fetch('/api/payment');
        const paymentsData = await paymentsResponse.json();

        // Update serviceId references to be consistent
        const paidServiceIds = paymentsData.map(payment => payment.transaction._id);
        const paidTransactions = transactions.filter(transaction => 
          paidServiceIds.includes(transaction.serviceId)
        );

        // Calculate totals
        const grandTotal = transactions.reduce((sum, transaction) => 
          sum + (transaction.totalCost || 0), 0
        );
        const paidAmount = paidTransactions.reduce((sum, transaction) => 
          sum + (transaction.totalCost || 0), 0
        );

        setTotalCost(grandTotal);
        setPaidTransactions(paidTransactions);
        setTotalPaid(paidAmount);
        setPaidTotal(grandTotal - paidAmount);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (!activeButton) {
      fetchData();
    }
  }, [activeButton]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const view = searchParams.get("view");
    const id = searchParams.get("id"); // Use 'id' consistently

    if (view === "transaction") {
      setActiveButton("transaction");
    } else if (id) {
      setActiveButton("Transaction Details");
      setSelectedTransactionId(id);
    }
  }, []);

  switch (activeButton) {
    case "transaction":
      return (
        
        <TransactionList
          setActiveButton={setActiveButton}
          setSelectedTransactionId={setSelectedTransactionId}
        />
      );

    case "Add New Transaction":
      return <TransactionAdd />;

    case "Transaction Details":
      return selectedTransactionId ? (
        <div className="w-full">
          <button
            onClick={() => {
              setActiveButton("transaction");
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

    case "Transaction Update":
      return (
        <TransactionUpdate
          setActiveButton={setActiveButton}
          selectedTransactionId={selectedTransactionId}
        />
      );

    case "Help Center":
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
              <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Welcome {session?.user.name}
                </h1>
                <p className="mt-2 text-gray-400">
                  Welcome to your transaction dashboard. Here's your overview:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-xl p-6 shadow-lg border border-purple-500/20">
                  <h2 className="text-lg font-semibold text-purple-300 mb-4">Transaction Overview</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Transactions</span>
                      <span className="text-2xl font-bold text-white">{paidTransactions.length}</span>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Bruto</span>
                      <span className="text-2xl font-bold text-white">
                        Rp {animatedTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 rounded-xl p-6 shadow-lg border border-cyan-500/20">
                  <h2 className="text-lg font-semibold text-cyan-300 mb-4">Payment Status</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Paid</span>
                      <span className="text-2xl font-bold text-green-400">
                        Rp {animatedPaid.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Unpaid Amount</span>
                      <span className="text-2xl font-bold text-red-400">
                        Rp {animatedUnpaid.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-300">Payment Progress</h2>
                  <span className="text-sm text-gray-400">
                    {Math.round((totalPaid / totalCost) * 100)}% Complete
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
                    style={{ width: `${(totalPaid / totalCost) * 100}%` }}
                  />
                </div>
              </div>
            </>
          ) : (
            <h1>Login</h1>
          )}
        </Provider>
      );
  }
};

// Update URL parameter handling in payments function
function payments() {
  const [activeButton, setActiveButton] = useState(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  // Handle query parameter on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const view = searchParams.get("view");
    const id = searchParams.get("id"); // Changed from 'serviceId' to 'id'

    if (view === "transaction") {
      setActiveButton("transaction");
    } else if (id) { // Updated condition
      setActiveButton("Transaction Details");
      setSelectedTransactionId(id); // Using consistent naming
    }
  }, []);

  const getBreadcrumb = () => {
    const basePath = "Dashboard > Transaction";
    if (!activeButton) return basePath;
    return `${basePath} > ${
      activeButton.charAt(0).toUpperCase() + activeButton.slice(1)
    }`;
  };

  return (
    <Provider>
      <div className="h-screen flex flex-col w-full bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <header className="p-4 ">
          <NavbarAdmin />
        </header>
        <div className="justify-between flex pr-4 pl-4 py-2 text-cyan-400">
          <div className="text-sm">{getBreadcrumb()}</div>
          <div></div>
        </div>
        <div className="flex flex-1">
          <SidebarTransaction
            activeButton={activeButton}
            setActiveButton={setActiveButton}
          />
          <div className="flex-1 p-5 overflow-auto rounded-[20px] border border-purple-500/30 m-3 bg-slate-900/70 backdrop-blur-xl shadow-lg shadow-purple-500/10 text-white">
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
