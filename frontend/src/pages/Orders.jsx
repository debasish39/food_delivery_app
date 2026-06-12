import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getOrders = async () => {
    try {
      const { data } = await API.get("/orders/my-orders");
      setOrders(data.orders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b0e] flex items-center justify-center text-white">
        <div className="text-gray-400 animate-pulse">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-white px-4 py-10 mt-15">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold">
          My <span className="text-orange-500">Orders</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Track your food orders and history
        </p>
      </div>

      {/* Orders Grid */}
      <div className="max-w-6xl mx-auto space-y-6">
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            No orders found 🍽️
          </div>
        ) : (
          orders.map((order) => (
            <Link
              to={`/orders/${order._id}`}
              key={order._id}
              className="block group"
            >
              <div className="bg-[#13151b] border border-white/10 rounded-2xl p-5 
                              hover:border-orange-500/30 hover:shadow-[0_0_25px_rgba(249,115,22,0.15)]
                              transition-all duration-300">

                {/* Top Section */}
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h2 className="font-semibold text-lg group-hover:text-orange-400 transition">
                      Order #{order._id.slice(-6)}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span className="px-3 py-1 text-xs rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    {order.orderStatus}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-[#0f1116] p-3 rounded-xl"
                    >
                      <img
                        src={item.images?.[0] || item.image}
                        alt={item.title}
                        className="w-14 h-14 rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <h3 className="font-medium text-sm">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="text-orange-400 font-semibold text-sm">
                        ₹{item.price}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-5 flex justify-between items-center border-t border-white/10 pt-4">
                  <span className="text-gray-400 text-sm">
                    Total Amount
                  </span>
                  <span className="text-lg font-bold text-orange-500">
                    ₹{order.finalPrice}
                  </span>
                </div>

              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}