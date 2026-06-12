import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getAllPayments,
  refundPayment,
} from "../../services/paymentService";

import {
  FaSearch,
  FaMoneyBillWave,
  FaUser,
  FaCreditCard,
  FaReceipt,
  FaUndo,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPayments = async () => {
    try {
      const { data } = await getAllPayments();
      setPayments(data.payments);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRefund = async (orderId) => {
    const reason = prompt("Refund Reason");
    if (!reason) return;

    try {
      await refundPayment(orderId, reason);
      toast.success("Refund Successful");
      fetchPayments();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const filteredPayments = payments.filter(
    (payment) =>
      payment.user?.fullname
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      payment._id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-40 text-gray-500 gap-2">
        <FaSpinner className="animate-spin" />
        Loading payments...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaMoneyBillWave className="text-green-600" />
        Payment Management
      </h1>

      {/* SEARCH */}
      <div className="relative mb-5">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by customer or order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border pl-10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 flex items-center gap-2">
                <FaReceipt /> Order
              </th>
              <th className="p-3">
                <FaUser className="inline mr-1" /> Customer
              </th>
              <th className="p-3">
                <FaMoneyBillWave className="inline mr-1" /> Amount
              </th>
              <th className="p-3">
                <FaCreditCard className="inline mr-1" /> Method
              </th>
              <th className="p-3">Status</th>
              <th className="p-3">Razorpay ID</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3 font-medium">{payment.orderNumber}</td>

                <td className="p-3">{payment.user?.fullname}</td>

                <td className="p-3 font-semibold text-green-600">
                  ₹{payment.finalPrice}
                </td>

                <td className="p-3">{payment.paymentMethod}</td>

                <td className="p-3">
                  {payment.paymentStatus === "Paid" ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <FaCheckCircle /> Paid
                    </span>
                  ) : payment.paymentStatus === "Refunded" ? (
                    <span className="flex items-center gap-1 text-red-600">
                      <FaTimesCircle /> Refunded
                    </span>
                  ) : (
                    <span className="text-orange-500">Pending</span>
                  )}
                </td>

                <td className="p-3 text-xs text-gray-600">
                  {payment.paymentInfo?.razorpayPaymentId}
                </td>

                <td className="p-3">
                  {payment.paymentStatus === "Paid" && (
                    <button
                      onClick={() => handleRefund(payment._id)}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      <FaUndo />
                      Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}