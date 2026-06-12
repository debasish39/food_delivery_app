import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";


// Admin Create Coupon
export const createCoupon = async (
  req,
  res
) => {
  try {
    const coupon =
      await Coupon.create(req.body);

    res.status(201).json({
      success: true,
      coupon,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get All Coupons
export const getCoupons = async (
  req,
  res
) => {
  try {
    const coupons =
      await Coupon.find();

    res.status(200).json({
      success: true,
      count: coupons.length,
      coupons,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Apply Coupon
export const applyCoupon = async (
  req,
  res
) => {
  try {
    const {
      code,
      cartTotal,
    } = req.body;

    const coupon =
      await Coupon.findOne({
        code: code.toUpperCase(),
      });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon",
      });
    }

    if (!coupon.isActive) {
  return res.status(400).json({
    success: false,
    message: "Coupon inactive",
  });
}

const alreadyUsed =
  coupon.usedBy.some(
    (userId) =>
      userId.toString() ===
      req.user._id.toString()
  );

if (alreadyUsed) {
  return res.status(400).json({
    success: false,
    message:
      "You have already used this coupon",
  });
}
    if (
      coupon.expiryDate <
      new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Coupon expired",
      });
    }

    const previousOrder =
      await Order.findOne({
        user: req.user._id,
      });

    if (
      coupon.isFirstOrderOnly &&
      previousOrder
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Coupon valid only for first order",
      });
    }

    if (
      cartTotal <
      coupon.minOrderAmount
    ) {
      return res.status(400).json({
        success: false,
        message: `Minimum order ₹${coupon.minOrderAmount}`,
      });
    }

    let discount = 0;

    if (
      coupon.discountType ===
      "percentage"
    ) {
      discount =
        (cartTotal *
          coupon.discountValue) /
        100;

      if (
        coupon.maxDiscount > 0
      ) {
        discount = Math.min(
          discount,
          coupon.maxDiscount
        );
      }
    } else {
      discount =
        coupon.discountValue;
    }

    res.status(200).json({
      success: true,
      coupon: coupon.code,
      discount,
      finalAmount:
        cartTotal - discount,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};