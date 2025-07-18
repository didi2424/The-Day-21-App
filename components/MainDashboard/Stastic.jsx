"use client";
import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/datepicker.css"; // Add this import

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Statistics = () => {
  const [transactionCount, setTransactionCount] = useState(0);
  const [payments, setPayments] = useState([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewType, setViewType] = useState("week"); // Add this state
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [customerCount, setCustomerCount] = useState(0);
  const [unpaidAmount, setUnpaidAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [paidTotal, setPaidTotal] = useState(0);
  const [inventoryData, setInventoryData] = useState({
    totalValue: 0,
    totalItems: 0,
    formattedValue: "Rp 0"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions
        const transResponse = await fetch("/api/transaction/all");
        const transData = await transResponse.json();
        if (transData && transData.success && transData.transactions) {
          setTransactionCount(transData.transactions.length);
        }

        // Fetch payments
        const paymentResponse = await fetch("/api/payment");
        const paymentData = await paymentResponse.json();
        if (paymentData && Array.isArray(paymentData)) {
          setPayments(paymentData);
          // Calculate total payments
          const total = paymentData.reduce(
            (sum, payment) => sum + payment.amount,
            0
          );
          setTotalPayments(total);
        }

        // Fetch customers
        const customerResponse = await fetch("/api/customer/all");
        const customerData = await customerResponse.json();
        if (customerData && customerData.success && customerData.customers) {
          setCustomerCount(customerData.customers.length);
        }

        // Fetch transactions with amounts
        const transactionsResponse = await fetch("/api/transaction/all");
        const transactionsData = await transactionsResponse.json();
        if (transactionsData.success) {
          const unpaidTotal = transactionsData.transactions.reduce(
            (sum, trans) => {
              return sum + (trans.isPaid ? 0 : trans.amount);
            },
            0
          );
          setUnpaidAmount(unpaidTotal);
        }

        // Fetch all transactions
        const response = await fetch("/api/transaction/all");
        const data = await response.json();

        if (data.success) {
          const transactions = data.transactions;
          setTransactionCount(transactions.length);

          // Calculate paid and unpaid amounts
          let totalPaid = 0;
          let totalUnpaid = 0;

          transactions.forEach((transaction) => {
            if (transaction.isPaid) {
              totalPaid += transaction.amount;
            } else {
              totalUnpaid += transaction.amount;
            }
          });

          setPaidAmount(totalPaid);
          setUnpaidAmount(totalUnpaid);
        }

        // Fetch transactions with consistent parameter naming
        const transactionResponse = await fetch("/api/transaction/hardware");
        const transactionData = await transactionResponse.json();

        const transactions = Array.isArray(transactionData)
          ? transactionData
          : [transactionData];

        // Update payment fetch to use consistent parameter
        const paymentsResponse = await fetch("/api/payment");
        const paymentsData = await paymentsResponse.json();

        // Update serviceId references to be consistent
        const paidServiceIds = paymentsData.map(
          (payment) => payment.transaction._id
        );
        const paidTransactions = transactions.filter((transaction) =>
          paidServiceIds.includes(transaction.serviceId)
        );

        // Calculate totals
        const grandTotal = transactions.reduce(
          (sum, transaction) => sum + (transaction.totalCost || 0),
          0
        );
        const paidAmount = paidTransactions.reduce(
          (sum, transaction) => sum + (transaction.totalCost || 0),
          0
        );

        setTotalCost(grandTotal);
        setTotalPaid(paidAmount);
        setPaidTotal(grandTotal - paidAmount);

        // Add this to your existing fetch calls
        const inventoryResponse = await fetch("/api/inventory/countall");
        const inventoryData = await inventoryResponse.json();
        setInventoryData(inventoryData);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const processPaymentData = () => {
    // Get 7 days based on current page
    const last7Days = [...Array(7)]
      .map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i - currentPage * 7);
        return date.toISOString().split("T")[0];
      })
      .reverse();

    // Group payments by day
    const dailyPayments = {};
    payments.forEach((payment) => {
      const date = new Date(payment.paymentDate).toISOString().split("T")[0];
      if (last7Days.includes(date)) {
        dailyPayments[date] = (dailyPayments[date] || 0) + payment.amount;
      }
    });

    // Ensure all 7 days are represented
    const data = last7Days.map((date) => ({
      date,
      amount: dailyPayments[date] || 0,
    }));

    return {
      labels: data.map((d) => new Date(d.date).toLocaleDateString()),
      datasets: [
        {
          label: "Daily Payment Amount (Rp)",
          data: data.map((d) => d.amount),
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
          fill: false,
        },
      ],
    };
  };

  // Add monthly data processing function
  const processMonthlyData = () => {
    const monthlyPayments = {};
    payments.forEach((payment) => {
      const date = new Date(payment.paymentDate);
      const monthKey = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      monthlyPayments[monthKey] =
        (monthlyPayments[monthKey] || 0) + payment.amount;
    });

    const sortedMonths = Object.keys(monthlyPayments)
      .sort((a, b) => new Date(a) - new Date(b))
      .slice(-6); // Show last 6 months

    return {
      labels: sortedMonths,
      datasets: [
        {
          label: "Monthly Payment Amount (Rp)",
          data: sortedMonths.map((month) => monthlyPayments[month]),
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
          fill: false,
        },
      ],
    };
  };

  const processDateRangeData = () => {
    if (!startDate || !endDate) return null;

    const filteredPayments = payments.filter((payment) => {
      const paymentDate = new Date(payment.paymentDate);
      return paymentDate >= startDate && paymentDate <= endDate;
    });

    const dailyPayments = {};
    filteredPayments.forEach((payment) => {
      const date = new Date(payment.paymentDate).toISOString().split("T")[0];
      dailyPayments[date] = (dailyPayments[date] || 0) + payment.amount;
    });

    const dates = Object.keys(dailyPayments).sort();

    return {
      labels: dates.map((d) => new Date(d).toLocaleDateString()),
      datasets: [
        {
          label: "Payment Amount (Rp)",
          data: dates.map((date) => dailyPayments[date]),
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
          fill: false,
        },
      ],
    };
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#9CA3AF",
          callback: (value) => `Rp ${value.toLocaleString()}`,
        },
      },
      x: {
        grid: {
          display: true,
          drawBorder: true,
          color: "#374151",
        },
        ticks: {
          color: "#9CA3AF",
          maxRotation: 0, // Change this to 0
          minRotation: 0, // Change this to 0
          padding: 10, // Add some padding
          autoSkip: true, // Enable auto skipping
          maxTicksLimit: 6, // Limit number of ticks to prevent overcrowding
        },
      },
    },
    plugins: {
      legend: {
        labels: { color: "#9CA3AF" },
      },
      tooltip: {
        callbacks: {
          label: (context) => `Rp ${context.raw.toLocaleString()}`,
        },
      },
    },
  };

  const paymentDonutData = {
    labels: ["Paid", "Unpaid"],
    datasets: [
      {
        data: [totalPaid, paidTotal],
        backgroundColor: ["#66CCFF", "#5c9ebf"], // Biru tua & biru muda
        borderColor: ["#66CCFF", "#5c9ebf"], // Warna border sama dengan background
        borderWidth: 1.5, // Atur ketebalan border agar lebih jelas
      },
    ],
  };

  const donutOptions = {
    responsive: false,
    cutout: "80%",
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#9CA3AF",
          usePointStyle: true,
          padding: 10 ,
        },
      },
    },
  };

  // Add this new function after the other process functions
  const getWeeklyStats = () => {
    const today = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const stats = days.map(day => ({
      day,
      count: 0,
      amount: 0
    }));

    payments.forEach(payment => {
      const paymentDate = new Date(payment.paymentDate);
      // Only count payments from the current week
      if (today.getTime() - paymentDate.getTime() <= 7 * 24 * 60 * 60 * 1000) {
        const dayIndex = paymentDate.getDay();
        stats[dayIndex].count++;
        stats[dayIndex].amount += payment.amount;
      }
    });

    return stats;
  };

  return (
    <div className="h-[540px]">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-800/20 to-pink-900/20" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[540px] bg-blue-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[540px] bg-purple-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[700px] h-[540px] bg-pink-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-4">Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
        <div className=" h-1/3 min-h-[220px] flex flex-col bg-white/1 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg">
          <h3 className="text-white text-lg font-semibold ">
            Payment Status
          </h3>

            <div className="w-[180px] h-[180px] justify-center items-center flex mx-auto">
              <Doughnut data={paymentDonutData} options={donutOptions} />
            </div>

     
        </div>
        <div className=" h-1/3 min-h-[220px] flex flex-col bg-white/1 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg">
          <h3 className="text-white text-lg font-semibold mb-4">
            Total Transactions
          </h3>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400 text-6xl font-bold">
              {transactionCount}
            </p>
          </div>
        </div>
        <div className=" h-1/3 min-h-[220px] flex flex-col bg-white/1 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg">
          <h3 className="text-white text-lg font-semibold mb-4">
            Total Customers
          </h3>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400 text-6xl font-bold">{customerCount}</p>
          </div>
        </div>
        <div className="h-1/3 min-h-[220px] flex flex-col bg-white/1 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg">
          <h3 className="text-white text-lg font-semibold mb-4">Inventory</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-gray-400 text-4xl font-bold">{inventoryData.formattedValue}</p>
            <p className="text-gray-500 text-sm mt-2">Total Items: {inventoryData.totalItems}</p>
          </div>
        </div>
      </div>

      {/* New boxes with 2:3 and 1:3 ratio */}
      <div className="grid grid-cols-3 gap-4 h-[420px]">
        <div className="col-span-2 h-[420px] flex flex-col   bg-white/1 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-white text-lg font-semibold">
                Payment History
              </h3>
              <div className="flex bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewType("week")}
                  className={`text-xs px-3 py-1 rounded transition-colors ${
                    viewType === "week"
                      ? "bg-gray-600 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setViewType("month")}
                  className={`text-xs px-3 py-1 rounded transition-colors ${
                    viewType === "month"
                      ? "bg-gray-600 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setViewType("range")}
                  className={`text-xs px-3 py-1 rounded transition-colors ${
                    viewType === "range"
                      ? "bg-gray-600 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Custom Range
                </button>
              </div>
            </div>
            {viewType === "week" && (
              <div className="flex items-center bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="text-xs px-2 py-1 text-gray-300 hover:text-white hover:bg-gray-600 rounded transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <span className="text-gray-300 text-sm px-3">
                  {currentPage === 0
                    ? "Current"
                    : `${currentPage * 7} days ago`}
                </span>
                <button
                  onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="text-xs px-2 py-1 text-gray-300 hover:text-white hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 10 10"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
            {viewType === "range" && (
              <div className="bg-gray-700 rounded-lg p-1">
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  className="text-white text-xs w-[180px] px-2 py-1 rounded border-none focus:outline-none bg-transparent"
                  placeholderText="Select date range"
                  maxDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            )}
          </div>
          <div className="flex-1 w-full">
            {payments.length > 0 && (
              <Line
                data={
                  viewType === "week"
                    ? processPaymentData()
                    : viewType === "month"
                    ? processMonthlyData()
                    : processDateRangeData() || processPaymentData()
                }
                options={options}
              />
            )}
          </div>
        </div>
        <div className="col-span-1 h-1/3 min-h-[420px] flex flex-col bg-white/1 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg">
          <h3 className="text-white text-lg font-semibold mb-4">Weekly Overview</h3>
          <div className="flex-1 overflow-auto">
            {getWeeklyStats().map((stat, index) => (
              <div key={stat.day} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">{stat.day}</span>
                  <span className="text-gray-300">{stat.count} transactions</span>
                </div>
                <div className="relative h-2 bg-gray-700 rounded-full">
                  <div
                    className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{
                      width: `${(stat.count / Math.max(...getWeeklyStats().map(s => s.count))) * 100}%`
                    }}
                  />
                </div>
                <div className="mt-1 text-right">
                  <span className="text-sm text-gray-400">
                    Rp {stat.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
