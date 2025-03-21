import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CustomerAdd = () => {
  // State untuk menangani data form
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    company: "",
    organisation: "",
    street: "",
    city: "",
    kecamatan: "",
    kabupaten: "",
    province: "",
    postalCode: "",
    status: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const toggleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === "active" ? "deactive" : "active",
    }));
  };

  // Function to check if all required fields are filled
  const checkFormValidity = () => {
    const allFieldsFilled = Object.values(formData).every(
      (value) => value.trim() !== ""
    );
    setIsFormValid(allFieldsFilled); // Update state based on form validity
  };

  useEffect(() => {
    checkFormValidity();
  }, [formData]);

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      { field: "firstName", label: "Nama Depan" },
      { field: "lastName", label: "Nama Belakang" },
      { field: "phoneNumber", label: "Nomor Telepon" },
      { field: "company", label: "Nama Perusahaan" },
      { field: "organisation", label: "Organisasi" },
      { field: "street", label: "Alamat Jalan" },
      { field: "city", label: "Kota" },
      { field: "kecamatan", label: "Kecamatan" },
      { field: "kabupaten", label: "Kabupaten" },
      { field: "province", label: "Provinsi" },
      { field: "postalCode", label: "Kode Pos" },
      { field: "status", label: "Status" },
    ];

    for (let { field, label } of requiredFields) {
      if (!formData[field].trim()) {
        toast.error(`"${label}" belum diisi. Harap lengkapi semua field.`, {
          position: "bottom-right",
          autoClose: 5000, // Close after 5 seconds
          hideProgressBar: false, // Show progress bar
          closeOnClick: true, // Allow closing the toast by clicking
        });
        return; // Stop execution if a field is empty
      }
    }

    const customerData = {
      wa_number: formData.phoneNumber, // Use phoneNumber as wa_number
      constumer_name: `${formData.firstName} ${formData.lastName}`,
      organisation: formData.organisation,
      company: formData.company,
      status: formData.status,
      constumer_address: {
        street: formData.street,
        city: formData.city,
        kecamatan: formData.kecamatan,
        kabupaten: formData.kabupaten,
        province: formData.province,
        postal_code: formData.postalCode,
      },
    };

    try {
      const response = await fetch("/api/customer/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData), // Send data to the backend
      });

      const contentType = response.headers.get("Content-Type");
      const responseText = await response.text(); // Read the response as text to debug

      if (!response.ok) {
        if (response.status === 409) {
          // Handle 409 Conflict error when phone number already exists
          toast.error("Nomor telepon sudah terdaftar.", {
            position: "bottom-right",
            autoClose: 5000, // Close after 5 seconds
            hideProgressBar: false, // Show progress bar
            closeOnClick: true, // Allow closing the toast by clicking
          });
          return; // Exit early if we hit a conflict error
        }

        // If not 409, handle other errors
        const errorData = contentType.includes("application/json")
          ? JSON.parse(responseText)
          : { message: responseText || "Gagal menyimpan data" };

        throw new Error(errorData.message || "Gagal menyimpan data");
      }

      // Success - redirect to customer list
      toast.success("Customer successfully added!");
      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        company: "",
        organisation: "",
        street: "",
        city: "",
        kecamatan: "",
        kabupaten: "",
        province: "",
        postalCode: "",
        status: "",
      });

      // Optionally reset form validity state if you have additional logic for it
      setIsFormValid(false);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };
  return (
    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-800/20 to-pink-900/20" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[700px] h-[700px] bg-pink-500/20 rounded-full mix-blend-multiply filter blur-[128px]"></div>
      </div>
      {/* General Section - Menggunakan 3 bagian dari total 4 */}
      <div className="flex-[2.5]  relative bg-white/1 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg   w-1/3 h-full">
        <div className="flex flex-col gap-4">
          {/* General Information Section */}
          <div className="font-medium text-xl">General Information</div>

          {/* Name Customer */}
          <div className="flex gap-4 flex-col">
            {/* First Name */}
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 w-1/2">
                <div className="font-medium text-sm">First Name</div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-2 w-1/2">
                <div className="font-medium text-sm">Last Name</div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                />
              </div>
            </div>

            <div className="flex gap-4 flex-col">
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 w-1/2">
                  <div className="font-medium text-sm">Company</div>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                  />
                </div>

                <div className="flex flex-col gap-2 w-1/2">
                  <div className="font-medium text-sm">Phone Number</div>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Organisation */}
              <div className="flex  flex-col gap-2 w-1/2">
                <div className="flex flex-col gap-2">
                  <div className="font-medium text-sm">Organisation</div>
                  <input
                    type="text"
                    name="organisation"
                    value={formData.organisation}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
                  />
                </div>

                <div>
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-bold ">Status</div>
                    <div
                      className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition ${
                        formData.status === "active"
                          ? "bg-green-500"
                          : "bg-orange-500"
                      }`}
                      onClick={toggleStatus}
                    >
                      <div
                        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition ${
                          formData.status === "active"
                            ? "translate-x-6"
                            : "translate-x-0"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="font-medium text-xl">Address</div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Street */}
            <div className="flex flex-col gap-2">
              <div className="font-medium text-sm">Street</div>
              <input
                type="text"
                name="street"
                value={formData.street}
                placeholder="Jalan"
                onChange={handleChange}
                className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
              />
            </div>

            {/* City */}
            <div className="flex flex-col gap-2">
              <div className="font-medium text-sm">City</div>
              <input
                type="text"
                name="city"
                value={formData.city}
                placeholder="Kelurahan / Kota"
                onChange={handleChange}
                className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
              />
            </div>

            {/* Kecamatan */}
            <div className="flex flex-col gap-2">
              <div className="font-medium text-sm">Kecamatan</div>
              <input
                type="text"
                name="kecamatan"
                value={formData.kecamatan}
                placeholder="Kecamatan"
                onChange={handleChange}
                className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
              />
            </div>

            {/* Kabupaten */}
            <div className="flex flex-col gap-2">
              <div className="font-medium text-sm">Kabupaten</div>
              <input
                type="text"
                name="kabupaten"
                value={formData.kabupaten}
                placeholder="Kabupaten"
                onChange={handleChange}
                className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
              />
            </div>

            {/* Province */}
            <div className="flex flex-col gap-2">
              <div className="font-medium text-sm">Province</div>
              <input
                type="text"
                name="province"
                value={formData.province}
                placeholder="Provinsi"
                onChange={handleChange}
                className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
              />
            </div>

            {/* Postal Code */}
            <div className="flex flex-col gap-2">
              <div className="font-medium text-sm">Postal Code</div>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                placeholder="Postal Code"
                onChange={handleChange}
                className="w-full p-2 bg-[#131b2e]/60 border border-[#2a3548] rounded-md focus:outline-none focus:border-blue-500 text-gray-100 placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Button Save in bottom right corner */}
      </div>

      {/* Preview Section - Menggunakan 1 bagian dari total 4 */}
      <div className="flex-[1]  flex flex-col justify-between relative bg-white/1 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg l">
        <div>
          <div className="text-xl font-medium">Preview</div>

          <div className="font-medium text-sm mt-3">Name</div>
          <p>{`${formData.firstName} ${formData.lastName}`}</p>

          <div className="flex flex-col gap-2 mt-3">
            <div className="font-medium text-sm">Phone Number</div>
            <p>{formData.phoneNumber}</p>
            <div className="font-medium text-sm">Company</div>
            <p>{formData.company}</p>
            <div className="font-medium text-sm">Organisation</div>
            <p>{formData.organisation}</p>
            <div className="font-medium text-sm">Address</div>
            <p>{`${formData.street}, ${formData.city}, ${formData.kecamatan}, ${formData.kabupaten}, ${formData.province}, ${formData.postalCode}`}</p>
          </div>
        </div>

        {/* Tombol Save di bawah */}
        <div className="flex  items-center  justify-center">
          <div
            className="topactive_btn inline-flex items-center justify-center px-4 py-2 rounded-md text-center cursor-pointer mt-4 max-w-max"
            onClick={handleSubmit}
          >
            Save
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAdd;
