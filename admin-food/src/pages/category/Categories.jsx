import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getCategories,
  deleteCategory,
} from "../../services/categoryService";

import { getFoodsByCategory } from "../../services/foodService";

import {
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  UtensilsCrossed,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openCategory, setOpenCategory] = useState(null);
  const [foods, setFoods] = useState({});
  const [loadingFoods, setLoadingFoods] = useState({});

  // FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await getCategories();
      setCategories(data.categories);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // DELETE CATEGORY
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);
      toast.success("Category deleted");

      setCategories((prev) =>
        prev.filter((cat) => cat._id !== id)
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // TOGGLE CATEGORY FOODS
  const toggleCategory = async (categoryId) => {
    if (openCategory === categoryId) {
      setOpenCategory(null);
      return;
    }

    setOpenCategory(categoryId);

    if (foods[categoryId]) return;

    try {
      setLoadingFoods((prev) => ({
        ...prev,
        [categoryId]: true,
      }));

      const { data } = await getFoodsByCategory(categoryId);

      setFoods((prev) => ({
        ...prev,
        [categoryId]: data.foods,
      }));
    } catch (error) {
      toast.error("Failed to load foods");
    } finally {
      setLoadingFoods((prev) => ({
        ...prev,
        [categoryId]: false,
      }));
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <Loader2 className="animate-spin mr-2" />
        Loading categories...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white p-4 md:p-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2">
            <UtensilsCrossed className="text-orange-500" />
            Categories
          </h1>
          <p className="text-gray-500">
            Manage food categories & items
          </p>
        </div>

        <Link
          to="/admin/categories/create"
          className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl shadow-md transition"
        >
          <Plus size={18} />
          Add Category
        </Link>
      </div>

      {/* LIST */}
      <div className="space-y-6">

        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-white rounded-2xl shadow-md border hover:shadow-xl transition overflow-hidden"
          >

            {/* CATEGORY HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5">

              <div className="flex items-center gap-4">

                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                  {category.image ? (
                    <img
                      src={category.image?.url || category.image}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="text-gray-400" />
                  )}
                </div>

                <div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-800">
                    {category.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {category.description || "No description"}
                  </p>
                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-3">

                <button
                  onClick={() => toggleCategory(category._id)}
                  className="p-2 rounded-lg hover:bg-orange-50 transition"
                >
                  <ChevronDown
                    className={`transition ${
                      openCategory === category._id
                        ? "rotate-180 text-orange-500"
                        : "text-gray-500"
                    }`}
                  />
                </button>

                <Link
                  to={`/admin/categories/edit/${category._id}`}
                  className="p-2 rounded-lg hover:bg-blue-50 text-blue-500"
                >
                  <Pencil size={18} />
                </Link>

                <button
                  onClick={() => handleDelete(category._id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            </div>

            {/* FOODS */}
            {openCategory === category._id && (
              <div className="p-5 border-t bg-orange-50/40">

                {loadingFoods[category._id] ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="animate-spin" />
                    Loading foods...
                  </div>
                ) : foods[category._id]?.length === 0 ? (
                  <p className="text-gray-500">
                    No foods in this category
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    {foods[category._id]?.map((food) => (
                      <div
                        key={food._id}
                        className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                      >

                        <img
                          src={
                            food.images?.[0] ||
                            food.image ||
                            "https://via.placeholder.com/150"
                          }
                          className="w-full h-28 object-cover"
                        />

                        <div className="p-3">

                          <h3 className="text-sm font-semibold text-gray-800 truncate">
                            {food.title}
                          </h3>

                          <p className="text-orange-500 font-bold text-sm">
                            ₹{food.price}
                          </p>

                        </div>

                      </div>
                    ))}

                  </div>
                )}

              </div>
            )}

          </div>
        ))}

      </div>
    </div>
  );
}