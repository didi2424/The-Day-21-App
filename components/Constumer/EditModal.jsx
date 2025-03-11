import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditModal = ({
  isModalOpen,
  closeModal,
  selectedCustomer,
  refreshData,
}) => {
  if (!isModalOpen || !selectedCustomer) return null;

  const [formData, setFormData] = useState({
    constumer_name: "",
    wa_number: "",
    company: "",
    organisation: "",
    street: "",
    city: "",
    kecamatan: "",
    kabupaten: "",
    province: "",
    postal_code: "",
    status: "",
  });

  // Mengatur data form saat modal dibuka
  useEffect(() => {
    if (selectedCustomer) {
      setFormData({
        constumer_name: selectedCustomer.constumer_name,
        wa_number: selectedCustomer.wa_number,
        status: selectedCustomer.status,
        company: selectedCustomer.company,
        organisation: selectedCustomer.organisation,
        street: selectedCustomer.constumer_address.street,
        city: selectedCustomer.constumer_address.city,
        kecamatan: selectedCustomer.constumer_address.kecamatan,
        kabupaten: selectedCustomer.constumer_address.kabupaten,
        province: selectedCustomer.constumer_address.province,
        postal_code: selectedCustomer.constumer_address.postal_code,
      });
    }
  }, [selectedCustomer]);

  // haya
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const toggleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === "active" ? "deactive" : "active",
    }));
  };
  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/customer/${selectedCustomer._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wa_number: formData.wa_number,
          constumer_name: formData.constumer_name,
          company: formData.company,
          organisation: formData.organisation,
          status: formData.status,
          constumer_address: {
            street: formData.street,
            city: formData.city,
            kecamatan: formData.kecamatan,
            kabupaten: formData.kabupaten,
            province: formData.province,
            postal_code: formData.postal_code,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update customer");
      }

      const updatedCustomer = await response.json();
      refreshData();

      toast.success("Customer successfully updated!");
      closeModal(); // Tutup modal setelah berhasil update
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 flex justify-end items-center z-50">
      <div className="bg-white/1 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg   w-1/3 h-full ">
        <h2 className="text-xl font-bold mb-5">Edit Customer</h2>

        {/* Name and Phone */}
        <div className="flex gap-5">
          <div className="w-1/2 flex-col flex gap-2">
            <div className="text-sm font-bold">Name</div>
            <input
              type="text"
              name="constumer_name"
              value={formData.constumer_name}
              onChange={handleChange}
              className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
            />
          </div>

          <div className="w-1/2 flex-col flex gap-2">
            <div className="text-sm font-bold">Phone</div>
            <input
              type="text"
              name="wa_number"
              value={formData.wa_number}
              onChange={handleChange}
              className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Company and Organisation */}
        <div className="mt-4  flex gap-5">
          <div className="w-1/2 flex-col flex gap-2">
            <div className="text-sm font-bold">Company</div>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
            />
          </div>

          <div className="w-1/2 flex-col flex gap-2">
            <div className="text-sm font-bold">Organisation</div>
            <input
              type="text"
              name="organisation"
              value={formData.organisation}
              onChange={handleChange}
              className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <div className="text-sm font-bold mt-4">Status</div>
          <div
            className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition ${
              formData.status === "active" ? "bg-green-500" : "bg-orange-500"
            }`}
            onClick={toggleStatus}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow-md transform transition ${
                formData.status === "active" ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </div>
        </div>

        {/* Address Section */}
        <div className="mt-4 flex flex-col gap-2">
          <div className="text-sm font-bold">Street</div>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
          />

          <div className="flex gap-3 mt-3">
            <div className="w-1/3 flex-col flex gap-2">
              <div className="text-sm font-bold">City</div>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
              />
            </div>

            <div className="w-1/3 flex-col flex gap-2">
              <div className="text-sm font-bold">Kecamatan</div>
              <input
                type="text"
                name="kecamatan"
                value={formData.kecamatan}
                onChange={handleChange}
                className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
              />
            </div>

            <div className="w-1/3 flex-col flex gap-2">
              <div className="text-sm font-bold">Kabupaten</div>
              <input
                type="text"
                name="kabupaten"
                value={formData.kabupaten}
                onChange={handleChange}
                className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-3">
            <div className="w-1/2 flex-col flex gap-2">
              <div className="text-sm font-bold">Province</div>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
              />
            </div>

            <div className="w-1/2 flex-col flex gap-2">
              <div className="text-sm font-bold">Postal Code</div>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-end gap-4">
          <button type="button" className="next_btn" onClick={closeModal}>
            Close
          </button>
          <button type="button" className="next_btn" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
