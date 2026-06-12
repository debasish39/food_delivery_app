import { useEffect, useState } from "react";
import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../services/cartService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiShoppingCart,
  FiArrowLeft,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiCreditCard,
  FiPackage,
} from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
export default function Cart() {
  const [cart, setCart] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [updatingQty, setUpdatingQty] = useState({});
  const fetchCart = async () => {
    try {
      const { data } = await getCart();
      setCart(data.cart);

      const initialQuantities = {};
      data.cart.items
        ?.filter((item) => item.food)
        .forEach((item) => {
          initialQuantities[item.food._id] = item.quantity;
        });
      setQuantities(initialQuantities);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const changeQuantity = async (foodId, newQty) => {
    console.log("Updating:", foodId, newQty);

    try {
      const res = await updateCartItem(foodId, newQty);
      console.log(res.data);

      setQuantities((prev) => ({
        ...prev,
        [foodId]: newQty,
      }));
    } catch (error) {
      console.log(error.response?.data || error);
    }
  };
  const removeItem = async (foodId) => {
    setRemovingId(foodId);
    try {
      await removeCartItem(foodId);
      await fetchCart();
    } catch (error) {
      console.log(error);
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const increaseQuantity = (
    foodId
  ) => {
    const current =
      quantities[foodId] || 1;

    changeQuantity(
      foodId,
      current + 1
    );
  };

  const decreaseQuantity = (
    foodId
  ) => {
    const current =
      quantities[foodId] || 1;

    if (current <= 1) return;

    changeQuantity(
      foodId,
      current - 1
    );
  };

  const validItems = cart?.items?.filter((item) => item.food) || [];

  const subtotal = validItems.reduce((acc, item) => {
    const qty = quantities[item.food._id] || item.quantity;
    return acc + item.food.price * qty;
  }, 0);

  const itemCount = validItems.reduce((acc, item) => {
    const qty = quantities[item.food._id] || item.quantity;
    return acc + qty;
  }, 0);

  // SIMPLE TOTAL (NO GST, NO DELIVERY CHARGES)
  const total = subtotal;
  /* ───────── Loading ───────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b0e] flex items-center justify-center">
        <style>{spinKeyframes}</style>
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-white/5" />
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500"
              style={{ animation: "spin 0.8s linear infinite" }}
            />
          </div>
          <p className="text-sm text-gray-500 font-medium tracking-wide">Loading your cart…</p>
        </div>
      </div>
    );
  }

  /* ───────── Empty ───────── */
  if (!validItems.length) {
    return (
      <div className="min-h-screen bg-[#0a0b0e] flex flex-col items-center justify-center px-5 text-center relative overflow-hidden">
        <div className="absolute -top-32 -left-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-20 w-80 h-80 bg-red-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 w-28 h-28 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <span className="text-6xl">🛒</span>
        </div>

        <h1 className="relative z-10 text-3xl font-bold text-white tracking-tight">
          Your cart is empty
        </h1>

        <p className="relative z-10 text-gray-400 mt-3 max-w-sm leading-relaxed">
          Looks like you haven't added anything yet. Explore our menu and find something delicious.
        </p>

        <Link
          to="/foods"
          className="relative z-10 mt-8 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          Explore Menu
        </Link>
      </div>
    );
  }

  /* ───────── Main ───────── */
  return (
    <div className="min-h-screen bg-[#0a0b0e] text-white pb-32 lg:pb-10 mt-15">
      <style>{spinKeyframes}</style>

      {/* Header */}
      <div className="border-b border-white/5 bg-[#0d0e12]">
        <div className="max-w-6xl mx-auto px-5 lg:px-6 py-8">
          <div className="flex items-center justify-between flex-wrap gap-3">

            <div>
              <Link
                to="/foods"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition"
              >
                <FiArrowLeft />
                Continue Shopping
              </Link>

              <h1 className="mt-2 flex items-center gap-2 text-3xl md:text-4xl font-bold tracking-tight">
                <FiShoppingCart className="text-orange-400" />
                My Cart
              </h1>

              <p className="text-gray-500 mt-1.5 text-sm flex items-center gap-2">
                <FiPackage />
                {itemCount} {itemCount === 1 ? "item" : "items"} ready for checkout
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {validItems.map((item) => {
              const qty = quantities[item.food._id] || item.quantity;
              const isRemoving = removingId === item.food._id;

              return (
                <div
                  key={item._id}
                  className={`group bg-[#13151b] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-orange-500/25 hover:bg-[#15171f] transition-all duration-300 ${isRemoving ? "opacity-40 scale-[0.98]" : ""
                    }`}
                >

                  <div className="flex">

                    {/* Image Carousel */}
                    <Link to={`/food/${item.food._id}`}>
                      <div className="relative w-28 h-28 sm:w-36 sm:h-36 overflow-hidden rounded-xl">
                        <Swiper
                          modules={[Autoplay]}
                          autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                          }}
                          pagination={{ clickable: true }}
                          loop={(item.food?.images?.length || 1) > 1}
                          className="h-full w-full"
                        >
                          {(item.food?.images?.length
                            ? item.food.images
                            : [item.food.image]
                          ).map((img, idx) => (
                            <SwiperSlide key={idx}>
                              <img
                                src={img}
                                alt={item.food.title}
                                className="w-full h-full object-cover"
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
                      {/* Top section */}
                      <div className="flex justify-between gap-3">

                        {/* Food details */}
                        <div className="min-w-0">
                          <Link to={`/foods/${item.food._id}`}>
                            <h2 className="text-white font-semibold text-base sm:text-lg truncate pr-2">
                              {item.food.title}
                            </h2>
                          </Link>
                          <p className="text-orange-400 font-bold mt-1 text-sm sm:text-base">
                            ₹{item.food.price}
                            <span className="text-gray-500 font-normal text-xs ml-1">
                              per item
                            </span>
                          </p>

                          {/* Subtle total preview */}
                          {/* <p className="text-gray-500 text-xs mt-1">
        Total:{" "}
        <span className="text-gray-300 font-medium">
         {item.food.price} x {qty} = ₹{(item.food.price * qty).toLocaleString("en-IN")}
        </span>
      </p> */}
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => removeItem(item.food._id)}
                          disabled={isRemoving}
                          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center
                 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400
                 transition-all active:scale-95"
                        >
                          {isRemoving ? (
                            <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin cursor-pointer" />
                          ) : (
                            <FiTrash2 size={16} />
                          )}
                        </button>
                      </div>

                      {/* Bottom section */}
                      <div className="flex items-center justify-between mt-4 sm:mt-5">

                        {/* Quantity stepper (modern pill style) */}
                        <div className="flex items-center bg-[#0b0c10] border border-white/10 rounded-full overflow-hidden shadow-sm">

                          <button
                            disabled={updatingQty[item.food._id]}
                            onClick={() => decreaseQuantity(item.food._id)}
                            className="w-10 h-10 flex items-center justify-center text-gray-400
                   hover:text-white hover:bg-white/5 transition active:scale-95"
                          >
                            <FiMinus size={14} />
                          </button>

                          <div className="px-3 min-w-[36px] text-center text-white font-medium text-sm">
                            {qty}
                          </div>

                          <button
                            disabled={updatingQty[item.food._id]}
                            onClick={() => increaseQuantity(item.food._id)}
                            className="w-10 h-10 flex items-center justify-center text-gray-400
                   hover:text-white hover:bg-white/5 transition active:scale-95"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-xs text-gray-300">Item Total</p>
                          <p className="text-lg sm:text-xl font-bold text-white tabular-nums">
                            {item.food.price} x {qty} =  ₹{(item.food.price * qty).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Summary — desktop sticky sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-6 bg-[#13151b] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-5 tracking-tight">Order Summary</h2>

              <div className="space-y-3.5 text-sm">

                {/* <div className="flex justify-between text-gray-400">
                  <span>Delivery Fee</span>
                  <span className={`font-medium tabular-nums ${deliveryFee === 0 ? "text-emerald-400" : "text-gray-200"}`}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div> */}

                {/* <div className="flex justify-between text-gray-400">
                  <span>Taxes &amp; Charges</span>
                  <span className="text-gray-200 font-medium tabular-nums">₹{tax}</span>
                </div> */}
              </div>

              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="text-gray-200 font-medium tabular-nums">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/[0.06] mt-5 pt-5 flex justify-between items-baseline">
                <span className="text-base font-semibold text-gray-300">Total</span>
                <span className="text-2xl font-bold text-orange-400 tabular-nums">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <Link
                to="/checkout"
                className="mt-6 flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 font-semibold shadow-lg hover:scale-[1.02] transition"
              >
                <FiCreditCard />
                Proceed to Checkout
              </Link>

              <Link
                to="/foods"
                className="block text-center mt-4 text-sm text-gray-500 hover:text-white transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky checkout bar */}
      <div className="lg:hidden fixed bottom-[10%] left-0 right-0 z-40 bg-[#0d0e12]/90 backdrop-blur-xl border-t border-white/[0.06] px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.4)]">

        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <p className="text-[11px] text-gray-500 leading-tight">Total</p>
            <p className="text-lg font-bold text-orange-400 tabular-nums leading-tight">
              ₹{total.toLocaleString("en-IN")}
            </p>
          </div>
          <Link
            to="/checkout"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 font-semibold text-sm shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-transform"
          >
            Proceed to Checkout
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

const spinKeyframes = `
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;