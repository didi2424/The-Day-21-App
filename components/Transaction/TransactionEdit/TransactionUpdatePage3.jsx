import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MdClose, MdPayment } from "react-icons/md";

const TransactionUpdatePage3 = ({ selectedTransactionId, setActiveButton, setFormStep, totalAmount: initialTotalAmount }) => {
  const [loading, setLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({
    transaction: selectedTransactionId, // Make sure this is the correct transaction ID
    amount: 0,
    status: 'unpaid',
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [totalAmount, setTotalAmount] = useState(initialTotalAmount || 0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        console.log('Fetching payments for transaction:', selectedTransactionId); // Debug log

        const response = await fetch('/api/payment');
        const data = await response.json();

        // Filter payments by transaction ID
        const transactionPayments = data.filter(
          payment => payment.transaction && payment.transaction._id === selectedTransactionId
        );

        console.log('Found payments:', transactionPayments); // Debug log
        setPayments(transactionPayments);
        
        // Calculate total paid amount from filtered payments
        const paid = transactionPayments.reduce(
          (sum, payment) => sum + (parseFloat(payment.amount) || 0), 
          0
        );
        setPaidAmount(paid);
      } catch (error) {
        console.error('Error fetching payments:', error);
        toast.error('Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    };

    if (selectedTransactionId) {
      fetchPayments();
    }
  }, [selectedTransactionId]);

  // Calculate remaining amount
  useEffect(() => {
    setRemainingAmount(totalAmount - paidAmount);
  }, [totalAmount, paidAmount]);

  // Add useEffect to update totalAmount when prop changes
  useEffect(() => {
    setTotalAmount(initialTotalAmount || 0);
  }, [initialTotalAmount]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const paymentData = {
        ...newPayment,
        transaction: selectedTransactionId
      };

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update payments list and recalculate paid amount
        const updatedPayments = [...payments, data];
        setPayments(updatedPayments);
        
        const newPaidAmount = updatedPayments.reduce(
          (sum, payment) => sum + (parseFloat(payment.amount) || 0), 
          0
        );
        setPaidAmount(newPaidAmount);
        
        setIsPaymentModalOpen(false);
        setNewPayment({
          ...newPayment,
          amount: 0,
          status: 'unpaid',
          notes: '',
          transaction: selectedTransactionId
        });
        toast.success('Payment added successfully');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Failed to create payment');
    }
  };

  const handleDeletePayment = async (paymentId, amount) => {
    try {
      const response = await fetch(`/api/payment/${paymentId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setPayments(payments.filter(payment => payment._id !== paymentId));
        setPaidAmount(prev => prev - parseFloat(amount));
        toast.success('Payment deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast.error('Failed to delete payment');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="rounded-lg h-[calc(80vh-200px)]">
      <div className="h-full overflow-y-auto pr-2 space-y-4">
        {/* Payment Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/1 backdrop-blur-lg border border-white/20 p-4 rounded-xl">
            <h4 className="text-sm font-medium text-gray-400">Total Amount</h4>
            <p className="text-xl font-bold">Rp {totalAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white/1 backdrop-blur-lg border border-white/20 p-4 rounded-xl">
            <h4 className="text-sm font-medium text-gray-400">Paid Amount</h4>
            <p className="text-xl font-bold text-green-500">Rp {paidAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white/1 backdrop-blur-lg border border-white/20 p-4 rounded-xl">
            <h4 className="text-sm font-medium text-gray-400">Remaining</h4>
            <p className="text-xl font-bold text-red-500">Rp {remainingAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Payment List */}
        <div className="bg-white/1 backdrop-blur-lg border border-white/20 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Payment History</h3>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              <MdPayment size={20} />
              <span>Add Payment</span>
            </button>
          </div>

          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment._id} 
                className="flex justify-between items-center p-4 border border-white/10 rounded-lg hover:bg-white/5"
              >
                <div>
                  <p className="font-medium">Rp {parseFloat(payment.amount).toLocaleString()}</p>
                  <p className="text-sm text-gray-400">
                    {payment.paymentMethod} - {new Date(payment.paymentDate).toLocaleDateString()}
                  </p>
                  {payment.notes && <p className="text-sm text-gray-400">{payment.notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                    payment.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {payment.status}
                  </span>
                  <button
                    onClick={() => handleDeletePayment(payment._id, payment.amount)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <MdClose />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Modal */}
        {isPaymentModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1a2236] p-6 rounded-lg w-96 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add Payment</h3>
                <button 
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <MdClose size={20} />
                </button>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Amount</label>
                  <input
                    type="number"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                    className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md text-gray-100"
                    placeholder="Enter amount"
                    required
                  />
                  <p className="text-sm text-gray-400 mt-1">Remaining: Rp {remainingAmount.toLocaleString()}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Payment Method</label>
                  <select
                    value={newPayment.paymentMethod}
                    onChange={(e) => setNewPayment({...newPayment, paymentMethod: e.target.value})}
                    className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md text-gray-100"
                  >
                    <option value="cash">Cash</option>
                    <option value="transfer">Transfer</option>
                    <option value="debit">Debit Card</option>
                    <option value="credit">Credit Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={newPayment.status}
                    onChange={(e) => setNewPayment({...newPayment, status: e.target.value})}
                    className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md text-gray-100"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Payment Date</label>
                  <input
                    type="date"
                    value={newPayment.paymentDate}
                    onChange={(e) => setNewPayment({...newPayment, paymentDate: e.target.value})}
                    className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea
                    value={newPayment.notes}
                    onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
                    className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md text-gray-100"
                    rows="3"
                    placeholder="Add payment notes (optional)"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Save Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionUpdatePage3;
