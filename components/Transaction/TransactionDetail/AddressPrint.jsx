import { format } from "date-fns";

const AddressPrint = ({ transaction }) => {
  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="border-2 border-gray-800 p-4 rounded">
        {/* Service Number */}
        <div className="text-right mb-2 text-sm">
          <p>No: {transaction?.serviceNumber}</p>
          <p>{format(new Date(transaction?.createdAt), "dd/MM/yyyy")}</p>
        </div>

        {/* Recipient Details */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">Kepada Yth:</p>
          <h3 className="font-bold text-lg mb-1">
            {transaction?.customer?.constumer_name}
          </h3>
          <p className="text-sm mb-1">{transaction?.customer?.wa_number}</p>
          <p className="text-sm">
            {transaction?.customer?.constumer_address?.street}
            {transaction?.customer?.constumer_address?.street && ","} {" "}
            {transaction?.customer?.constumer_address?.kecamatan}
            {transaction?.customer?.constumer_address?.kecamatan && ","} {" "}
            {transaction?.customer?.constumer_address?.kabupaten}
            {transaction?.customer?.constumer_address?.kabupaten && ","} {" "}
            {transaction?.customer?.constumer_address?.province}
            {transaction?.customer?.constumer_address?.province && ","} {" "}
            {transaction?.customer?.constumer_address?.postal_code}
          </p>
        </div>

        {/* Device Details */}
        <div className="border-t border-gray-300 py-2 mb-4 text-sm">
          <p><span className="font-semibold">Device:</span> {transaction?.deviceModel}</p>
          <p><span className="font-semibold">Service:</span> {transaction?.serviceType}</p>
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
