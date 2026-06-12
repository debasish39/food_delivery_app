import express from "express";

import {
  createCoupon,
  getCoupons,
  applyCoupon,
} from "../controllers/couponController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// Public/User
router.post(
  "/apply",
  protect,
  applyCoupon
);


// Admin
router.post(
  "/",
  protect,
  adminOnly,
  createCoupon
);

router.get(
  "/",
  protect,
  adminOnly,
  getCoupons
);

export default router;