import express from "express";

import {
  createFood,
  getAllFoods,
  getSingleFood,
  updateFood,
  deleteFood,
  searchFoods,
  getFoodsByCategory,
} from "../controllers/foodController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

import upload from "../utils/multer.js";

const router = express.Router();


// Public Routes
router.get("/", getAllFoods);

router.get("/search", searchFoods);

router.get(
  "/category/:categoryId",
  getFoodsByCategory
);

router.get("/:id", getSingleFood);


// Admin Routes
router.post(
  "/",
  protect,
  adminOnly,
  upload.array("images", 10),
  createFood
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.array("images", 10),
  updateFood
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteFood
);

export default router;