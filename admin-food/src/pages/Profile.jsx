import { useState, useEffect } from "react";
// import { getMyOrders } from "../services/orderService";
import { getWishlist } from "../services/wishlistService";
import { getCart } from "../services/cartService";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { updateProfile } from "../services/profileSevice";
import { FaCamera } from "react-icons/fa";
export default function Profile() {
  const { user, logout } = useAuth();

  const [image, setImage] = useState(null);

  const [editMode, setEditMode] =
    useState(false);
const [stats, setStats] = useState({
  orders: 0,
  wishlist: 0,
  cart: 0,
});
useEffect(() => {
  fetchStats();
}, []);

const fetchStats = async () => {
  try {
    const [
      ordersRes,
      wishlistRes,
      cartRes,
    ] = await Promise.all([
     
      getWishlist(),
      getCart(),
    ]);

    setStats({
      orders:
        ordersRes.data?.orders
          ?.length || 0,

      wishlist:
        wishlistRes.data
          ?.wishlist?.foods
          ?.length || 0,

      cart:
        cartRes.data?.cart
          ?.items?.length || 0,
    });

  } catch (error) {
    console.log(error);
  }
};
  const [formData, setFormData] =
    useState({
      fullname:
        user?.fullname || "",
      email:
        user?.email || "",
      phone:
        user?.phone || "",
    });

const handleSave = async () => {
  try {

    const data =
      new FormData();

    data.append(
      "fullname",
      formData.fullname
    );

    data.append(
      "email",
      formData.email
    );

    data.append(
      "phone",
      formData.phone
    );

    if (image) {
      data.append(
        "profileImage",
        image
      );
    }

    const res =
      await updateProfile(
        data
      );

    toast.success(
      res.data.message
    );

    setEditMode(false);

    console.log(
      res.data
    );

  } catch (error) {

    console.log(error);

    toast.error(
      error.response?.data
        ?.message ||
      "Failed To Update Profile"
    );
  }
};

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-6">

          {/* Sidebar */}

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex flex-col items-center">

            <div className="relative">
  <img
    src={
      image
        ? URL.createObjectURL(image)
        : user?.profileImage ||
          `https://ui-avatars.com/api/?name=${user?.fullname}`
    }
    alt="Profile"
    className="w-24 h-24 rounded-full border-4 border-white shadow object-cover"
  />

  {editMode && (
    <>
      <input
        id="profile-image"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) =>
          setImage(e.target.files[0])
        }
      />

      <label
        htmlFor="profile-image"
        className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-orange-600 transition"
      >
        <FaCamera size={14} />
      </label>
    </>
  )}
</div>

              <h2 className="mt-4 text-xl font-bold">
                {user?.fullname}
              </h2>

              <p className="text-gray-500">
                {user?.email}
              </p>
            </div>

            <div className="mt-8 space-y-3">

              <Link
                to="/profile"
                className="block p-3 rounded-lg bg-orange-100 text-orange-600 font-medium"
              >
                My Profile
              </Link>

              <Link
                to="/orders"
                className="block p-3 rounded-lg hover:bg-gray-100"
              >
                My Orders
              </Link>

              <Link
                to="/wishlist"
                className="block p-3 rounded-lg hover:bg-gray-100"
              >
                Wishlist
              </Link>

              <Link
                to="/cart"
                className="block p-3 rounded-lg hover:bg-gray-100"
              >
                Cart
              </Link>

              <button
                onClick={logout}
                className="w-full bg-red-500 text-white py-3 rounded-lg"
              >
                Logout
              </button>

            </div>
          </div>

          {/* Main Content */}

          <div className="md:col-span-3">

            <div className="bg-white rounded-xl shadow p-6">

              <div className="flex justify-between items-center mb-6">

                <h1 className="text-2xl font-bold">
                  Profile Information
                </h1>

                <button
                  onClick={() =>
                    setEditMode(
                      !editMode
                    )
                  }
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                >
                  {editMode
                    ? "Cancel"
                    : "Edit Profile"}
                </button>

              </div>

              <div className="grid md:grid-cols-2 gap-6">

                <div>
                  <label className="text-gray-500 text-sm">
                    Full Name
                  </label>

                  {editMode ? (
                    <input
                      type="text"
                      value={
                        formData.fullname
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fullname:
                            e.target.value,
                        })
                      }
                      className="w-full border p-3 rounded-lg"
                    />
                  ) : (
                    <div className="mt-1 p-3 border rounded-lg">
                      {user?.fullname}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-gray-500 text-sm">
                    Email
                  </label>

                  <div className="mt-1 p-3 border rounded-lg">
                    {user?.email}
                  </div>
                </div>

                <div>
                  <label className="text-gray-500 text-sm">
                    Phone
                  </label>

                  {editMode ? (
                    <input
                      type="text"
                      value={
                        formData.phone
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone:
                            e.target.value,
                        })
                      }
                      className="w-full border p-3 rounded-lg"
                    />
                  ) : (
                    <div className="mt-1 p-3 border rounded-lg">
                      {user?.phone ||
                        "Not Added"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-gray-500 text-sm">
                    Role
                  </label>

                  <div className="mt-1 p-3 border rounded-lg capitalize">
                    {user?.role}
                  </div>
                </div>

                <div>
                  <label className="text-gray-500 text-sm">
                    Email Status
                  </label>

                  <div className="mt-1 p-3 border rounded-lg">

                    {user?.isVerified ? (
                      <span className="text-green-600">
                        Verified
                      </span>
                    ) : (
                      <span className="text-red-600">
                        Not Verified
                      </span>
                    )}

                  </div>
                </div>

              </div>

              {editMode && (
                <div className="mt-6">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg"
                  >
                    Save Changes
                  </button>
                </div>
              )}

            </div>

            {/* Statistics */}

            <div className="grid md:grid-cols-3 gap-6 mt-6">

  <div className="bg-white rounded-xl shadow p-6 text-center">
    <h3 className="text-gray-500">
      Total Orders
    </h3>

    <p className="text-3xl font-bold mt-2 text-orange-500">
      {stats.orders}
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-6 text-center">
    <h3 className="text-gray-500">
      Wishlist Items
    </h3>

    <p className="text-3xl font-bold mt-2 text-pink-500">
      {stats.wishlist}
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-6 text-center">
    <h3 className="text-gray-500">
      Cart Items
    </h3>

    <p className="text-3xl font-bold mt-2 text-green-500">
      {stats.cart}
    </p>
  </div>

</div>

          </div>

        </div>
      </div>
    </div>
  );
}