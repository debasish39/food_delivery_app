import express from "express";

import {
  addReview,
  updateReview,
  deleteReview,
  getFoodReviews,
  likeReview,
  dislikeReview,
} from "../controllers/reviewController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import upload from "../utils/multer.js";

const router =
  express.Router();

router.post(
  "/",
  protect,
  upload.array(
    "images",
    5
  ),
  addReview
);

router.put(
  "/",
  protect,
  upload.array(
    "images",
    5
  ),
  updateReview
);

router.get(
  "/:foodId",
  getFoodReviews
);

router.delete(
  "/:foodId",
  protect,
  deleteReview
);
router.put(
  "/:foodId/review/:reviewId/like",
  protect,
  likeReview
);

router.put(
  "/:foodId/review/:reviewId/dislike",
 protect,
  dislikeReview
);
export default router;