import express from "express";

import {
  createRazorpayOrder,
  verifyPayment,refundPayment,getAllPayments
} from "../controllers/paymentController.js";

import {
  protect,adminOnly
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/create-order",
  protect,
  createRazorpayOrder
);

router.post(
  "/verify",
  protect,
  verifyPayment
);
router.post(
"/refund/:id",
protect,
adminOnly,
refundPayment
)
router.get(
  "/payments",
  protect,
  adminOnly,
  getAllPayments
)
export default router;