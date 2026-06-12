import express from "express";

import {
  createOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
} from "../controllers/orderController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  createOrder
);

router.get(
  "/my-orders",
  protect,
  getMyOrders
);

router.get(
  "/:id",
  protect,
  getSingleOrder
);

router.put(
  "/cancel/:id",
  protect,
  cancelOrder
);


// Admin
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllOrders
);

router.put(
  "/admin/status/:id",
  protect,
  adminOnly,
  updateOrderStatus
);

router.delete(
  "/admin/:id",
  protect,
  adminOnly,
  deleteOrder
);

export default router;