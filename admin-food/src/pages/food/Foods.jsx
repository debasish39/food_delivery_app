import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  FaTrash,
  FaEdit,
  FaHeart,
  FaShoppingCart,
  FaSearch,
} from "react-icons/fa";

import {
  getFoods,
  searchFoods,
  deleteFood,
} from "../../services/foodService";

import useAuth from "../../hooks/useAuth";
import { addToCart } from "../../services/cartService";
import { addToWishlist } from "../../services/wishlistService";

export default function Foods() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const { user } = useAuth();

  // ---------------- FETCH FOODS ----------------
  const fetchFoods = async () => {
    try {
      const { data } = await getFoods();
      setFoods(data.foods);
    } catch (error) {
      toast.error("Failed to load foods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // ---------------- SEARCH ----------------
  const handleSearch = async (e) => {
    const value = e.target.value;
    setKeyword(value);

    try {
      if (!value.trim()) {
        fetchFoods();
        return;
      }

      const { data } = await searchFoods(value);
      setFoods(data.foods);
    } catch {
      toast.error("Search failed");
    }
  };

  // ---------------- DELETE FOOD ----------------
  const handleDeleteFood = async (id) => {
    if (!window.confirm("Delete this food?")) return;

    try {
      await deleteFood(id);
      setFoods((prev) => prev.filter((f) => f._id !== id));
      toast.success("Food deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // ---------------- CART ----------------
  const handleAddToCart = async (foodId) => {
    try {
      await addToCart(foodId, 1);
      toast.success("Added to cart");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  // ---------------- WISHLIST ----------------
  const handleWishlist = async (foodId) => {
    try {
      await addToWishlist(foodId);
      toast.success("Added to wishlist");
    } catch {
      toast.error("Failed");
    }
  };

  // ---------------- LOADING UI ----------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading delicious foods...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white px-4 py-10">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            🍔 Our Menu
          </h1>
          <p className="text-gray-500">
            Fresh & delicious meals delivered to you
          </p>
        </div>

        {user?.role === "admin" && (
          <Link
            to="/admin/foods/create"
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl transition"
          >
            + Add Food
          </Link>
        )}
      </div>

      {/* SEARCH */}
      <div className="max-w-7xl mx-auto mb-10 relative">
        <FaSearch className="absolute top-4 left-4 text-gray-400" />

        <input
          type="text"
          value={keyword}
          onChange={handleSearch}
          placeholder="Search delicious food..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-400 outline-none"
        />
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {foods.map((food) => (
          <div
            key={food._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group"
          >

            {/* IMAGE */}
            <Link to={`/foods/${food._id}`}>
              <img
                src={
                  food.images?.[0] ||
                  "https://via.placeholder.com/300"
                }
                className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
              />
            </Link>

            {/* CONTENT */}
            <div className="p-4">

              <Link to={`/foods/${food._id}`}>
                <h2 className="font-bold text-lg hover:text-orange-500 transition">
                  {food.title}
                </h2>
              </Link>

              <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                {food.description}
              </p>

              {/* CATEGORY */}
              <span className="inline-block mt-2 text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
                {food.category?.name}
              </span>

              {/* PRICE + STOCK */}
              <div className="flex justify-between items-center mt-4">

                <span className="text-xl font-bold text-orange-500">
                  ₹{food.price}
                </span>

                <span className="text-sm text-green-600">
                  Stock: {food.stock}
                </span>

              </div>

              {/* USER ACTIONS */}
              {user?.role !== "admin" && (
                <div className="flex gap-2 mt-4">

                  <button
                    onClick={() => handleAddToCart(food._id)}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart /> Cart
                  </button>

                  <button
                    onClick={() => handleWishlist(food._id)}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-3 rounded-xl"
                  >
                    <FaHeart />
                  </button>

                </div>
              )}

              {/* ADMIN ACTIONS */}
              {user?.role === "admin" && (
                <div className="flex gap-2 mt-4">

                  <Link
                    to={`/admin/foods/edit/${food._id}`}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl flex items-center justify-center gap-2"
                  >
                    <FaEdit /> Edit
                  </Link>

                  <button
                    onClick={() => handleDeleteFood(food._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl flex items-center justify-center gap-2"
                  >
                    <FaTrash /> Delete
                  </button>

                </div>
              )}

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}