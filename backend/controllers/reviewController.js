import Food from "../models/Food.js";
import Order from "../models/Order.js";


// Add Review
export const addReview = async (
  req,
  res
) => {
  try {
const {
  foodId,
  rating,
  comment,
} = req.body;

const images =
  req.files?.map(
    (file) => file.path
  ) || [];

    const food =
      await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    const hasPurchased =
      await Order.findOne({
        user: req.user._id,
        orderStatus: "Delivered",
        "items.food": foodId,
      });

    if (!hasPurchased) {
      return res.status(400).json({
        success: false,
        message:
          "You can only review foods you have ordered and received",
      });
    }

    const alreadyReviewed =
      food.reviews.find(
        (review) =>
          review.user.toString() ===
          req.user._id.toString()
      );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message:
          "You already reviewed this food",
      });
    }

   const review = {
  user: req.user._id,

  name:
    req.user.fullname,

  rating:
    Number(rating),

  comment,

  images,
};

    food.reviews.push(review);

    food.totalReviews =
      food.reviews.length;

    food.rating =
      food.reviews.reduce(
        (acc, item) =>
          acc + item.rating,
        0
      ) / food.reviews.length;

    await food.save();

    res.status(201).json({
      success: true,
      message:
        "Review added successfully",
      reviews: food.reviews,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};


// Get Reviews For Food
export const getFoodReviews =
  async (req, res) => {
    try {
      const food =
        await Food.findById(
          req.params.foodId
        ).populate(
          "reviews.user",
          "fullname email"
        );

      if (!food) {
        return res.status(404).json({
          success: false,
          message:
            "Food not found",
        });
      }

      res.status(200).json({
        success: true,
        rating: food.rating,
        totalReviews:
          food.totalReviews,
        reviews: food.reviews,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// Update Review
export const updateReview =
  async (req, res) => {
    try {
      const {
        foodId,
        rating,
        comment,
        images,
      } = req.body;

      const food =
        await Food.findById(foodId);

      if (!food) {
        return res.status(404).json({
          success: false,
          message:
            "Food not found",
        });
      }

      const review =
        food.reviews.find(
          (review) =>
            review.user.toString() ===
            req.user._id.toString()
        );

      if (!review) {
        return res.status(404).json({
          success: false,
          message:
            "Review not found",
        });
      }

      review.rating =
        Number(rating);

      review.comment =
        comment;

if (
  req.files &&
  req.files.length > 0
) {
  review.images =
    req.files.map(
      (file) =>
        file.path
    );
}

      food.rating =
        food.reviews.reduce(
          (acc, item) =>
            acc + item.rating,
          0
        ) / food.reviews.length;

      await food.save();

      res.status(200).json({
        success: true,
        message:
          "Review updated",
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// Delete Review
export const deleteReview =
  async (req, res) => {
    try {
      const {
        foodId,
      } = req.params;

      const food =
        await Food.findById(foodId);

      if (!food) {
        return res.status(404).json({
          success: false,
          message:
            "Food not found",
        });
      }

      food.reviews =
        food.reviews.filter(
          (review) =>
            review.user.toString() !==
            req.user._id.toString()
        );

      food.totalReviews =
        food.reviews.length;

      food.rating =
        food.reviews.length === 0
          ? 0
          : food.reviews.reduce(
              (acc, item) =>
                acc +
                item.rating,
              0
            ) /
            food.reviews.length;

      await food.save();

      res.status(200).json({
        success: true,
        message:
          "Review deleted",
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };
  export const likeReview = async (
  req,
  res
) => {
  try {
    const { foodId, reviewId } =
      req.params;

    const food =
      await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    const review =
      food.reviews.id(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const userId =
      req.user._id.toString();

    const alreadyLiked =
      review.likes.some(
        (id) => id.toString() === userId
      );

    if (alreadyLiked) {
      review.likes =
        review.likes.filter(
          (id) =>
            id.toString() !== userId
        );
    } else {
      review.likes.push(req.user._id);

      review.dislikes =
        review.dislikes.filter(
          (id) =>
            id.toString() !== userId
        );
    }

    await food.save();

    res.status(200).json({
      success: true,
      likes: review.likes.length,
      dislikes:
        review.dislikes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const dislikeReview = async (
  req,
  res
) => {
  try {
    const { foodId, reviewId } =
      req.params;

    const food =
      await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    const review =
      food.reviews.id(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const userId =
      req.user._id.toString();

    const alreadyDisliked =
      review.dislikes.some(
        (id) => id.toString() === userId
      );

    if (alreadyDisliked) {
      review.dislikes =
        review.dislikes.filter(
          (id) =>
            id.toString() !== userId
        );
    } else {
      review.dislikes.push(
        req.user._id
      );

      review.likes =
        review.likes.filter(
          (id) =>
            id.toString() !== userId
        );
    }

    await food.save();

    res.status(200).json({
      success: true,
      likes: review.likes.length,
      dislikes:
        review.dislikes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};