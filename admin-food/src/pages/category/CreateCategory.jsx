import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createCategory } from "../../services/categoryService";
import { FaUpload, FaPlus, FaArrowLeft } from "react-icons/fa";

export default function CreateCategory() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) return toast.error("Category name is required");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);

      if (image) formData.append("image", image);

      await createCategory(formData);

      toast.success("Category created successfully");
      navigate("/admin/categories");

    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create category"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">

      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-orange-500 text-white p-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FaPlus /> Create Category
            </h1>
            <p className="text-sm text-orange-100">
              Add a new food category
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/categories")}
            className="bg-white text-orange-500 px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-100 transition"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* NAME */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Category Name
            </label>
            <input
              type="text"
              placeholder="e.g. Pizza, Burgers"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-xl p-3 mt-1 focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              placeholder="Short description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-xl p-3 mt-1 focus:ring-2 focus:ring-orange-400 outline-none"
              rows="4"
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Category Image
            </label>

            <label className="w-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:bg-orange-50 transition mt-2">
              <FaUpload className="text-orange-500 text-2xl mb-2" />
              <p className="text-sm text-gray-500">
                Click to upload image
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* PREVIEW */}
            {preview && (
              <div className="mt-3">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-xl border"
                />
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60"
          >
            {loading ? "Creating..." : (
              <>
                <FaPlus /> Create Category
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}