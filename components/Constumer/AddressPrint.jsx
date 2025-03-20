import { format } from "date-fns";

const AddressPrint = ({ customer }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? "Invalid date" : format(date, "dd/MM/yyyy");
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="border-2 border-gray-800 p-4 rounded">
        {/* Service Number */}
        <div className="text-right mb-2 text-sm">
          <p>{formatDate(customer?.createdAt)}</p>
        </div>

        {/* Recipient Details */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">Kepada Yth:</p>
          <h3 className="font-bold text-lg mb-1">{customer?.constumer_name}</h3>
          <p className="text-sm mb-1">{customer?.wa_number}</p>
          <p className="text-sm">
            {customer?.constumer_address?.street}
            {customer?.constumer_address?.street && ","}{" "}
            {customer?.constumer_address?.kecamatan}
            {customer?.constumer_address?.kecamatan && ","}{" "}
            {customer?.constumer_address?.kabupaten}
            {customer?.constumer_address?.kabupaten && ","}{" "}
            {customer?.constumer_address?.province}
            {customer?.constumer_address?.province && ","}{" "}
            {customer?.constumer_address?.postal_code}
          </p>
        </div>

        {/* Sender Details */}
        <div className="border-t border-gray-300 pt-2">
          <p className="text-xs text-gray-500 mb-1">Pengirim:</p>
          <p className="font-bold">Dimas Kurniawan</p>
          <div className="text-sm">
            Kadipiro RT 03/10 Bejen, Karanganyar,
            <br />
            Kab. Karanganyar, Jawa Tengah 57716
          </div>
          <p className="font-bold text-sm">085-721-977-614</p>
        </div>
      </div>
    </div>
  );
};

export default AddressPrint;
