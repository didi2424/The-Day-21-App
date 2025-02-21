import { useEffect, useState } from 'react';
import { format } from 'date-fns'; // Import format for date formatting
import { toast } from 'react-toastify';
import EditModal from './EditModal'; // Import modal
import 'react-toastify/dist/ReactToastify.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Page number
  const [pageSize] = useState(7); // Number of customers per page
  const [totalCustomers, setTotalCustomers] = useState(0); // Total customer count
  const [totalPages, setTotalPages] = useState(1); // Total number of pages

  const [isModalOpen, setIsModalOpen] = useState(false); // To toggle the modal visibility

  const [selectedCustomer, setSelectedCustomer] = useState(null); // To store the selected customer for editing
  
  // State to store which customer's tooltip is visible
  const [activeTooltipId, setActiveTooltipId] = useState(null);

  const handleDelete = async (customer) => {
    const hasConfirmed = confirm("Are you sure you want to delete this customer?");
    if (hasConfirmed) {
      try {
        const response = await fetch(`/api/customer/${customer._id}`, { method: "DELETE" });

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
        const filteredCustomers = customers.filter(item => item._id !== customer._id);
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

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`/api/customer?page=${currentPage}&pageSize=${pageSize}`);
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await response.json();
      setCustomers(data.customers);
      setTotalCustomers(data.totalCustomers);
      setTotalPages(Math.ceil(data.totalCustomers / pageSize));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [currentPage]); 


  const refreshData = () => {
    fetchCustomers();
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Toggle Tooltip visibility for the clicked customer
  const toggleTooltip = (customerId) => {
    setActiveTooltipId(prevId => (prevId === customerId ? null : customerId));
  };

  if (loading) return <p>Loading customers...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold">Customer List</h2>
      <p>Total customers: {totalCustomers}</p>

      <ul>
        {customers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          customers.map((customer) => (
            <li key={customer._id}>
              <div className="flex flex-col pl-3 sm:flex-row rounded-lg shadow-sm h-31 pt-3 pb-3 mt-3">
                {/* Profile Section */}
                <div className="flex-1 flex gap-4 items-center">
                  <div className="cursor-pointer">
                    {/* Add your profile image or icon here */}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-satoshi font-semibold text-gray-900">{customer.constumer_name}</h3>
                    <p className="font-inter text-sm text-gray-500">{customer.wa_number}</p>
                  </div>
                </div>

                {/* Task Section */}
                <div className="flex-1 relative"  onClick={() => toggleTooltip(customer._id)}>
                  <div className="font-satoshi text-sm text-gray-700">{customer.constumer_address.street}</div>
                  <p className="font-inter text-sm text-gray-500">
                    {customer.constumer_address.kabupaten}
                  </p>

                  {/* Tooltip for the specific customer */}
                  {activeTooltipId === customer._id && (
                    <div className="absolute left-0 top-0 transform -translate-x-full -translate-y-8 bg-gray-800 text-white text-xs rounded p-2 opacity-100 transition-opacity">
                      {customer.constumer_address.street}, {customer.constumer_address.city},  {customer.constumer_address.kecamatan},  {customer.constumer_address.kabupaten},  {customer.constumer_address.province},  {customer.constumer_address.postal_code}
                    </div>
                  )}
                </div>

                {/* Date Section */}
                <div className="flex-1 flex justify-center flex-col">
                  <p className="font-satoshi text-xs text-gray-300">
                    Created At: {format(new Date(customer.createdAt), 'MM/dd HH:mm')}
                  </p>
                  <p className="font-satoshi text-xs text-gray-300">
                    Updated At: {format(new Date(customer.updatedAt), 'MM/dd HH:mm')}
                  </p>
                </div>

                {/* Action Button Section */}
                <div className="flex-1 flex gap-10 items-center">
                  <p className="font-inter text-sm cursor-pointer" onClick={() => handleEdit(customer)}>
                    Edit
                  </p>
                  <p className="font-inter text-sm cursor-pointer border rounded-md pl-2 pr-2 pt-1 pb-1 bg-red-600 text-white " onClick={() => handleDelete(customer)}>
                    Delete
                  </p>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>


      <div className="flex justify-between mt-4">
        <p className="mt-2 text-sm">Page {currentPage} of {totalPages}</p>
        <div className='gap-4 flex'>
          <button onClick={handleBack} disabled={currentPage === 1} className={`next_btn ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-[b9ec8f]'}`}>
            Back
          </button>
          <button onClick={handleNext} disabled={currentPage === totalPages} className={`next_btn ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'hover:bg-[b9ec8f]'}`}>
            Next
          </button>
        </div>
      </div>

      {isModalOpen && <EditModal isModalOpen={isModalOpen} closeModal={closeModal} selectedCustomer={selectedCustomer} refreshData={refreshData} />}
    </div>
  );
};

export default CustomerList;
