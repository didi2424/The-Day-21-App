import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { MdPersonSearch, MdOutlineTimelapse, MdClose } from "react-icons/md";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { FaTrash } from "react-icons/fa";

const TransactionList = ({ setActiveButton, setSelectedTransactionId }) => { // Add these props
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(7);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/transaction?page=${currentPage}&pageSize=${pageSize}`
      );
      if (!response.ok) throw new Error("Failed to fetch transactions");
      
      const data = await response.json();
      setTransactions(data.transactions);
      setTotalTransactions(data.totalTransactions);
      setTotalPages(Math.ceil(data.totalTransactions / pageSize));
    } catch (error) {
      setError(error.message);
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  // Search function
  const searchTransactions = useCallback(async () => {
    if (!debouncedSearchTerm) {
      return fetchTransactions();
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/transaction/search?term=${encodeURIComponent(debouncedSearchTerm)}&page=${currentPage}&pageSize=${pageSize}`
      );
      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      setTransactions(data.transactions);
      setTotalTransactions(data.totalTransactions);
      setTotalPages(Math.ceil(data.totalTransactions / pageSize));
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search transactions");
    } finally {
      setIsSearching(false);
    }
  }, [debouncedSearchTerm, currentPage, pageSize, fetchTransactions]);

  useEffect(() => {
    searchTransactions();
  }, [debouncedSearchTerm, currentPage, searchTransactions]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleNext = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);
  const handleBack = () => currentPage > 1 && setCurrentPage(prev => prev - 1);

  const handleViewDetails = (transactionId) => {
    // Instead of navigating to a new route, update the parent state
    setSelectedTransactionId(transactionId);
    setActiveButton('Transaction Details');
  };

  const handleEdit = (transaction) => {
    setSelectedTransactionId(transaction._id);
    setActiveButton('Transaction Update');
  };

  const handleDelete = async (transactionId) => {
    try {
      const response = await fetch(`/api/transaction/${transactionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Transaction deleted successfully');
        setShowDeleteModal(false);
        setTransactionToDelete(null);
        // Refresh the transactions list
        fetchTransactions();
      } else {
        throw new Error('Failed to delete transaction');
      }
    } catch (error) {
      toast.error('Failed to delete transaction');
      console.error('Delete error:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const getImageUrl = (imageData) => {
    if (!imageData) return '/placeholder.jpg';
    if (imageData.startsWith('data:image')) {
      return imageData;
    }
    // If it's not a base64 image, assume it's a URL
    return imageData;
  };

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Transaction List</h2>

          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by service number or customer name..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 p-1 rounded-full"
              >
                <MdClose className="text-gray-500 text-xl hover:text-gray-700" />
              </button>
            )}
            {isSearching ? (
              <MdOutlineTimelapse className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"/>
            ) : (
              <MdPersonSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"/>
            )}
          </div>
        </div>

        <p>Total transactions: {totalTransactions}</p>

        <ul>
          {transactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            transactions.map((transaction) => {


              return (
                <li key={transaction._id}>
                  <div className="flex flex-col pl-3 sm:flex-row rounded-lg shadow-sm h-31 pt-3 pb-3 mt-3">
                    {/* Main Image Section - Updated */}
                    <div className="flex-none w-16 mr-4">
                      {transaction.images?.main ? (
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getImageUrl(transaction.images.main.imageData)}
                            alt="Main device"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Service Info Section */}
                    <div className="flex-1 flex gap-4 items-center">
                      <div className="flex flex-col">
                        <h3 className="font-satoshi font-semibold text-gray-900">
                          {transaction.serviceNumber}
                        </h3>
                        <p className="font-inter text-sm text-gray-500">
                          {transaction.deviceModel}
                        </p>
                      </div>
                    </div>

                    {/* Customer Info Section - Updated */}
                    <div className="flex-1">
                      <div className="font-satoshi text-sm text-gray-700">
                        {transaction.customer?.constumer_name}
                      </div>
                      <p className="font-inter text-sm text-gray-500">
                        {transaction.customer?.wa_number}
                      </p>
                    </div>

                    {/* Issues Section */}
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-1">
                        {transaction.selectedIssues?.map((issue, index) => (
                          <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {issue.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Status and Date */}
                    <div className="flex-1 flex justify-center flex-col">
                      <p className={`font-medium text-sm ${
                        transaction.status === 'pending' ? 'text-yellow-500' :
                        transaction.status === 'in-progress' ? 'text-blue-500' :
                        transaction.status === 'completed' ? 'text-green-500' :
                        'text-red-500'
                      }`}>
                        {transaction.status}
                      </p>
                      <p className="font-satoshi text-xs text-gray-400">
                        {format(new Date(transaction.createdAt), "MMM dd, yyyy HH:mm")}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex-1 flex gap-2 items-center justify-end">
                      <button 
                        onClick={() => handleViewDetails(transaction._id)}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Details
                      </button>
                      <button 
                        onClick={() => handleEdit(transaction)}
                  
                        className="px-3 py-1 text-sm bg-[#b9ec8f] text-white rounded-md hover:bg-[#a5d880]"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => {
                          setTransactionToDelete(transaction);
                          setShowDeleteModal(true);
                        }}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete service number{" "}
                <span className="font-semibold">{transactionToDelete?.serviceNumber}</span>?
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setTransactionToDelete(null);
                  }}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(transactionToDelete?._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-4">
          <p className="mt-2 text-sm">
            Page {currentPage} of {totalPages}
          </p>
          <div className="gap-4 flex">
            <button
              onClick={handleBack}
              disabled={currentPage === 1}
              className={`next_btn ${currentPage === 1 ? "cursor-not-allowed opacity-50" : "hover:bg-[#b9ec8f]"}`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`next_btn ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : "hover:bg-[#b9ec8f]"}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    
    </>
  );
};

export default TransactionList;
