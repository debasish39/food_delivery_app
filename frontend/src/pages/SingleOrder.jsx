import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createReview } from "../services/reviewService";
import { cancelOrder } from "../services/orderService";
import API from "../api/axios";

/* ---------------- STATUS FLOW ---------------- */
const STATUS_STEPS = [
  { key: "Pending", label: "Order Placed", icon: "🧾" },
  { key: "Preparing", label: "Preparing", icon: "👨‍🍳" },
  { key: "Out For Delivery", label: "Out for Delivery", icon: "🛵" },
  { key: "Delivered", label: "Delivered", icon: "🎉" },
];

const getStepIndex = (status) =>
  Math.max(0, STATUS_STEPS.findIndex((s) => s.key === status));

const STATUS_META = {
  Pending: { color: "#f59e0b", bg: "rgba(245,158,11,.1)", border: "rgba(245,158,11,.25)" },
  Preparing: { color: "#f97316", bg: "rgba(249,115,22,.1)", border: "rgba(249,115,22,.25)" },
  "Out For Delivery": { color: "#3b82f6", bg: "rgba(59,130,246,.1)", border: "rgba(59,130,246,.25)" },
  Delivered: { color: "#22c55e", bg: "rgba(34,197,94,.1)", border: "rgba(34,197,94,.25)" },
  Cancelled: { color: "#ef4444", bg: "rgba(239,68,68,.1)", border: "rgba(239,68,68,.25)" },
};

const PAYMENT_META = {
  Paid: { color: "#22c55e", bg: "rgba(34,197,94,.1)", border: "rgba(34,197,94,.25)" },
  Pending: { color: "#f59e0b", bg: "rgba(245,158,11,.1)", border: "rgba(245,158,11,.25)" },
  Failed: { color: "#ef4444", bg: "rgba(239,68,68,.1)", border: "rgba(239,68,68,.25)" },
};

export default function SingleOrder() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  const [reviews, setReviews] = useState({});
  const [ratings, setRatings] = useState({});
  const [reviewImages, setReviewImages] = useState({});
  const [submittingReview, setSubmittingReview] = useState({});

  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await API.get(`/orders/${id}`);
      setOrder(data.order);
    };
    fetchOrder();
  }, [id]);

  /* ---------------- CANCEL ORDER ---------------- */
  const handleCancelOrder = async () => {
    try {
      setCancelling(true);

      await cancelOrder(order._id, {
        reason: cancelReason,
      });

      toast.success("Order cancelled");

      const { data } = await API.get(`/orders/${id}`);
      setOrder(data.order);

      setShowCancelModal(false);
      setCancelReason("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Cannot cancel order");
    } finally {
      setCancelling(false);
    }
  };

  /* ---------------- REVIEW ---------------- */
  const handleReviewSubmit = async (foodId) => {
    try {
      setSubmittingReview((p) => ({ ...p, [foodId]: true }));

      const formData = new FormData();
      formData.append("foodId", foodId);
      formData.append("rating", ratings[foodId] || "");
      formData.append("comment", reviews[foodId] || "");

      if (reviewImages[foodId]) {
        formData.append("images", reviewImages[foodId]);
      }

      await createReview(formData);

      toast.success("Review Added 🎉");

      setReviews((p) => ({ ...p, [foodId]: "" }));
      setRatings((p) => ({ ...p, [foodId]: "" }));
      setReviewImages((p) => ({ ...p, [foodId]: null }));
    }catch (err) {
  console.log(err.response?.data);

  toast.error(
    err.response?.data?.message ||
    "Failed to add review"
  );
}finally {
      setSubmittingReview((p) => ({ ...p, [foodId]: false }));
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0a0b0e] flex items-center justify-center">
        <style>{spinKeyframes}</style>
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-white/5" />
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500"
              style={{ animation: "spin 0.8s linear infinite" }}
            />
          </div>
          <p className="text-sm text-gray-500 font-medium tracking-wide">Loading order…</p>
        </div>
      </div>
    );
  }

  const isCancelled = order.orderStatus === "Cancelled";
  const currentIndex = getStepIndex(order.orderStatus);
  const progress = isCancelled ? 0 : ((currentIndex) / (STATUS_STEPS.length - 1)) * 100;
  const canCancel = ["Pending", "Preparing"].includes(order.orderStatus);
  const statusMeta = STATUS_META[order.orderStatus] || STATUS_META.Pending;
  const paymentMeta = PAYMENT_META[order.paymentStatus] || PAYMENT_META.Pending;

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-white  mt-15">
      <style>{spinKeyframes}</style>

      {/* Header bar */}
      <div className="border-b border-white/5 bg-[#0d0e12]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs text-gray-500 font-medium tracking-wide uppercase mb-1">Order Details</p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Order <span className="text-orange-400">#{order._id.slice(-6).toUpperCase()}</span>
              </h1>
              {order.createdAt && (
                <p className="text-sm text-gray-500 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              )}
            </div>

            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-colors"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ---------------- STATUS / TRACKING CARD ---------------- */}
      <div className="bg-[#12141a] border border-white/[0.06] rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/20">

  {/* HEADER */}
  <div className="flex items-start justify-between flex-wrap gap-4 mb-8">

    {/* LEFT: STATUS */}
    <div className="flex items-center gap-4">

      {/* ICON */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
        style={{
          background: statusMeta.bg,
          border: `1px solid ${statusMeta.border}`,
        }}
      >
        {isCancelled ? "✕" : STATUS_STEPS[currentIndex]?.icon}
      </div>

      {/* TEXT */}
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500">
          Current Status
        </p>

        <h2
          className="text-xl font-bold mt-1"
          style={{ color: statusMeta.color }}
        >
          {isCancelled
            ? "Order Cancelled"
            : STATUS_STEPS[currentIndex]?.label}
        </h2>

        <p className="text-xs text-gray-500 mt-1">
          Track your food in real-time
        </p>
      </div>
    </div>

    {/* LIVE BADGE */}
    {!isCancelled && order.orderStatus !== "Delivered" && (
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md"
        style={{
          background: statusMeta.bg,
          border: `1px solid ${statusMeta.border}`,
          color: statusMeta.color,
        }}
      >
        <span className="relative flex h-2 w-2">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
            style={{ background: statusMeta.color }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ background: statusMeta.color }}
          />
        </span>
        Live tracking
      </div>
    )}
  </div>

  {/* CANCEL STATE */}
  {isCancelled ? (
    <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/10 via-transparent to-transparent p-5">

  {/* glow effect */}
  <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/20 blur-3xl rounded-full" />

  <div className="relative flex items-start gap-4">

    {/* icon bubble */}
    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-500/15 border border-red-500/30 text-2xl shadow-lg">
      ❌
    </div>

    {/* text */}
    <div className="flex-1">
      <p className="text-sm font-semibold text-red-400 flex items-center gap-2">
        Order Cancelled
        <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
      </p>

      {order.cancelReason && (
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
          <span className="text-gray-500">Reason:</span> {order.cancelReason}
        </p>
      )}
    </div>

    {/* status tag */}
    <div className="text-[10px] px-2 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
      CLOSED
    </div>
  </div>
</div>
  ) : (
    <>
    {/* PROGRESS BAR */}
<div className="relative mb-12">

  {/* BACK TRACK */}
  <div className="absolute top-5 left-0 right-0 h-[3px] bg-white/5 rounded-full" />

  {/* FRONT PROGRESS */}
  <div
    className="absolute top-5 left-0 h-[3px] rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-700 ease-out"
    style={{ width: `${progress}%` }}
  />

  {/* STEPS */}
  <div className="relative flex justify-between">

    {STATUS_STEPS.map((step, i) => {
      const active = i <= currentIndex;
      const isCurrent = i === currentIndex;

      return (
        <div key={step.key} className="flex flex-col items-center flex-1">

          {/* DOT */}
          <div className="relative flex items-center justify-center">

            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center text-lg z-10 transition-all duration-300
                ${
                  active
                    ? "text-white shadow-lg shadow-orange-500/30"
                    : "bg-[#0a0b0e] border border-white/30 text-gray-600"
                }`}
            >
              {step.icon}
            </div>

            {/* glow ring for current */}
            {isCurrent && (
              <span className="absolute w-14 h-14 rounded-full border-3 border-orange-400/40 animate-ping" />
            )}
          </div>

          {/* LABEL */}
          <p
            className={`text-[11px] mt-3 text-center font-medium leading-tight ${
              active ? "text-white" : "text-gray-600"
            }`}
          >
            {step.label}
          </p>

          {/* STATUS TEXT */}
          <div className="mt-1 h-4">
            {isCurrent && (
              <span className="text-[10px] text-orange-400 font-medium">
                In Progress
              </span>
            )}

            {active && !isCurrent && (
              <span className="text-[10px] text-emerald-400 font-medium">
                Completed
              </span>
            )}
          </div>

        </div>
      );
    })}
  </div>
</div>
    </>
  )}

  {/* INFO GRID */}
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/[0.06]">

    <div className="bg-white/5 rounded-2xl p-4">
      <p className="text-[11px] text-gray-500 uppercase">Order Status</p>
      <p className="text-sm font-semibold mt-1" style={{ color: statusMeta.color }}>
        {order.orderStatus}
      </p>
    </div>

    <div className="bg-white/5 rounded-2xl p-4">
      <p className="text-[11px] text-gray-500 uppercase">Payment</p>
      <p className="text-sm font-semibold mt-1" style={{ color: paymentMeta.color }}>
        {order.paymentStatus}
      </p>
    </div>

    <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-4 border border-orange-500/10">
      <p className="text-[11px] text-gray-400 uppercase">Total</p>
      <p className="text-lg font-bold text-orange-400 mt-1">
        ₹{order.finalPrice}
      </p>
    </div>

  </div>
</div>

        {/* ---------------- ITEMS ---------------- */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3 px-1">
            Items ({order.items.length})
          </h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="bg-[#13151b] border border-white/[0.06] rounded-2xl overflow-hidden"
              >
                <div className="flex gap-4 p-4 sm:p-5">
                  
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold truncate">
                      {item.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-400">
                      <span>Qty <span className="text-gray-200 font-medium">{item.quantity}</span></span>
                      <span>₹{item.price} <span className="text-gray-600">/ item</span></span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <p className="text-orange-400 font-bold text-lg tabular-nums">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* REVIEW */}
               {order.orderStatus === "Delivered" && (
  <div className="border-t border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 rounded-b-2xl">

    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold text-orange-400 flex items-center gap-2">
        <span className="text-lg">⭐</span>
        Rate & Review
      </h3>

      {ratings[item.food] && (
        <span className="text-xs px-2 py-1 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/20">
          {ratings[item.food]} / 5
        </span>
      )}
    </div>

    {/* Stars */}
    <div className="flex items-center gap-1 mb-4">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = (ratings[item.food] || 0) >= star;

        return (
          <button
            key={star}
            type="button"
            onClick={() =>
              setRatings((p) => ({ ...p, [item.food]: star }))
            }
            className="text-2xl transition-transform hover:scale-110 active:scale-95"
          >
            <span className={active ? "text-amber-400 drop-shadow" : "text-gray-700"}>
              ★
            </span>
          </button>
        );
      })}
    </div>

    {/* Input box */}
    <textarea
      rows="3"
      placeholder="Tell us how the food was… spicy, tasty, delivery, everything!"
      className="w-full bg-black/30 border border-white/[0.06] p-4 rounded-xl text-sm placeholder:text-gray-500 outline-none focus:border-orange-500/40 transition resize-none leading-relaxed"
      value={reviews[item.food] || ""}
      onChange={(e) =>
        setReviews({
          ...reviews,
          [item.food]: e.target.value,
        })
      }
    />

    {/* Bottom row */}
    <div className="flex items-center justify-between mt-4 gap-3 flex-wrap">

      {/* Upload */}
      <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer hover:text-orange-400 transition">
        <span className="text-lg">📷</span>
        {reviewImages[item.food] ? "Image added" : "Add food photo"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];

            setReviewImages((p) => ({ ...p, [item.food]: file || null }));

            if (file) {
              const previewUrl = URL.createObjectURL(file);

              setReviewImages((p) => ({
                ...p,
                [`${item.food}_preview`]: previewUrl,
              }));
            }
          }}
        />
      </label>

      {/* Submit */}
      <button
        onClick={() => handleReviewSubmit(item.food)}
        disabled={submittingReview[item.food]}
        className="px-6 py-2.5 rounded-xl text-sm font-semibold 
                   bg-gradient-to-r from-orange-500 to-red-500
                   shadow-lg shadow-orange-500/20
                   hover:shadow-orange-500/40 hover:scale-[1.02]
                   active:scale-[0.98] transition-all
                   disabled:opacity-50"
      >
        {submittingReview[item.food] ? "Submitting..." : "Submit Review"}
      </button>
    </div>

    {/* IMAGE PREVIEW CARD */}
    {reviewImages[`${item.food}_preview`] && (
      <div className="mt-4">
        <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-white/10 shadow-lg group">
          <img
            src={reviewImages[`${item.food}_preview`]}
            alt="preview"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />

          {/* remove button */}
          <button
            onClick={() =>
              setReviewImages((p) => ({
                ...p,
                [item.food]: null,
                [`${item.food}_preview`]: null,
              }))
            }
            className="absolute top-1 right-1 bg-black/60 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center hover:bg-red-500 transition"
          >
            ✕
          </button>
        </div>
      </div>
    )}

  </div>
)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- CANCEL MODAL ---------------- */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#13151b] p-6 rounded-2xl w-full max-w-md border border-white/[0.08] shadow-2xl">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-lg flex-shrink-0">
                ⚠️
              </div>
              <h2 className="text-lg font-semibold">Cancel this order?</h2>
            </div>
            <p className="text-sm text-gray-500 mt-2 mb-4">
              This action can't be undone. Let us know why you're cancelling.
            </p>

            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter reason (optional)…"
              rows="3"
              className="w-full p-3 rounded-xl bg-black/30 border border-white/[0.08] text-sm placeholder:text-gray-600 outline-none focus:border-red-500/40 transition-colors resize-none"
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 transition-colors"
              >
                Keep Order
              </button>

              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {cancelling && (
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white inline-block" style={{ animation: "spin 0.6s linear infinite" }} />
                )}
                {cancelling ? "Cancelling…" : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function InfoCard({ label, value, meta, highlight }) {
  return (
    <div className="bg-black/20 p-3.5 rounded-xl border border-white/[0.06]">
      <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide mb-1">{label}</p>
      <p
        className={`font-bold text-sm sm:text-base truncate ${highlight ? "text-orange-400" : ""}`}
        style={meta ? { color: meta.color } : undefined}
      >
        {value}
      </p>
    </div>
  );
}

const spinKeyframes = `
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;