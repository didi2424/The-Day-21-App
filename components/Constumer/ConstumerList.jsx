import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns"; // Import format for date formatting
import { toast } from "react-toastify";
import EditModal from "./EditModal"; // Import modal
import "react-toastify/dist/ReactToastify.css";
import AddressPrint from "./AddressPrint";
import { MdPersonSearch, MdOutlineTimelapse, MdClose } from "react-icons/md";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Page number
  const [pageSize] = useState(6); // Number of customers per page
  const [totalCustomers, setTotalCustomers] = useState(0); // Total customer count
  const [totalPages, setTotalPages] = useState(1); // Total number of pages

  const [isModalOpen, setIsModalOpen] = useState(false); // To toggle the modal visibility

  const [selectedCustomer, setSelectedCustomer] = useState(null); // To store the selected customer for editing

  // State to store which customer's tooltip is visible
  const [activeTooltipId, setActiveTooltipId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [transaction, setTransaction] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };


  const formatWarranty = (months) => {
    return `${months} Month${months > 1 ? 's' : ''}`;
  };

  const calculateItemTotal = (item) => {
    const subtotal = item.price * item.quantity;
    return subtotal - (subtotal * (item.discount || 0) / 100);
  };
  const handleDelete = async (customer) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this customer?"
    );
    if (hasConfirmed) {
      try {
        const response = await fetch(`/api/customer/${customer._id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete customer");
        }

        // Show success toast message
        toast.success("Customer deleted successfully.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
        });

        // Filter out the deleted customer from the state
        const filteredCustomers = customers.filter(
          (item) => item._id !== customer._id
        );
        setCustomers(filteredCustomers);
      } catch (error) {
        toast.error("Error deleting customer.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
        });
      }
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const fetchCustomers = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/customer?page=${currentPage}&pageSize=${pageSize}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      const data = await response.json();

      // Log untuk debugging
      console.log("Fetch Response:", {
        currentPage,
        totalItems: data.totalCustomers,
        itemsReceived: data.customers.length,
        calculatedPages: Math.ceil(data.totalCustomers / pageSize),
      });

      setCustomers(data.customers);
      setTotalCustomers(data.totalCustomers);
      setTotalPages(Math.ceil(data.totalCustomers / pageSize));
    } catch (error) {
      setError(error.message);
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]); // Tambahkan dependencies

  // Ganti useEffect untuk fetch initial data
  useEffect(() => {
    if (!debouncedSearchTerm) {
      fetchCustomers();
    }
  }, [fetchCustomers, debouncedSearchTerm]);

  const refreshData = () => {
    fetchCustomers();
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Search function
  const searchCustomers = useCallback(async () => {
    if (!debouncedSearchTerm) {
      return fetchCustomers();
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/customer/search?term=${encodeURIComponent(
          debouncedSearchTerm
        )}&page=${currentPage}&pageSize=${pageSize}`
      );
      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();

      // Log untuk debugging
      console.log("Search Response:", {
        searchTerm: debouncedSearchTerm,
        currentPage,
        totalItems: data.totalCustomers,
        itemsReceived: data.customers.length,
        calculatedPages: Math.ceil(data.totalCustomers / pageSize),
      });

      setCustomers(data.customers);
      setTotalCustomers(data.totalCustomers);
      setTotalPages(Math.ceil(data.totalCustomers / pageSize));
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search customers");
    } finally {
      setIsSearching(false);
    }
  }, [debouncedSearchTerm, currentPage, pageSize, fetchCustomers]);

  // Effect for search
  useEffect(() => {
    searchCustomers();
  }, [debouncedSearchTerm, currentPage, searchCustomers]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Toggle Tooltip visibility for the clicked customer
  const toggleTooltip = (customerId) => {
    setActiveTooltipId((prevId) => (prevId === customerId ? null : customerId));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? "Invalid date" : format(date, "MM/dd HH:mm");
  };

  if (loading) return <p>Loading customers...</p>;
  if (error) return <p>Error: {error}</p>;
  const handlePrint = (customer) => {
    const printWindow = window.open("", "_blank");
    const printContent = document.getElementById(`print-address-${customer._id}`);

    if (!printWindow || !printContent) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Service Address - ${customer.constumer_name}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="bg-white">
          <div class="max-w-4xl mx-auto p-8">
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-800/20 to-pink-900/20" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[700px] h-[700px] bg-pink-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
      </div>
      <div className=" mx-auto p-4">
        {/* Header Section */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 mb-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Customer List
            </h2>
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search by name, phone, or address..."
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

        {/* Customer List */}
        <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl border border-gray-700/50 overflow-hidden">
          <ul className="divide-y divide-gray-700/50">
            {customers.length === 0 ? (
              <p className="text-center py-4 text-gray-400">
                No customers found.
              </p>
            ) : (
              customers.map((customer) => (
                <li
                  key={customer._id}
                  className="group hover:bg-gray-800/50 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Glow effect on hover */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300"
                  />

                  <div className="relative flex items-center px-4 py-4 gap-4">
                    {/* Profile Section */}
                    <div className="flex-1 flex gap-4 items-center">
                      <div className="cursor-pointer">
                        {/* Add your profile image or icon here */}
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-satoshi font-semibold text-gray-300">
                          {customer.constumer_name}
                        </h3>
                        <p className="font-inter text-sm text-gray-500">
                          {customer.wa_number}
                        </p>
                      </div>
                    </div>

                    {/* Task Section */}
                    <div
                      className="flex-1 relative"
                      onClick={() => toggleTooltip(customer._id)}
                    >
                      <div className="font-satoshi text-sm text-gray-300">
                        {customer.constumer_address.street}
                      </div>
                      <p className="font-inter text-sm text-gray-500">
                        {customer.constumer_address.kabupaten}
                      </p>

                      {/* Tooltip for the specific customer */}
                      {activeTooltipId === customer._id && (
                        <div className="absolute left-0 top-0 transform -translate-x-full -translate-y-8 bg-gray-800 text-white text-xs rounded p-2 opacity-100 transition-opacity">
                          {customer.constumer_address.street},{" "}
                          {customer.constumer_address.city},{" "}
                          {customer.constumer_address.kecamatan},{" "}
                          {customer.constumer_address.kabupaten},{" "}
                          {customer.constumer_address.province},{" "}
                          {customer.constumer_address.postal_code}
                        </div>
                      )}
                    </div>

                    {/* Date Section */}
                    <div className="flex-1 flex justify-center flex-col">
                      <p className="font-satoshi text-xs text-gray-300">
                        Created At:{" "}
                        {formatDate(customer.createdAt)}
                      </p>
                      <p className="font-satoshi text-xs text-gray-300">
                        Updated At:{" "}
                        {formatDate(customer.updatedAt)}
                      </p>
                    </div>

                    <div className="flex-1 flex justify-center flex-col">
                      <p className="font-satoshi text-xs text-gray-300">
                        Status
                      </p>
                      <p
                        className={`font-satoshi text-xs ${
                          customer.status?.toLowerCase() === "active"
                            ? "text-green-500"
                            : "text-orange-500"
                        }`}
                      >
                        {customer.status}
                      </p>
                    </div>

                    {/* Action Button Section */}
                    <div className="w-32 flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="px-3 py-1.5 text-xs font-medium text-purple-300 bg-purple-500/10 
                          rounded border border-purple-500/50 hover:bg-purple-500/20 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(customer)}
                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <MdClose className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePrint(customer)}
                        className="px-3 py-1.5 text-xs font-medium text-blue-300 bg-blue-500/10 
                          rounded border border-blue-500/50 hover:bg-blue-500/20 transition-colors"
                      >
                        Print
                      </button>
                    </div>
                  </div>
                  {/* Hidden Print Template */}
                  <div id={`print-address-${customer._id}`} className="hidden">
                    <AddressPrint customer={customer} />
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

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

      {/* Hidden Print Template */}
      <div id="print-address" className="hidden">
        <AddressPrint
          transaction={transaction}
          formatCurrency={formatCurrency}
          formatWarranty={formatWarranty}
          calculateItemTotal={calculateItemTotal}
        />
      </div>

      {isModalOpen && (
        <EditModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          selectedCustomer={selectedCustomer}
          refreshData={refreshData}
        />
      )}
    </div>
  );
};

export default CustomerList;
