import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getAllOrders,
  deleteOrder,
  updateOrderStatus, // ✅ ADDED
} from "../../services/orderService";

import {
  FaUtensils,
  FaMapMarkerAlt,
  FaCreditCard,
  FaMoneyBillWave,
  FaTruck,
  FaTrash,
  FaChevronDown,
  FaUser,
  FaEye,
  FaEyeSlash,
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

/* ---------------- ACCORDION ---------------- */
function Accordion({ label, icon, open, onClick, children }) {
  return (
    <div className="border rounded-xl overflow-hidden mb-3 bg-white shadow-sm">
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-4 py-3 transition ${
          open ? "bg-gray-100" : "bg-gray-50 hover:bg-gray-100"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border shadow-sm text-gray-700">
            {icon}
          </div>

          <div className="flex flex-col items-start leading-tight">
            <span className="text-sm font-semibold text-gray-800">
              {label}
            </span>
            <span className="text-[11px] text-gray-400">
              Click to {open ? "collapse" : "expand"}
            </span>
          </div>
        </div>

        <div className={`transition-transform duration-200 text-gray-600 ${open ? "rotate-180" : ""}`}>
          <FaChevronDown />
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden px-4 py-3 border-t text-sm bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------------- MAIN ---------------- */
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState({});
  const [allExpanded, setAllExpanded] = useState(false);
const [showDeliveryModal, setShowDeliveryModal] = useState(false);

const [selectedOrderId, setSelectedOrderId] =
  useState(null);

const [deliveryForm, setDeliveryForm] = useState({
  deliveryPartner: "",
  deliveryPartnerPhone: "",
  vehicleNumber: "",
  deliveryCharge: "",
  estimatedArrivalTime: "",
});
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await getAllOrders();
      setOrders(data.orders);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleSection = (orderId, section) => {
    setOpenSections((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [section]: !prev[orderId]?.[section],
      },
    }));
  };

  const isOpen = (orderId, section) =>
    openSections[orderId]?.[section];

  /* ---------------- EXPAND / COLLAPSE ALL ---------------- */
  const expandAllPages = () => {
    const newState = {};
    orders.forEach((order) => {
      newState[order._id] = {
        items: true,
        shipping: true,
        payment: true,
        price: true,
        delivery: true,
      };
    });
    setOpenSections(newState);
    setAllExpanded(true);
  };

  const collapseAllPages = () => {
    const newState = {};
    orders.forEach((order) => {
      newState[order._id] = {
        items: false,
        shipping: false,
        payment: false,
        price: false,
        delivery: false,
      };
    });
    setOpenSections(newState);
    setAllExpanded(false);
  };

  /* ---------------- UPDATE STATUS (NEW) ---------------- */
 const handleStatusChange = async (
  orderId,
  status
) => {
  if (status === "Out For Delivery") {
    setSelectedOrderId(orderId);
    setShowDeliveryModal(true);
    return;
  }

  try {
    await updateOrderStatus(orderId, {
      orderStatus: status,
    });

    toast.success("Status updated");

    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId
          ? { ...o, orderStatus: status }
          : o
      )
    );
  } catch (err) {
    toast.error(
      err.response?.data?.message
    );
  }
};
const submitDeliveryDetails =
  async () => {
    try {
      const payload = {
        orderStatus:
          "Out For Delivery",

        deliveryPartner:
          deliveryForm.deliveryPartner,

        deliveryPartnerPhone:
          deliveryForm.deliveryPartnerPhone,

        vehicleNumber:
          deliveryForm.vehicleNumber,

        deliveryCharge:
          deliveryForm.deliveryCharge,

        estimatedArrivalTime:
          deliveryForm.estimatedArrivalTime,
      };

      const { data } =
        await updateOrderStatus(
          selectedOrderId,
          payload
        );

      toast.success(
        "Order sent for delivery"
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === selectedOrderId
            ? data.order
            : o
        )
      );

      setShowDeliveryModal(false);

      setDeliveryForm({
        deliveryPartner: "",
        deliveryPartnerPhone: "",
        vehicleNumber: "",
        deliveryCharge: "",
        estimatedArrivalTime: "",
      });

    } catch (err) {
      toast.error(
        err.response?.data?.message
      );
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete order?")) return;

    try {
      await deleteOrder(id);
      toast.success("Order deleted");
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  if (loading)
    return <div className="p-6 text-gray-500">Loading orders...</div>;

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Orders</h1>

        <div className="flex border rounded-lg overflow-hidden text-xs shadow-sm">
          <button
            onClick={expandAllPages}
            className="px-3 py-1 bg-white hover:bg-green-50 flex items-center gap-1"
          >
            <FaEye className="text-green-600" />
            Expand All
          </button>

          <button
            onClick={collapseAllPages}
            className="px-3 py-1 bg-white hover:bg-gray-100 flex items-center gap-1 border-l"
          >
            <FaEyeSlash />
            Collapse All
          </button>
        </div>
      </div>

      {/* ORDERS */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl shadow border p-4 sm:p-6"
          >

            {/* HEADER + STATUS */}
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <p><b>Order ID:</b> {order._id}</p>

                {/* STATUS BADGE */}
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusBadge(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>

                {/* ✅ STATUS UPDATE DROPDOWN */}
                <div>
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="mt-2 text-xs border rounded px-2 py-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out For Delivery">Out For Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* USER */}
            <div className="border rounded-lg p-3 bg-gray-50 mb-3">
              <p className="flex items-center gap-2 font-semibold">
                <FaUser className="text-indigo-500" />
                User Details
              </p>
              <p><b>Name:</b> {order.user?.fullname}</p>
              <p><b>Email:</b> {order.user?.email}</p>
            </div>

            {/* ITEMS */}
            <Accordion
              label="Items"
              icon={<FaUtensils className="text-orange-500" />}
              open={isOpen(order._id, "items")}
              onClick={() => toggleSection(order._id, "items")}
            >
              {order.items?.map((item, i) => (
                <div key={i} className="flex gap-3 border p-2 rounded mb-2">
                  <img src={item.image} className="w-12 h-12 rounded object-cover" />
                  <div>
                    <p><b>{item.title}</b></p>
                    <p>Qty: {item.quantity}</p>
                    <p>₹{item.price}</p>
                  </div>
                </div>
              ))}
            </Accordion>

            {/* SHIPPING */}
            <Accordion
              label="Shipping Address"
              icon={<FaMapMarkerAlt className="text-red-500" />}
              open={isOpen(order._id, "shipping")}
              onClick={() => toggleSection(order._id, "shipping")}
            >
              <p><b>Name:</b> {order.shippingAddress?.fullName}</p>
              <p><b>Phone:</b> {order.shippingAddress?.phone}</p>
              <p><b>City:</b> {order.shippingAddress?.city}</p>
            </Accordion>

            {/* PAYMENT */}
            <Accordion
              label="Payment"
              icon={<FaCreditCard className="text-blue-500" />}
              open={isOpen(order._id, "payment")}
              onClick={() => toggleSection(order._id, "payment")}
            >
              <p><b>Method:</b> {order.paymentMethod}</p>
              <p><b>Status:</b> {order.paymentStatus}</p>
            </Accordion>

            {/* PRICE */}
            <Accordion
              label="Price"
              icon={<FaMoneyBillWave className="text-green-600" />}
              open={isOpen(order._id, "price")}
              onClick={() => toggleSection(order._id, "price")}
            >
              <p>Total: ₹{order.totalPrice}</p>
              <p>Final: ₹{order.finalPrice}</p>
            </Accordion>

            {/* DELIVERY */}
            <Accordion
              label="Delivery"
              icon={<FaTruck className="text-purple-600" />}
              open={isOpen(order._id, "delivery")}
              onClick={() => toggleSection(order._id, "delivery")}
            >
              <p>Partner: {order.deliveryInfo?.deliveryPartner || "-"}</p>
              <p>Phone: {order.deliveryInfo?.deliveryPartnerPhone || "-"}</p>
              <p>Vehicle: {order.deliveryInfo?.vehicleNumber || "-"}</p>
            </Accordion>

            {/* DELETE */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleDelete(order._id)}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
              >
                <FaTrash />
                Delete Order
              </button>
            </div>

          </div>
        ))}
      </div>
      {showDeliveryModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">

      <h2 className="text-xl font-bold mb-4">
        Delivery Details
      </h2>

      <div className="space-y-3">

        <input
          type="text"
          placeholder="Delivery Partner"
          value={deliveryForm.deliveryPartner}
          onChange={(e) =>
            setDeliveryForm({
              ...deliveryForm,
              deliveryPartner:
                e.target.value,
            })
          }
          className="w-full border rounded-lg p-2"
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={
            deliveryForm.deliveryPartnerPhone
          }
          onChange={(e) =>
            setDeliveryForm({
              ...deliveryForm,
              deliveryPartnerPhone:
                e.target.value,
            })
          }
          className="w-full border rounded-lg p-2"
        />

        <input
          type="text"
          placeholder="Vehicle Number"
          value={
            deliveryForm.vehicleNumber
          }
          onChange={(e) =>
            setDeliveryForm({
              ...deliveryForm,
              vehicleNumber:
                e.target.value,
            })
          }
          className="w-full border rounded-lg p-2"
        />

        <input
          type="number"
          placeholder="Delivery Charge"
          value={
            deliveryForm.deliveryCharge
          }
          onChange={(e) =>
            setDeliveryForm({
              ...deliveryForm,
              deliveryCharge:
                e.target.value,
            })
          }
          className="w-full border rounded-lg p-2"
        />

        <input
          type="text"
          placeholder="ETA (30 mins)"
          value={
            deliveryForm.estimatedArrivalTime
          }
          onChange={(e) =>
            setDeliveryForm({
              ...deliveryForm,
              estimatedArrivalTime:
                e.target.value,
            })
          }
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="flex justify-end gap-2 mt-5">
        <button
          onClick={() =>
            setShowDeliveryModal(false)
          }
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={submitDeliveryDetails}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Send For Delivery
        </button>
      </div>

    </div>
  </div>
)}
    </div>
    
  );
}