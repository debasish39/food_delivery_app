import express from "express";

import {
  createCategory,
  getAllCategories,
  getSingleCategory,
  getFoodsByCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

import upload from "../utils/multer.js";
const router = express.Router();


// Public
router.get(
  "/",
  getAllCategories
);

router.get(
  "/foods/:categoryId",
  getFoodsByCategory,
  protect,
  adminOnly
);
router.get(
  "/:id",
  getSingleCategory
);


// Admin Only
router.post(
 "/",
  upload.single("image"),
  protect,
  adminOnly,
  createCategory
);

router.put(
  "/:id",
  upload.single("image"),
  protect,
  adminOnly,
  updateCategory
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteCategory
);

export default router;