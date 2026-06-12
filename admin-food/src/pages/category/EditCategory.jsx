import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaUpload, FaSave, FaTimes, FaImage } from "react-icons/fa";

import {
  getCategory,
  updateCategory,
} from "../../services/categoryService";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // ---------------- FETCH CATEGORY ----------------
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await getCategory(id);
        const category = data.category;

        setName(category.name || "");
        setDescription(category.description || "");
        setPreview(category.image?.url || category.image || "");
      } catch (error) {
        toast.error("Failed to load category");
      } finally {
        setFetching(false);
      }
    };

    fetchCategory();
  }, [id]);

  // ---------------- IMAGE CHANGE ----------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error("Category name is required");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);

      if (image) {
        formData.append("image", image);
      }

      await updateCategory(id, formData);

      toast.success("Category updated successfully");
      navigate("/admin/categories");

    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update category"
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOADING ----------------
  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading category...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">

      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-orange-500 text-white p-6 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FaSave /> Edit Category
            </h1>
            <p className="text-sm text-orange-100">
              Update category details
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/categories")}
            className="bg-white text-orange-500 px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-100 transition"
          >
            <FaTimes /> Back
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* IMAGE */}
          <div className="flex flex-col items-center">

            <div className="relative w-44 h-44 rounded-2xl overflow-hidden border shadow bg-gray-50">

              {preview ? (
                <img
                  src={image ? URL.createObjectURL(image) : preview}
                  alt="Category"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <FaImage className="text-3xl mb-2" />
                  No Image
                </div>
              )}

              {/* overlay */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/40 flex items-center justify-center transition">
                <label className="opacity-0 hover:opacity-100 text-white cursor-pointer flex items-center gap-2">
                  <FaUpload />
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

            </div>

            <p className="text-xs text-gray-400 mt-2">
              Click image to change
            </p>
          </div>

          {/* NAME */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Category Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-xl p-3 mt-1 focus:ring-2 focus:ring-orange-400 outline-none"
              placeholder="Enter category name"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Description
            </label>

            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-xl p-3 mt-1 focus:ring-2 focus:ring-orange-400 outline-none"
              placeholder="Enter category description..."
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-2">

            <button
              type="button"
              onClick={() => navigate("/admin/categories")}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Category"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}