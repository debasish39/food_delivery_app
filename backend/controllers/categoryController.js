import Category from "../models/Category.js";
import Food from "../models/Food.js";


// Create Category
export const createCategory = async (
  req,
  res
) => {
  try {

    const {
      name,
      description,
    } = req.body;

    const categoryExists =
      await Category.findOne({
        name,
      });

    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message:
          "Category already exists",
      });
    }

    const category =
      await Category.create({
        name,
        description,
        image:
          req.file?.path || "",
      });

    res.status(201).json({
      success: true,
      message:
        "Category created successfully",
      category,
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


// Get All Categories
export const getAllCategories =
  async (req, res) => {
    try {
      const categories =
        await Category.find().sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        count:
          categories.length,
        categories,
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


// Get Single Category
export const getSingleCategory =
  async (req, res) => {
    try {
      const category =
        await Category.findById(
          req.params.id
        );

      if (!category) {
        return res.status(404).json({
          success: false,
          message:
            "Category not found",
        });
      }

      res.status(200).json({
        success: true,
        category,
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


// Update Category
export const updateCategory =
  async (req, res) => {
    try {

      const category =
        await Category.findById(
          req.params.id
        );

      if (!category) {
        return res.status(404).json({
          success: false,
          message:
            "Category not found",
        });
      }

      category.name =
        req.body.name ||
        category.name;

      category.description =
        req.body.description ||
        category.description;

      if (req.file) {
        category.image =
          req.file.path;
      }

      await category.save();

      res.status(200).json({
        success: true,
        message:
          "Category updated",
        category,
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

// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 🔥 STEP 1: Delete all foods under this category
    await Food.deleteMany({ category: req.params.id });

    // 🔥 STEP 2: Delete category itself
    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category and related foods deleted",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getFoodsByCategory = async (req, res) => {
  try {
    const foods = await Food.find({
      category: req.params.categoryId,
    }).populate("category");

    res.status(200).json({
      success: true,
      foods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};