import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";
import { updateProfile } from "../services/profileSevice";
import { getMyOrders } from "../services/orderService";
import { getWishlist } from "../services/wishlistService";
import { getCart } from "../services/cartService";

import {
  FaUser,
  FaShoppingBag,
  FaHeart,
  FaShoppingCart,
  FaSignOutAlt,
  FaEdit,
  FaSave,
  FaCamera,
} from "react-icons/fa";

export default function Profile() {
  const { user, logout } = useAuth();

  const [image, setImage] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [stats, setStats] = useState({
    orders: 0,
    wishlist: 0,
    cart: 0,
  });

  const [formData, setFormData] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ordersRes, wishlistRes, cartRes] = await Promise.all([
        getMyOrders(),
        getWishlist(),
        getCart(),
      ]);

      setStats({
        orders: ordersRes.data?.orders?.length || 0,
        wishlist: wishlistRes.data?.wishlist?.foods?.length || 0,
        cart: cartRes.data?.cart?.items?.length || 0,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("fullname", formData.fullname);
      data.append("email", formData.email);
      data.append("phone", formData.phone);

      if (image) data.append("profileImage", image);

      const res = await updateProfile(data);

      toast.success(res.data.message);
      setEditMode(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-white py-10 px-4 mt-15">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">

        {/* SIDEBAR */}
        <div className="bg-[#13151b] border border-white/10 rounded-2xl p-6">

          {/* Avatar */}
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={
                  image
                    ? URL.createObjectURL(image)
                    : user?.profileImage ||
                      `https://ui-avatars.com/api/?name=${user?.fullname}`
                }
                className="w-24 h-24 rounded-full object-cover border-2 border-orange-500"
              />

              {editMode && (
                <>
                  <input
                    id="img"
                    type="file"
                    className="hidden"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                  <label
                    htmlFor="img"
                    className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full cursor-pointer"
                  >
                    <FaCamera size={12} />
                  </label>
                </>
              )}
            </div>

            <h2 className="mt-4 font-semibold text-lg">
              {user?.fullname}
            </h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>

          {/* NAV */}
          <div className="mt-8 space-y-2 text-sm">
            <SidebarItem icon={<FaUser />} label="Profile" active />
            <SidebarLink icon={<FaShoppingBag />} label="My Orders" to="/orders" />
        

            <button
              onClick={logout}
              className="w-full mt-4 flex items-center gap-2 justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-xl transition"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>

        {/* MAIN */}
        <div className="md:col-span-3 space-y-6">

          {/* PROFILE CARD */}
          <div className="bg-[#13151b] border border-white/10 rounded-2xl p-6">

            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold">Profile</h1>

              <button
                onClick={() => setEditMode(!editMode)}
                className="flex items-center gap-2 bg-orange-500 px-4 py-2 rounded-xl"
              >
                {editMode ? <FaSave /> : <FaEdit />}
                {editMode ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">

              <Input label="Full Name" editMode={editMode}
                value={formData.fullname}
                onChange={(e) =>
                  setFormData({ ...formData, fullname: e.target.value })
                }
              />

              <ReadOnly label="Email" value={user?.email} />

              <Input label="Phone" editMode={editMode}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />

              <ReadOnly label="Role" value={user?.role} />
            </div>

            {editMode && (
              <button
                onClick={handleSave}
                className="mt-6 bg-green-500 px-6 py-2 rounded-xl"
              >
                Save Changes
              </button>
            )}
          </div>

          {/* STATS */}
          <div className="grid md:grid-cols-3 gap-4">

            <StatCard title="Orders" value={stats.orders} color="orange" />
            <StatCard title="Wishlist" value={stats.wishlist} color="pink" />
            <StatCard title="Cart" value={stats.cart} color="green" />

          </div>

        </div>
      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function SidebarItem({ icon, label, active }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${active ? "bg-orange-500/20 text-orange-400" : "text-gray-400"}`}>
      {icon}
      {label}
    </div>
  );
}

function SidebarLink({ icon, label, to }) {
  return (
    <Link to={to} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-300">
      {icon}
      {label}
    </Link>
  );
}

function Input({ label, value, onChange, editMode }) {
  return (
    <div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      {editMode ? (
        <input
          className="w-full bg-black/30 border border-white/10 p-2 rounded-lg"
          value={value}
          onChange={onChange}
        />
      ) : (
        <div className="p-2 bg-black/20 rounded-lg">{value}</div>
      )}
    </div>
  );
}

function ReadOnly({ label, value }) {
  return (
    <div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <div className="p-2 bg-black/20 rounded-lg">{value}</div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    orange: "text-orange-400",
    pink: "text-pink-400",
    green: "text-green-400",
  };

  return (
    <div className="bg-[#13151b] border border-white/10 rounded-2xl p-6 text-center">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className={`text-3xl font-bold mt-2 ${colors[color]}`}>
        {value}
      </h2>
    </div>
  );
}