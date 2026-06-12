import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

import {
  FiMapPin,
  FiCreditCard,
  FiTag,
  FiShoppingBag,
  FiCheck,
  FiLoader,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import { getCart } from "../services/cartService";
import { applyCoupon } from "../services/couponService";
import { createOrder } from "../services/orderService";
import {
  createRazorpayOrder,
  verifyPayment,
} from "../services/paymentService";

/* ---------------- STEP CONFIG ---------------- */
const STEPS = [
  { key: "address", label: "Delivery Address", icon: FiMapPin },
  { key: "payment", label: "Payment", icon: FiCreditCard },
  { key: "review", label: "Review & Place Order", icon: FiCheck },
];

/* ---------------- FIELD CONFIG ---------------- */
const ADDRESS_FIELDS = [
  { key: "fullName", label: "Full Name", placeholder: "John Doe", span: 2 },
  { key: "phone", label: "Phone Number", placeholder: "9876543210", span: 1 },
  { key: "email", label: "Email", placeholder: "you@example.com", span: 1 },
  { key: "postalCode", label: "Pincode", placeholder: "751001", span: 1, isPincode: true },
  { key: "city", label: "City", placeholder: "Auto-filled from pincode", span: 1 },
  { key: "state", label: "State", placeholder: "Auto-filled from pincode", span: 1 },
  { key: "area", label: "Area / Locality", placeholder: "Auto-filled from pincode", span: 1 },
  { key: "addressLine1", label: "House No., Building, Street", placeholder: "e.g. 2nd Floor, ABC Apartments, Main Road", span: 2 },
];

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [errors, setErrors] = useState({});

  const [step, setStep] = useState(0); // 0 = address, 1 = payment, 2 = review
  const [pincodeStatus, setPincodeStatus] = useState("idle"); // idle | loading | success | error

  const navigate = useNavigate();
  const location = useLocation();
  const directBuy = location.state?.directBuy;

  const [address, setAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    area: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const fetchCart = async () => {
    try {
      const { data } = await getCart();
      setCart(data.cart);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const items = directBuy
    ? [{ food: directBuy.food, quantity: directBuy.quantity }]
    : cart?.items?.filter((i) => i.food) || [];

  const subtotal = items.reduce(
    (acc, item) => acc + item.food.price * item.quantity,
    0
  );

  const finalPrice = Math.max(subtotal - discount, 0);

  /* ---------------- PINCODE AUTO-FILL ---------------- */
  const handlePincodeChange = async (value) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
    setAddress((prev) => ({ ...prev, postalCode: digitsOnly }));
    setErrors((prev) => ({ ...prev, postalCode: undefined }));

    if (digitsOnly.length !== 6) {
      setPincodeStatus("idle");
      return;
    }

    setPincodeStatus("loading");

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${digitsOnly}`);
      const data = await res.json();
      const result = data?.[0];

      if (result?.Status === "Success" && result.PostOffice?.length) {
        const po = result.PostOffice[0];

        setAddress((prev) => ({
          ...prev,
          city: po.District || prev.city,
          state: po.State || prev.state,
          area: po.Name || prev.area,
        }));

        setPincodeStatus("success");
      } else {
        setPincodeStatus("error");
      }
    } catch (err) {
      console.log(err);
      setPincodeStatus("error");
    }
  };

  /* ---------------- VALIDATION ---------------- */
  const validateAddressStep = () => {
    const err = {};

    if (!address.fullName) err.fullName = "Required";
    if (!/^[6-9]\d{9}$/.test(address.phone)) err.phone = "Enter a valid 10-digit phone number";
    if (!address.email.includes("@")) err.email = "Enter a valid email";
    if (!/^\d{6}$/.test(address.postalCode)) err.postalCode = "Enter a valid 6-digit pincode";
    if (!address.city) err.city = "Required";
    if (!address.state) err.state = "Required";
    if (!address.area) err.area = "Required";
    if (!address.addressLine1) err.addressLine1 = "Required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ---------------- COUPON ---------------- */
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      setApplyingCoupon(true);
      const { data } = await applyCoupon({
        code: couponCode,
        cartTotal: subtotal,
      });

      setDiscount(data.discount);
      setAppliedCoupon(data.coupon);
      toast.success("Coupon applied 🎉");
    } catch {
      setDiscount(0);
      setAppliedCoupon(null);
      toast.error("Invalid coupon");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode("");
  };

  /* ---------------- STEP NAVIGATION ---------------- */
  const goNext = () => {
    if (step === 0) {
      if (!validateAddressStep()) {
        toast.error("Please fix the highlighted fields");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  /* ---------------- PLACE ORDER ---------------- */
  const handleOrder = async () => {
    if (!validateAddressStep()) {
      setStep(0);
      return toast.error("Fix form errors");
    }

    try {
      setLoading(true);

      if (paymentMethod === "ONLINE") {
        const orderResponse = await createOrder({
          items,
          shippingAddress: address,
          paymentMethod: "ONLINE",
          directBuy: directBuy || null,
          coupon: appliedCoupon ? { code: appliedCoupon } : null,
          totalPrice: subtotal,
          finalPrice,
        });

        const mongoOrderId = orderResponse.data.order._id;

        const { data: razor } = await createRazorpayOrder(
          finalPrice,
          mongoOrderId
        );

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: razor.order.amount,
          currency: razor.order.currency,
          name: "FoodHub",
          order_id: razor.order.id,

          handler: async (res) => {
            await verifyPayment({
              razorpay_order_id: res.razorpay_order_id,
              razorpay_payment_id: res.razorpay_payment_id,
              razorpay_signature: res.razorpay_signature,
              orderId: mongoOrderId,
            });

            toast.success("Order placed successfully");
            navigate("/orders");
          },

          theme: { color: "#f97316" },
        };

        new window.Razorpay(options).open();
        return;
      }

      await createOrder({
        items,
        shippingAddress: address,
        paymentMethod: "COD",
        directBuy: directBuy || null,
        coupon: appliedCoupon ? { code: appliedCoupon } : null,
        totalPrice: subtotal,
        finalPrice,
      });

      toast.success("Order placed");
      navigate("/orders");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-white px-4 py-8 sm:py-10">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <FiShoppingBag className="text-orange-400 text-2xl" />
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            Checkout
          </h1>
        </div>

        {/* STEPPER */}
        <div className="bg-[#13151b] border border-white/[0.06] rounded-2xl p-4 sm:p-5 mb-6">
          <div className="flex items-center">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isDone = i < step;
              const isLast = i === STEPS.length - 1;

              return (
                <div key={s.key} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                        isDone
                          ? "bg-emerald-500 border-emerald-400 text-white"
                          : isActive
                          ? "bg-gradient-to-br from-orange-500 to-red-500 border-orange-400 text-white shadow-lg shadow-orange-500/30"
                          : "bg-[#0a0b0e] border-white/10 text-gray-600"
                      }`}
                    >
                      {isDone ? <FiCheck size={16} /> : <Icon size={16} />}
                    </div>
                    <span
                      className={`text-[11px] sm:text-xs mt-2 font-medium text-center leading-tight max-w-[80px] sm:max-w-none ${
                        isActive ? "text-white" : isDone ? "text-emerald-400" : "text-gray-600"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>

                  {!isLast && (
                    <div className="flex-1 h-0.5 mx-2 sm:mx-3 -mt-5 rounded-full overflow-hidden bg-white/[0.06]">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-emerald-500 transition-all duration-500"
                        style={{ width: isDone ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">

          {/* ---------------- MAIN STEP CONTENT ---------------- */}
          <div className="space-y-6">

            {/* STEP 1: ADDRESS */}
            {step === 0 && (
              <div className="bg-[#13151b] border border-white/[0.06] rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-1">
                  <FiMapPin className="text-orange-400" />
                  <h2 className="text-lg sm:text-xl font-semibold">Delivery Address</h2>
                </div>
                <p className="text-sm text-gray-500 mb-5">
                  Enter your pincode first — city, state &amp; area will fill in automatically.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ADDRESS_FIELDS.map((field) => (
                    <div key={field.key} className={field.span === 2 ? "sm:col-span-2" : ""}>
                      <label className="text-xs font-medium text-gray-400 mb-1.5 block">
                        {field.label}
                      </label>

                      <div className="relative">
                        <input
                          className={`w-full bg-[#0a0b0e] border p-3 rounded-xl outline-none transition-colors text-sm placeholder:text-gray-600 ${
                            errors[field.key]
                              ? "border-red-500/50 focus:border-red-500"
                              : "border-white/10 focus:border-orange-500/50"
                          } ${field.isPincode ? "pr-10" : ""}`}
                          placeholder={field.placeholder}
                          value={address[field.key]}
                          inputMode={field.isPincode ? "numeric" : undefined}
                          maxLength={field.isPincode ? 6 : undefined}
                          onChange={(e) => {
                            if (field.isPincode) {
                              handlePincodeChange(e.target.value);
                            } else {
                              setAddress({ ...address, [field.key]: e.target.value });
                              setErrors((prev) => ({ ...prev, [field.key]: undefined }));
                            }
                          }}
                        />

                        {field.isPincode && pincodeStatus === "loading" && (
                          <FiLoader className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 animate-spin" size={16} />
                        )}
                        {field.isPincode && pincodeStatus === "success" && (
                          <FiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400" size={16} />
                        )}
                      </div>

                      {errors[field.key] && (
                        <p className="text-red-400 text-xs mt-1">{errors[field.key]}</p>
                      )}
                      {field.isPincode && pincodeStatus === "error" && !errors.postalCode && (
                        <p className="text-amber-400 text-xs mt-1">
                          Couldn't auto-detect this pincode — please fill city/state/area manually
                        </p>
                      )}
                      {field.isPincode && pincodeStatus === "success" && (
                        <p className="text-emerald-400 text-xs mt-1">Location details auto-filled ✓</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: PAYMENT */}
            {step === 1 && (
              <div className="bg-[#13151b] border border-white/[0.06] rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-1">
                  <FiCreditCard className="text-orange-400" />
                  <h2 className="text-lg sm:text-xl font-semibold">Payment Method</h2>
                </div>
                <p className="text-sm text-gray-500 mb-5">Choose how you'd like to pay for this order.</p>

                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === "COD"
                        ? "border-orange-500/50 bg-orange-500/[0.06]"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Cash on Delivery</p>
                      <p className="text-xs text-gray-500 mt-0.5">Pay with cash when your order arrives</p>
                    </div>
                    <span className="text-2xl">💵</span>
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === "ONLINE"
                        ? "border-orange-500/50 bg-orange-500/[0.06]"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      value="ONLINE"
                      checked={paymentMethod === "ONLINE"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Pay Online</p>
                      <p className="text-xs text-gray-500 mt-0.5">UPI, Cards &amp; Netbanking via Razorpay</p>
                    </div>
                    <span className="text-2xl">💳</span>
                  </label>
                </div>

                {/* Coupon */}
                <div className="mt-6 pt-6 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-2">
                    <FiTag className="text-orange-400" />
                    <span className="text-sm font-semibold">Apply Coupon</span>
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-500/[0.08] border border-emerald-500/20 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <FiCheck className="text-emerald-400" />
                        <span className="text-sm font-semibold text-emerald-400">
                          {appliedCoupon} applied — saved ₹{discount}
                        </span>
                      </div>
                      <button onClick={removeCoupon} className="text-xs text-gray-400 hover:text-red-400 transition-colors">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        className="flex-1 bg-[#0a0b0e] border border-white/10 p-3 rounded-xl text-sm outline-none focus:border-orange-500/50 placeholder:text-gray-600"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={applyingCoupon}
                        className="bg-orange-500 hover:bg-orange-600 px-5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                      >
                        {applyingCoupon ? "..." : "Apply"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW */}
            {step === 2 && (
              <div className="space-y-4">
                {/* Address review */}
                <div className="bg-[#13151b] border border-white/[0.06] rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-orange-400" />
                      <h2 className="text-lg font-semibold">Delivery Address</h2>
                    </div>
                    <button onClick={() => setStep(0)} className="text-xs text-orange-400 hover:underline font-medium">
                      Edit
                    </button>
                  </div>
                  <div className="text-sm text-gray-300 leading-relaxed">
                    <p className="font-semibold text-white">{address.fullName}</p>
                    <p className="text-gray-400 mt-1">
                      {address.addressLine1}, {address.area}, {address.city}, {address.state} — {address.postalCode}
                    </p>
                    <p className="text-gray-500 mt-1">📞 {address.phone} · {address.email}</p>
                  </div>
                </div>

                {/* Payment review */}
                <div className="bg-[#13151b] border border-white/[0.06] rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FiCreditCard className="text-orange-400" />
                      <h2 className="text-lg font-semibold">Payment</h2>
                    </div>
                    <button onClick={() => setStep(1)} className="text-xs text-orange-400 hover:underline font-medium">
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-gray-300">
                    {paymentMethod === "COD" ? "💵 Cash on Delivery" : "💳 Pay Online (Razorpay)"}
                  </p>
                  {appliedCoupon && (
                    <p className="text-sm text-emerald-400 mt-1.5">🏷️ Coupon "{appliedCoupon}" applied — ₹{discount} off</p>
                  )}
                </div>

                {/* Items review */}
                <div className="bg-[#13151b] border border-white/[0.06] rounded-2xl p-5 sm:p-6">
                  <h2 className="text-lg font-semibold mb-3">Items ({items.length})</h2>
                  <div className="space-y-2.5">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">
                          {item.food.title} <span className="text-gray-500">× {item.quantity}</span>
                        </span>
                        <span className="font-medium text-gray-200 tabular-nums">
                          ₹{item.food.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* NAVIGATION BUTTONS */}
            <div className="flex gap-3">
              {step > 0 && (
                <button
                  onClick={goBack}
                  className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors"
                >
                  <FiChevronLeft size={16} /> Back
                </button>
              )}

              {step < STEPS.length - 1 ? (
                <button
                  onClick={goNext}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 font-semibold text-sm hover:scale-[1.01] transition"
                >
                  Continue <FiChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleOrder}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 font-semibold text-sm hover:scale-[1.01] transition disabled:opacity-60"
                >
                  {loading && <FiLoader className="animate-spin" size={16} />}
                  {loading ? "Processing..." : `Place Order — ₹${finalPrice}`}
                </button>
              )}
            </div>
          </div>

          {/* ---------------- ORDER SUMMARY (sticky sidebar) ---------------- */}
          <div className="bg-[#13151b] border border-white/[0.06] rounded-2xl p-5 sm:p-6 lg:sticky lg:top-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1 mb-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  {item.food.image && (
                    <img src={item.food.image} alt={item.food.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 truncate">{item.food.title}</p>
                    <p className="text-xs text-gray-500">Qty {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-300 tabular-nums flex-shrink-0">
                    ₹{item.food.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm text-gray-300 pt-4 border-t border-white/[0.06]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums">₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Discount</span>
                  <span className="tabular-nums">- ₹{discount}</span>
                </div>
              )}

              <div className="border-t border-white/[0.06] pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-orange-400 tabular-nums">₹{finalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
