import API from "../api/axios";

// Apply Coupon
export const applyCoupon =
  (couponData) =>
    API.post(
      "/coupons/apply",
      couponData
    );

// Get Available Coupons
export const getCoupons =
  () =>
    API.get("/coupons");