import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { MdPersonSearch, MdOutlineTimelapse, MdClose, MdFilterList } from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";

const TransactionList = ({ setActiveButton, setSelectedTransactionId }) => {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // Add status filter options
  const statusFilters = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Waiting Parts', value: 'waiting-parts' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  // Add dropdown state
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const handleStatusFilter = (status) => {
    setSearchTerm(status);
    setCurrentPage(1);
  };

  const formatPhoneNumber = (number) => {
    if (!number) return "";
    let cleanedNumber = number.replace(/\D/g, "");
    if (cleanedNumber.startsWith("0")) {
      cleanedNumber = "+62" + cleanedNumber.substring(1);
    } else if (!cleanedNumber.startsWith("+")) {
      cleanedNumber = "+62" + cleanedNumber;
    }
    return cleanedNumber;
  };

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

      const transactionsWithDetails = await Promise.all(
        data.transactions.map(async (transaction) => {
          const [hardwareResponse, paymentResponse] = await Promise.all([
            fetch(`/api/transaction/hardware/byService/${transaction._id}`),
            fetch(`/api/payment?transactionId=${transaction._id}`),
          ]);

          const [hardwareData, paymentData] = await Promise.all([
            hardwareResponse.json(),
            paymentResponse.json(),
          ]);

          return {
            ...transaction,
            hardwareData,
            payment: paymentData,
          };
        })
      );

      setTransactions(transactionsWithDetails);
      setTotalTransactions(data.totalTransactions);
      setTotalPages(Math.ceil(data.totalTransactions / pageSize));
    } catch (error) {
      setError(error.message);
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  const searchTransactions = useCallback(async () => {
    if (!debouncedSearchTerm) {
      return fetchTransactions();
    }

    setIsSearching(true);
    try {
      const statusKeywords = ['completed', 'pending', 'in-progress', 'waiting-parts', 'cancelled'];
      const searchStatus = statusKeywords.find(status => 
        debouncedSearchTerm.toLowerCase().includes(status)
      );

      const response = await fetch(
        `/api/transaction/search?term=${encodeURIComponent(debouncedSearchTerm)}${
          searchStatus ? `&status=${searchStatus}` : ''
        }&page=${currentPage}&pageSize=${pageSize}`
      );
      
      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();

      const transactionsWithDetails = await Promise.all(
        data.transactions.map(async (transaction) => {
          const [hardwareResponse, paymentResponse] = await Promise.all([
            fetch(`/api/transaction/hardware/byService/${transaction._id}`),
            fetch(`/api/payment?transactionId=${transaction._id}`),
          ]);

          const [hardwareData, paymentData] = await Promise.all([
            hardwareResponse.json(),
            paymentResponse.json(),
          ]);

          return {
            ...transaction,
            hardwareData,
            payment: paymentData,
          };
        })
      );

      setTransactions(transactionsWithDetails);
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

  const handleNext = () =>
    currentPage < totalPages && setCurrentPage((prev) => prev + 1);
  const handleBack = () =>
    currentPage > 1 && setCurrentPage((prev) => prev - 1);

  const handleViewDetails = (transactionId) => {
    setSelectedTransactionId(transactionId);
    setActiveButton("Transaction Details");
  };

  const handleEdit = (transaction) => {
    setSelectedTransactionId(transaction._id);
    setActiveButton("Transaction Update");
  };

  const handleDelete = async (transactionId) => {
    try {
      const response = await fetch(`/api/transaction/${transactionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Transaction deleted successfully");
        setShowDeleteModal(false);
        setTransactionToDelete(null);
        fetchTransactions();
      } else {
        throw new Error("Failed to delete transaction");
      }
    } catch (error) {
      toast.error("Failed to delete transaction");
      console.error("Delete error:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const getImageUrl = (imageData) => {
    if (!imageData) return "/placeholder.jpg";
    if (imageData.startsWith("data:image")) {
      return imageData;
    }
    return imageData;
  };

  const formatCurrency = (amount) => {
    return `Rp ${amount?.toLocaleString("id-ID")}`;
  };

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className=" ">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-800/20 to-pink-900/20" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[700px] h-[700px] bg-pink-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
      </div>
      <div className=" mx-auto p-4">
        {/* Header Section */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 mb-6 shadow-lg relative z-50">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Transaction List
              </h2>
              <div className="flex gap-2 items-center">
                {/* Status Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="px-4 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 
                      hover:bg-gray-700/50 focus:outline-none flex items-center gap-2"
                  >
                    <MdFilterList className="text-xl" />
                    <span>
                      {statusFilters.find(f => f.value === searchTerm)?.label || 'Filter Status'}
                    </span>
                  </button>
                  
                  {showStatusDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 h-full w-full z-[60]"
                        onClick={() => setShowStatusDropdown(false)}
                      />
                      <div className="absolute right-0 mt-2 py-2 w-48 bg-gray-800/90 backdrop-blur-xl 
                        rounded-xl border border-gray-700/50 shadow-lg z-[70]">
                        {statusFilters.map((filter) => (
                          <button
                            key={filter.value}
                            onClick={() => {
                              handleStatusFilter(filter.value);
                              setShowStatusDropdown(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm transition-colors
                              ${searchTerm === filter.value
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'text-gray-300 hover:bg-gray-700/50'
                              }`}
                          >
                            {filter.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Search Input */}
                <div className="relative w-full md:w-96">
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 
                    focus:outline-none backdrop-blur-xl"
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
                    <MdOutlineTimelapse className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                  ) : (
                    <MdPersonSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl border border-gray-700/50 overflow-hidden">
          <ul className="divide-y divide-gray-700/50">
            {transactions.length === 0 ? (
              <p className="text-center py-4 text-gray-400">
                No transactions found.
              </p>
            ) : (
              transactions.map((transaction) => (
                <li
                  key={transaction._id}
                  className="group hover:bg-gray-800/50 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Glow effect on hover */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300"
                  />

                  <div className="relative flex items-center px-4 py-4 gap-4">
                    {/* Image Column */}
                    <div className="flex-shrink-0">
                      {transaction.images?.main ? (
                        <div
                          className="w-14 h-14 rounded-lg overflow-hidden border border-gray-700/50 
                          ring-2 ring-gray-700/50 group-hover:ring-blue-500/50 transition-all duration-300"
                        >
                          <img
                            src={getImageUrl(transaction.images.main.imageData)}
                            alt="Device"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center 
                          border border-gray-700/50"
                        >
                          <span className="text-xs text-gray-500">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Service Info Column */}
                    <div className="min-w-[160px]">
                      <h3 className="text-sm font-medium text-blue-400">
                        {transaction.serviceNumber}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {transaction.deviceModel}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Customer Info Column */}
                      <div className="min-w-[130px]">
                        <p className="text-sm font-medium text-gray-100">
                          {transaction.customer?.constumer_name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {transaction.customer?.wa_number}
                        </p>
                      </div>

                      {/* ButtonChat */}
                      <div className="min-w-[80px]">
                        <p className="text-xs text-gray-100">Message</p>
                        {transaction.customer?.wa_number && (
                          <a
                            href={`https://wa.me/${formatPhoneNumber(
                              transaction.customer.wa_number
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-400 hover:underline"
                          >
                            Chat
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Issues Column */}
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex flex-wrap gap-1.5">
                        {transaction.selectedIssues
                          ?.slice(0, 3)
                          .map((issue, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 text-xs font-medium bg-gray-700/50 text-blue-300 
                              rounded-full border border-gray-600/50 backdrop-blur-xl"
                            >
                              {issue.label}
                            </span>
                          ))}
                        {transaction.selectedIssues?.length > 2 && (
                          <span
                            className="px-2 py-0.5 text-xs font-medium bg-gray-700/50 text-purple-300 
                            rounded-full border border-gray-600/50"
                          >
                            +{transaction.selectedIssues.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Column */}
                    <div className="w-28 text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full backdrop-blur-xl ${
                          transaction.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-300 border border-yellow-500/50"
                            : transaction.status === "in-progress"
                            ? "bg-blue-500/10 text-blue-300 border border-blue-500/50"
                            : transaction.status === "waiting-parts"
                            ? "bg-orange-500/10 text-orange-300 border border-orange-500/50"
                            : transaction.status === "completed"
                            ? "bg-green-500/10 text-green-300 border border-green-500/50"
                            : "bg-red-500/10 text-red-300 border border-red-500/50"
                        }`}
                      >
                        {transaction.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(
                          new Date(transaction.createdAt),
                          "MMM dd, HH:mm"
                        )}
                      </p>
                    </div>

                    {/* Price Column */}
                    <div className=" w-40 flex items-center justify-between gap-2 ">
                      <div className="flex text-sm font-medium text-purple-400">
                        {formatCurrency(
                          transaction.hardwareData?.totalCost || 0
                        )}
                      </div>

                      <div
                        className={` flex w-20 text-center justify-center px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.payment?.status === "paid"
                            ? "bg-green-500/10 text-green-300 border border-green-500/50"
                            : transaction.payment?.status === "partial"
                            ? "bg-yellow-500/10 text-yellow-300 border border-yellow-500/50"
                            : "bg-red-500/10 text-red-300 border border-red-500/50"
                        }`}
                      >
                        {transaction.payment?.status || "unpaid"}
                      </div>
                    </div>

                    {/* Actions Column */}
                    <div className="w-36 flex justify-end gap-2">
                      <button
                        onClick={() => handleViewDetails(transaction._id)}
                        className="px-3 py-1.5 text-xs font-medium text-blue-300 bg-blue-500/10 
                          rounded border border-blue-500/50 hover:bg-blue-500/20 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="px-3 py-1.5 text-xs font-medium text-purple-300 bg-purple-500/10 
                          rounded border border-purple-500/50 hover:bg-purple-500/20 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setTransactionToDelete(transaction);
                          setShowDeleteModal(true);
                        }}
                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className=" max-w-md w-full mx-4 bg-white/1 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg  ">
              <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
              <p className="text-white mb-6">
                Are you sure you want to delete service number{" "}
                <span className="font-semibold">
                  {transactionToDelete?.serviceNumber}
                </span>
                ? This action cannot be undone.
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

        {/* Pagination */}
        <div
          className="mt-6 flex items-center justify-between bg-gray-800/50 backdrop-blur-xl 
          rounded-xl border border-gray-700/50 p-4"
        >
          <p className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
                ${
                  currentPage === 1
                    ? "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                    : "bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 border border-blue-500/50"
                }`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
                ${
                  currentPage === totalPages
                    ? "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                    : "bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 border border-blue-500/50"
                }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
