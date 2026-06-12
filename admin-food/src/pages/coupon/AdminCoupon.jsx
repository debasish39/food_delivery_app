import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaTicketAlt,
  FaTrash,
  FaPercent,
  FaMoneyBill,
} from "react-icons/fa";

import {
  getCoupons,
  createCoupon,
  deleteCoupon,
} from "../../services/couponService";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    expiryDate: "",
    isFirstOrderOnly: false,
    isActive: true,
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data } = await getCoupons();
      setCoupons(data.coupons);
    } catch (error) {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createCoupon(formData);

      toast.success("Coupon Created 🎉");

      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: "",
        maxDiscount: "",
        expiryDate: "",
        isFirstOrderOnly: false,
        isActive: true,
      });

      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;

    try {
      await deleteCoupon(id);
      toast.success("Coupon Deleted");
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <FaTicketAlt className="text-green-600" />
            Coupon Management
          </h1>
          <p className="text-gray-500">
            Create and manage discount coupons
          </p>
        </div>

        {/* FORM CARD */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 mb-10 space-y-5"
        >

          {/* GRID INPUTS */}
          <div className="grid md:grid-cols-3 gap-4">

            <input
              placeholder="Coupon Code"
              value={formData.code}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  code: e.target.value.toUpperCase(),
                })
              }
              className="border p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />

            <select
              value={formData.discountType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discountType: e.target.value,
                })
              }
              className="border p-3 rounded-xl"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>

            <input
              type="number"
              placeholder="Discount Value"
              value={formData.discountValue}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discountValue: e.target.value,
                })
              }
              className="border p-3 rounded-xl"
            />

            <input
              type="number"
              placeholder="Min Order"
              value={formData.minOrderAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minOrderAmount: e.target.value,
                })
              }
              className="border p-3 rounded-xl"
            />

            <input
              type="number"
              placeholder="Max Discount"
              value={formData.maxDiscount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxDiscount: e.target.value,
                })
              }
              className="border p-3 rounded-xl"
            />

            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  expiryDate: e.target.value,
                })
              }
              className="border p-3 rounded-xl"
            />
          </div>

          {/* CHECKBOXES */}
          <div className="flex flex-wrap gap-6 text-sm">

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isActive: e.target.checked,
                  })
                }
              />
              Active
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isFirstOrderOnly}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isFirstOrderOnly: e.target.checked,
                  })
                }
              />
              First Order Only
            </label>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition"
          >
            Create Coupon
          </button>
        </form>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow overflow-x-auto">

          <table className="w-full text-sm md:text-base">

            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-4">Code</th>
                <th className="p-4">Type</th>
                <th className="p-4">Value</th>
                <th className="p-4">Min Order</th>
                <th className="p-4">Used</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {coupons.map((coupon) => (
                <tr
                  key={coupon._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-semibold">
                    {coupon.code}
                  </td>

                  <td className="p-4 capitalize">
                    {coupon.discountType === "percentage" ? (
                      <span className="flex items-center gap-1">
                        <FaPercent /> Percentage
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <FaMoneyBill /> Fixed
                      </span>
                    )}
                  </td>

                  <td className="p-4 font-bold text-green-600">
                    {coupon.discountValue}
                  </td>

                  <td className="p-4">
                    ₹{coupon.minOrderAmount}
                  </td>

                  <td className="p-4">
                    {coupon.usedCount}
                  </td>

                  <td className="p-4">
                    {coupon.isActive ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}