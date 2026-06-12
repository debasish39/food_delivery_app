import Food from "../models/Food.js";
import cloudinary from "../config/cloudinary.js";
export const createFood = async (req, res) => {
  try {
    const imageUrls = req.files?.map((file) => file.path) || [];

    const food = await Food.create({
      ...req.body,
      images: imageUrls,
    });

    res.status(201).json({
      success: true,
      food,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllFoods = async (
  req,
  res
) => {
  try {
    const foods = await Food.find()
      .populate("category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foods.length,
      foods,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getSingleFood = async (
  req,
  res
) => {
  try {
    const food = await Food.findById(
      req.params.id
    ).populate("category");

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.status(200).json({
      success: true,
      food,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    Object.assign(food, req.body);

    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map((file) => file.path);

      food.images = imageUrls;
    }

    await food.save();

    res.status(200).json({
      success: true,
      food,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteFood = async (
  req,
  res
) => {
  try {

    const food =
      await Food.findById(
        req.params.id
      );

    if (!food) {
      return res.status(404).json({
        success: false,
        message:
          "Food not found",
      });
    }

    // Delete images from Cloudinary

    if (
      food.images &&
      food.images.length > 0
    ) {

      for (const image of food.images) {

        try {

          const publicId =
            image
              .split("/")
              .pop()
              .split(".")[0];

          await cloudinary.uploader.destroy(
            publicId
          );

        } catch (err) {

          console.log(
            "Cloudinary Delete Error:",
            err.message
          );
        }
      }
    }

    await food.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Food deleted successfully",
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
export const searchFoods = async (
  req,
  res
) => {
  try {
    const keyword =
      req.query.keyword || "";

    const foods = await Food.find({
      title: {
        $regex: keyword,
        $options: "i",
      },
    });

    res.status(200).json({
      success: true,
      foods,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getFoodsByCategory =
  async (req, res) => {
    try {
      const foods = await Food.find({
        category:
          req.params.categoryId,
      }).populate("category");

      res.status(200).json({
        success: true,
        foods,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };