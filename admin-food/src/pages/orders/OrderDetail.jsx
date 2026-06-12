import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../services/orderService";

import {
  FaUser,
  FaBox,
  FaTruck,
  FaCreditCard,
  FaMoneyBill,
} from "react-icons/fa";

/* ---------------- STATUS BADGE ---------------- */
const statusBadge = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Preparing":
      return "bg-blue-100 text-blue-700";
    case "Out For Delivery":
      return "bg-purple-100 text-purple-700";
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH ORDER ---------------- */
  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await getAllOrders();

      const found = data.orders.find((o) => o._id === id);
      setOrder(found);
    } catch (err) {
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  /* ---------------- STATUS CHANGE ---------------- */
  const changeStatus = async (status) => {
    try {
      const { data } = await updateOrderStatus(id, {
        orderStatus: status,
      });

      setOrder(data.order);
      toast.success("Status updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading order...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Order Details
        </h1>

        <p className="text-sm text-gray-500">
          Order ID: {order._id}
        </p>

        <div className="mt-3 flex flex-wrap gap-3 items-center">
          <span
            className={`px-3 py-1 text-xs rounded-full ${statusBadge(
              order.orderStatus
            )}`}
          >
            {order.orderStatus}
          </span>

          <select
            value={order.orderStatus}
            onChange={(e) => changeStatus(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          >
            <option>Pending</option>
            <option>Preparing</option>
            <option>Out For Delivery</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* USER */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="flex items-center gap-2 font-semibold mb-3">
            <FaUser /> User Info
          </h2>

          <p><b>Name:</b> {order.user?.fullname}</p>
          <p><b>Email:</b> {order.user?.email}</p>
        </div>

        {/* PAYMENT */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="flex items-center gap-2 font-semibold mb-3">
            <FaCreditCard /> Payment
          </h2>

          <p><b>Method:</b> {order.paymentMethod}</p>
          <p><b>Status:</b> {order.paymentStatus}</p>
        </div>

        {/* ITEMS */}
        <div className="bg-white p-5 rounded-2xl shadow md:col-span-2">
          <h2 className="flex items-center gap-2 font-semibold mb-3">
            <FaBox /> Items
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {order.items?.map((item, i) => (
              <div
                key={i}
                className="flex gap-3 border rounded-lg p-3"
              >
                <img
                  src={item.image}
                  className="w-14 h-14 rounded object-cover"
                />

                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                  <p className="text-orange-500 font-semibold">
                    ₹{item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SHIPPING */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="flex items-center gap-2 font-semibold mb-3">
            <FaTruck /> Shipping
          </h2>

          <p>{order.shippingAddress?.fullName}</p>
          <p>{order.shippingAddress?.phone}</p>
          <p>{order.shippingAddress?.city}</p>
        </div>

        {/* PRICE */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="flex items-center gap-2 font-semibold mb-3">
            <FaMoneyBill /> Pricing
          </h2>

          <p>Total: ₹{order.totalPrice}</p>
          <p className="text-lg font-bold text-green-600">
            Final: ₹{order.finalPrice}
          </p>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="mt-6 bg-white p-5 rounded-2xl shadow">
        <h2 className="font-semibold mb-3">Quick Actions</h2>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => changeStatus("Preparing")}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
          >
            Preparing
          </button>

          <button
            onClick={() => changeStatus("Out For Delivery")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Out For Delivery
          </button>

          <button
            onClick={() => changeStatus("Delivered")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Delivered
          </button>
        </div>
      </div>

    </div>
  );
}