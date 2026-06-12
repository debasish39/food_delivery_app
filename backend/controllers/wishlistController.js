import Wishlist from "../models/Wishlist.js";
import Food from "../models/Food.js";

/* =========================
   ADD TO WISHLIST
========================= */
export const addToWishlist = async (req, res) => {
  try {
    const { foodId } = req.body;

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        foods: [foodId],
      });
    } else {
      const exists = wishlist.foods.some(
        (item) => item.toString() === foodId
      );

      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Food already in wishlist",
        });
      }

      wishlist.foods.push(foodId);
      await wishlist.save();
    }

    // ✅ POPULATE BEFORE RESPONSE
    await wishlist.populate({
      path: "foods",
      select: "title images price rating",
    });

    return res.status(200).json({
      success: true,
      message: "Added to wishlist",
      wishlist,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET WISHLIST
========================= */
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    }).populate({
      path: "foods",
      select: "title images price rating description",
    });

    // IMPORTANT FIX (consistent response)
    if (!wishlist) {
      return res.status(200).json({
        success: true,
        wishlist: {
          foods: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      wishlist,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   REMOVE FROM WISHLIST
========================= */
export const removeFromWishlist = async (req, res) => {
  try {
    const { foodId } = req.params;

    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.foods = wishlist.foods.filter(
      (item) => item.toString() !== foodId
    );

    await wishlist.save();

    // ✅ POPULATE AGAIN
    await wishlist.populate({
      path: "foods",
      select: "title images price rating",
    });

    return res.status(200).json({
      success: true,
      message: "Removed from wishlist",
      wishlist,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   CLEAR WISHLIST
========================= */
export const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.foods = [];
    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Wishlist cleared",
      wishlist: {
        foods: [],
      },
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};