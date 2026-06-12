import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEdit, FaImage } from "react-icons/fa";

import {
  getSingleFood,
  updateFood,
} from "../../services/foodService";

export default function UpdateFood() {
  const { id } = useParams();

  const [food, setFood] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchFood();
  }, [id]);

  const fetchFood = async () => {
    try {
      setLoading(true);
      const { data } = await getSingleFood(id);
      setFood(data.food);
    } catch (error) {
      toast.error("Failed to load food");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);

      const formData = new FormData();

      formData.append("title", food.title);
      formData.append("description", food.description);
      formData.append("price", food.price);
      formData.append("stock", food.stock);
      formData.append(
        "category",
        food.category?._id || food.category
      );

      images.forEach((img) => {
        formData.append("images", img);
      });

      await updateFood(id, formData);

      toast.success("Food updated successfully 🎉");

      setImages([]);
      fetchFood();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update failed"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !food) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading food details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <FaEdit className="text-blue-600" />
            Update Food
          </h1>
          <p className="text-gray-500">
            Edit food details and update images
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 space-y-6">

          {/* FORM GRID */}
          <div className="grid md:grid-cols-2 gap-5">

            <input
              value={food.title || ""}
              onChange={(e) =>
                setFood({ ...food, title: e.target.value })
              }
              className="border rounded-xl p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Food title"
            />

            <input
              type="number"
              value={food.price || ""}
              onChange={(e) =>
                setFood({ ...food, price: e.target.value })
              }
              className="border rounded-xl p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Price"
            />

            <input
              type="number"
              value={food.stock || ""}
              onChange={(e) =>
                setFood({ ...food, stock: e.target.value })
              }
              className="border rounded-xl p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Stock"
            />

            <input
              value={food.category?.name || ""}
              disabled
              className="border rounded-xl p-3 w-full bg-gray-100 text-gray-500"
            />
          </div>

          {/* DESCRIPTION */}
          <textarea
            value={food.description || ""}
            onChange={(e) =>
              setFood({
                ...food,
                description: e.target.value,
              })
            }
            className="border rounded-xl p-3 w-full h-28 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Description"
          />

          {/* EXISTING IMAGES */}
          <div>
            <h2 className="font-medium mb-2 flex items-center gap-2">
              <FaImage className="text-blue-600" />
              Existing Images
            </h2>

            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {food.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="food"
                  className="w-full h-24 object-cover rounded-xl border hover:scale-105 transition"
                />
              ))}
            </div>
          </div>

          {/* NEW IMAGES */}
          <div>
            <label className="block font-medium mb-2">
              Upload New Images
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full border p-3 rounded-xl bg-gray-50"
              onChange={(e) =>
                setImages(Array.from(e.target.files))
              }
            />
          </div>

          {/* PREVIEW NEW IMAGES */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(img)}
                  className="w-full h-20 object-cover rounded-xl border"
                />
              ))}
            </div>
          )}

          {/* ACTION BUTTON */}
          <button
            onClick={handleUpdate}
            disabled={updating}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Food"}
          </button>

        </div>
      </div>
    </div>
  );
}