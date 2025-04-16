import { format } from "date-fns";

const TransactionPrintInvoice = ({ hardware, transaction, formatCurrency, formatWarranty, calculateItemTotal }) => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">THE DAY 21 GROUP</h1>
        <p className="text-sm text-gray-600">
          Service | Repair | Cleaning VGA/GPU 🖥️
        </p>
        <p className="text-sm text-gray-600">
          Supercharging Happiness for Gamers & Creators
        </p>
      </div>

      {/* Invoice Details */}
      <div className="mb-6 flex justify-between">
        <div>
          <h2 className="text-xl font-bold mb-2">Service Invoice</h2>
          <p className="text-sm">Date: {format(new Date(), "dd MMMM yyyy")}</p>
          <p className="text-sm">Invoice No: {transaction?.serviceNumber}</p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Customer Details:</p>
          <p>{transaction?.customer?.constumer_name}</p>
          <p>{transaction?.customer?.wa_number}</p>
          <p>{transaction?.customer?.constumer_address?.street}</p>
          <p>
            {transaction?.customer?.constumer_address?.city},{" "}
            {transaction?.customer?.constumer_address?.kecamatan},{" "}
            {transaction?.customer?.constumer_address?.kabupaten},  {" "}
            {transaction?.customer?.constumer_address?.province},{" "}
            {transaction?.customer?.constumer_address?.postal_code}
          </p>
        </div>
      </div>

      {/* Device Info */}
      <div className="mb-6 p-3 bg-gray-50 rounded">
        <p className="text-sm">
          <span className="font-semibold">Device:</span>{" "}
          {transaction?.deviceModel}
        </p>
        <p className="text-sm">
          <span className="font-semibold">Service Type:</span>{" "}
          {transaction?.serviceType}
        </p>
      </div>

      {/* Hardware Table */}
      <table className="w-full mb-6">
        <thead className="border-t border-b">
          <tr>
            <th className="py-2 text-left">Item</th>
            <th className="py-2 text-center">Warranty</th>
            <th className="py-2 text-right">Price</th>
            <th className="py-2 text-right">Qty</th>
            <th className="py-2 text-right">Disc%</th>
            <th className="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {hardware?.replacedHardware?.map((item) => (
            <tr key={item._id} className="border-b">
              <td className="py-2">{item.name}</td>
              <td className="py-2 text-center">{formatWarranty(item.warranty)}</td>
              <td className="py-2 text-right">{formatCurrency(item.price)}</td>
              <td className="py-2 text-right">{item.quantity}</td>
              <td className="py-2 text-right">{item.discount || 0}%</td>
              <td className="py-2 text-right">
                {item.discount > 0 && (
                  <span className="text-xs text-gray-500 line-through block">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                )}
                {formatCurrency(calculateItemTotal(item))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mb-8">
        <div className="flex justify-between py-1">
          <span>Subtotal</span>
          <span>{formatCurrency(hardware?.replacedHardware?.reduce((acc, item) => acc + (item.price * item.quantity), 0))}</span>
        </div>
        <div className="flex justify-between py-1 text-red-600">
          <span>Total Discount</span>
          <span>-{formatCurrency(hardware?.replacedHardware?.reduce((acc, item) => {
            const subtotal = item.price * item.quantity;
            const discount = subtotal * (item.discount || 0) / 100;
            return acc + discount;
          }, 0))}</span>
        </div>
        <div className="flex justify-between py-1">
          <span>Diagnosis Fee</span>
          <span>{formatCurrency(hardware?.serviceCost?.diagnosis)}</span>
        </div>
        <div className="flex justify-between py-1">
          <span>Workmanship</span>
          <span>{formatCurrency(hardware?.serviceCost?.workmanship)}</span>
        </div>
        <div className="flex justify-between py-1 font-bold border-t mt-2 pt-2">
          <span>Grand Total</span>
          <span>{formatCurrency(hardware?.totalCost)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 grid grid-cols-2 gap-8">

      </div>

      {/* Terms */}
      <div className="mt-8 text-xs text-gray-500">
        <p>📌 * Garansi berlaku sejak barang diterima.</p>
        <p>
          📦 * Kami memastikan setiap barang dikemas dengan baik sebelum
          dikirim. Namun, segala risiko selama pengiriman berada di luar kendali
          kami. 🚚
        </p>
        <p>📝 * Harap simpan invoice ini untuk klaim garansi. Perlu diketahui, cakupan garansi tidak mencakup kerusakan pada komponen lain di luar yang tertera.</p>
      </div>

            {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-xs text-gray-600">
          <div>
            <p className="font-medium">The Day 21 App Documentation</p>
            <p>Generated: {new Date().toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">Supercharging Happiness for Gamers & Creators</p>
            <p>© {new Date().getFullYear()} The Day 21 Group</p>
          </div>
        </div>
        </div>
    </div>
  );
};

export default TransactionPrintInvoice;
