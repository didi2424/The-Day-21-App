import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MdClose, MdAdd, MdSearch, MdOutlineTimelapse } from "react-icons/md";

const TransactionUpdatePage2 = ({
  selectedTransactionId,
  setActiveButton,
  setFormStep,
}) => {
  const [loading, setLoading] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [existingTransaction, setExistingTransaction] = useState(null);

  const [replacedHardware, setReplacedHardware] = useState([
    {
      id: Date.now(),
      name: "",
      manufacture: "",
      price: "",
      warranty: "3",
      quantity: 1,
      discount: 0,
    },
  ]);

  // State untuk biaya servis
  const [serviceCost, setServiceCost] = useState({
    diagnosis: "",
    workmanship: "",
    other: "",
  });
  const handleBack = () => {
    setCurrentComponent("basic");
  };

  // Opsi garansi
  const warrantyOptions = [
    { value: "0", label: "Tanpa Garansi" },
    { value: "1w", label: "1 Minggu" },
    { value: "1m", label: "1 Bulan" },
    { value: "3m", label: "3 Bulan" },
    { value: "6m", label: "6 Bulan" },
    { value: "12m", label: "12 Bulan" },
  ];

  // Add this function to convert warranty values
  const convertWarrantyToMonths = (warranty) => {
    switch (warranty) {
      case "0":
        return 0;
      case "1w":
        return 0.25; // approximately 1 week in months
      case "1m":
        return 1;
      case "3m":
        return 3;
      case "6m":
        return 6;
      case "12m":
        return 12;
      default:
        return 0;
    }
  };

  // Convert numeric warranty value to option value
  const convertWarrantyToOption = (numericWarranty) => {
    switch (numericWarranty) {
      case 0:
        return "0";
      case 0.25:
        return "1w";
      case 1:
        return "1m";
      case 3:
        return "3m";
      case 6:
        return "6m";
      case 12:
        return "12m";
      default:
        return "0";
    }
  };

  const addHardware = () => {
    setReplacedHardware([
      ...replacedHardware,
      {
        id: Date.now(),
        name: "",
        manufacture: "",
        price: "",
        warranty: "3",
        quantity: 1,
        discount: 0,
      },
    ]);
  };

  const removeHardware = (id) => {
    setReplacedHardware(replacedHardware.filter((hw) => hw.id !== id));
  };
  const updateHardware = (id, field, value) => {
    setReplacedHardware(
      replacedHardware.map((hw) => {
        if (hw.id === id) {
          return { ...hw, [field]: value };
        }
        return hw;
      })
    );
  };

  const handleServiceCostChange = (field, value) => {
    setServiceCost((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateItemTotal = (item) => {
    const subtotal =
      (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1);
    const discountAmount = subtotal * ((parseFloat(item.discount) || 0) / 100);
    return subtotal - discountAmount;
  };

  // Calculate total cost
  useEffect(() => {
    const hardwareTotal = replacedHardware.reduce(
      (sum, hw) => sum + calculateItemTotal(hw),
      0
    );

    const serviceTotal = Object.values(serviceCost).reduce(
      (sum, cost) => sum + (parseFloat(cost) || 0),
      0
    );

    setTotalCost(hardwareTotal + serviceTotal);
  }, [replacedHardware, serviceCost]);

  useEffect(() => {
    const fetchExistingTransaction = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/transaction/hardware/byService/${selectedTransactionId}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setExistingTransaction(data);
            // Populate form with existing data
            setReplacedHardware(
              data.replacedHardware.map((hw) => ({
                id: Date.now() + Math.random(), // Generate unique ID for UI purposes
                name: hw.name,
                manufacture: hw.manufacture,
                price: hw.price.toString(),
                warranty: convertWarrantyToOption(hw.warranty), // Convert numeric warranty to option
                quantity: hw.quantity,
                inventoryId: hw.inventoryId,
                discount: hw.discount || 0,
              }))
            );
            setServiceCost({
              diagnosis: data.serviceCost.diagnosis.toString(),
              workmanship: data.serviceCost.workmanship.toString(),
              other: data.serviceCost.other.toString(),
            });
          }
        }
      } catch (error) {
        console.error("Error fetching existing transaction:", error);
        toast.error("Failed to load existing hardware transaction");
      } finally {
        setLoading(false);
      }
    };

    if (selectedTransactionId) {
      fetchExistingTransaction();
    }
  }, [selectedTransactionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHardwareData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Single save function
  const handleSubmit = async () => {
    try {
      // Validasi data sebelum dikirim
      if (replacedHardware.length === 0) {
        toast.error("Please add at least one hardware item");
        return;
      }
      console.log("Replaced hardware:", replacedHardware); // Debug log
      // Validate required fields
      const isValid = replacedHardware.every(
        (hw) =>
          hw.name && hw.manufacture && hw.price && hw.quantity && hw.inventoryId
      );

      if (!isValid) {
        toast.error("Please fill all required fields for hardware items");
        return;
      }

      const hardwareTransactionData = {
        serviceId: selectedTransactionId,
        replacedHardware: replacedHardware.map((hw) => ({
          name: hw.name,
          manufacture: hw.manufacture,
          price: parseFloat(hw.price),
          quantity: parseInt(hw.quantity),
          warranty: convertWarrantyToMonths(hw.warranty), // Convert warranty here
          inventoryId: hw.inventoryId,
          discount: parseFloat(hw.discount) || 0,
        })),
        serviceCost: {
          diagnosis: parseFloat(serviceCost.diagnosis) || 0,
          workmanship: parseFloat(serviceCost.workmanship) || 0,
          other: parseFloat(serviceCost.other) || 0,
        },
        totalCost,
      };

      const method = existingTransaction ? "PATCH" : "POST";
      const url = existingTransaction
        ? `/api/transaction/hardware/${existingTransaction._id}`
        : "/api/transaction/hardware";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hardwareTransactionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save hardware transaction");
      }

      toast.success("Hardware and service costs saved successfully");
    } catch (error) {
      console.error("Error details:", error);
      toast.error(error.message || "Failed to save hardware details");
    }
  };

  // Add new states for inventory search
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Update the search function to match StockList implementation
  const searchInventory = async (query) => {
    try {
      setIsSearching(true);
      const queryParams = new URLSearchParams({
        search: query,
        page: 1,
        limit: 10,
      });

      const response = await fetch(`/api/inventory?${queryParams}`);
      if (!response.ok) throw new Error("Failed to fetch inventory");

      const data = await response.json();
      console.log("Search results:", data.inventory);
      setSearchResults(data.inventory || []); // Use data.inventory karena response berbentuk { inventory: [], totalPages: number }
    } catch (error) {
      console.error("Error searching inventory:", error);
      toast.error("Failed to search inventory");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length >= 2) {
      searchInventory(value);
    } else {
      setSearchResults([]);
    }
  };
  const handleSelectInventoryItem = (item) => {
    const newHardware = {
      id: Date.now(),
      name: item.name,
      manufacture: item.manufacture || "", // Changed from brand to manufacture
      price: item.price?.toString() || "",
      warranty: "3m", // Set default warranty to 3 months
      quantity: 1,
      inventoryId: item._id, // Tambahkan inventoryId dari item yang dipilih
      discount: 0,
    };
    console.log("Selected item:", item); // Debug log
    console.log("New hardware:", newHardware); // Debug log
    setReplacedHardware([...replacedHardware, newHardware]);
    setSearchQuery("");
    setIsSearching(false);
    setSearchResults([]);
  };

  // Fix loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="rounded-lg h-[calc(80vh-200px)]">

      <div
        className="h-full overflow-y-auto pr-2 space-y-4"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#9333EA #6B21A8",
          maxHeight: "calc(80vh - 100px)" /* Added max height */,
          overflowY: "auto" /* Ensure vertical scroll */,
          paddingRight: "8px" /* Add some padding for the scrollbar */,
        }}
      >
        {/* Replaced Hardware Section */}
        <div className=" bg-white/1 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Replaced Hardware</h3>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full p-2 pr-10  focus:ring-1 focus:ring-blue-500 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                  placeholder="Search inventory..."
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <MdClose
                        className="text-gray-500 hover:text-gray-700"
                        size={16}
                      />
                    </button>
                  )}
                  {isSearching ? (
                    <MdOutlineTimelapse className="text-gray-400" size={16} />
                  ) : (
                    <MdSearch className="text-gray-400" size={16} />
                  )}
                </div>
                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1  border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((item) => (
                      <div
                        key={item._id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectInventoryItem(item)}
                      >
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          Stock: {item.stock} | Price: Rp{" "}
                          {parseInt(item.price).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={addHardware}
                className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <MdAdd size={20} />
                <span>Add</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {replacedHardware.map((hw) => (
              <div
                key={hw.id}
                className="grid grid-cols-8 gap-4 items-center  p-3 rounded-md" // Changed from grid-cols-6 to grid-cols-8
              >
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Hardware Name
                  </label>
                  <input
                    type="text"
                    value={hw.name}
                    onChange={(e) =>
                      updateHardware(hw.id, "name", e.target.value)
                    }
                    className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                    placeholder="e.g., SSD, RAM, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Manufacture
                  </label>
                  <input
                    type="text"
                    value={hw.manufacture || ""} // Changed from hw.brand to hw.manufacture
                    onChange={(e) =>
                      updateHardware(hw.id, "manufacture", e.target.value)
                    } // Changed from 'brand' to 'manufacture'
                    className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                    placeholder="Manufacture name"
                  />
                </div>
                {/* Add Warranty Selection */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Warranty
                  </label>
                  <select
                    value={hw.warranty}
                    onChange={(e) =>
                      updateHardware(hw.id, "warranty", e.target.value)
                    }
                    className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                  >
                    {warrantyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Add Discount field */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={hw.discount || 0}
                    onChange={(e) =>
                      updateHardware(hw.id, "discount", e.target.value)
                    }
                    className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    value={hw.price}
                    onChange={(e) =>
                      updateHardware(hw.id, "price", e.target.value)
                    }
                    className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={hw.quantity}
                    onChange={(e) =>
                      updateHardware(hw.id, "quantity", e.target.value)
                    }
                    className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                  />
                </div>
                <div className="flex items-end gap-2 ">
                  <div className="flex-1 ">
                    <label className="block text-sm font-medium mb-1 ">
                      Total
                    </label>
                    <div className="space-y-1">
                      {hw.discount > 0 && (
                        <div className="text-sm text-gray-500 line-through">
                          Rp{" "}
                          {(
                            (parseFloat(hw.price) || 0) *
                            (parseInt(hw.quantity) || 1)
                          ).toLocaleString()}
                        </div>
                      )}
                      <div className="p-2   text-right font-medium">
                        Rp {calculateItemTotal(hw).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeHardware(hw.id)}
                    className="mb-1 p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <MdClose />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Service Costs Section */}
        <div className="  bg-white/1 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg">
          <h3 className="font-semibold text-lg mb-4">Service Costs</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Diagnosis Fee
              </label>
              <input
                type="number"
                value={serviceCost.diagnosis}
                onChange={(e) =>
                  handleServiceCostChange("diagnosis", e.target.value)
                }
                className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Workmanship
              </label>
              <input
                type="number"
                value={serviceCost.workmanship}
                onChange={(e) =>
                  handleServiceCostChange("workmanship", e.target.value)
                }
                className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Other Costs
              </label>
              <input
                type="number"
                value={serviceCost.other}
                onChange={(e) =>
                  handleServiceCostChange("other", e.target.value)
                }
                className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                placeholder="0"
              />
            </div>
          </div>
        </div>
        {/* Total Cost Display */}
        <div className=" bg-white/1 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Total Cost</h3>
            <div className="text-2xl font-bold text-green-600">
              Rp {totalCost.toLocaleString()}
            </div>
          </div>
        </div>
      
        <div className="flex justify-end gap-4 pb-4">
          <button
            onClick={handleSubmit}
            className="p-2 text-sm rounded-xl bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-blue-600/30 backdrop-blur-xl shadow-xl border border-white/30"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionUpdatePage2;
