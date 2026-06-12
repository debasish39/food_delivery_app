import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUtensils, FaImage, FaPlus } from "react-icons/fa";

import { createFood } from "../../services/foodService";
import { getCategories } from "../../services/categoryService";

export default function CreateFood() {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("category", formData.category);

      images.forEach((img) => {
        data.append("images", img);
      });

      await createFood(data);

      toast.success("Food created successfully 🎉");

      setFormData({
        title: "",
        description: "",
        price: "",
        stock: "",
        category: "",
      });

      setImages([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create food");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <FaUtensils className="text-green-600" />
            Create Food
          </h1>
          <p className="text-gray-500 mt-1">
            Add a new item to your menu
          </p>
        </div>

        {/* CARD */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6"
        >

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-5">

            <input
              type="text"
              value={formData.title}
              placeholder="Food title"
              className="border rounded-xl p-3 w-full focus:ring-2 focus:ring-green-500 outline-none"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <input
              type="number"
              value={formData.price}
              placeholder="Price"
              className="border rounded-xl p-3 w-full focus:ring-2 focus:ring-green-500 outline-none"
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />

            <input
              type="number"
              value={formData.stock}
              placeholder="Stock"
              className="border rounded-xl p-3 w-full focus:ring-2 focus:ring-green-500 outline-none"
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
            />

            <select
              value={formData.category}
              className="border rounded-xl p-3 w-full focus:ring-2 focus:ring-green-500 outline-none"
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* DESCRIPTION */}
          <textarea
            value={formData.description}
            placeholder="Food description..."
            className="border rounded-xl p-3 w-full h-28 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          {/* IMAGE UPLOAD */}
          <div>
            <label className="flex items-center gap-2 font-medium mb-2">
              <FaImage className="text-green-600" />
              Upload Images
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full border p-3 rounded-xl bg-gray-50"
              onChange={(e) => setImages(Array.from(e.target.files))}
            />
          </div>

          {/* IMAGE PREVIEW GRID */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl overflow-hidden border"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="w-full h-24 object-cover group-hover:scale-105 transition"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition disabled:opacity-50"
          >
            <FaPlus />
            {loading ? "Creating..." : "Create Food"}
          </button>
        </form>
      </div>
    </div>
  );
}