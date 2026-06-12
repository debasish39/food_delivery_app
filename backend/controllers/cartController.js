import Cart from "../models/Cart.js";
import Food from "../models/Food.js";


// Add To Cart
export const addToCart = async (
  req,
  res
) => {
  try {
    const { foodId, quantity } =
      req.body;

    const food =
      await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [
          {
            food: foodId,
            quantity:
              quantity || 1,
          },
        ],
      });
    } else {
      const itemIndex =
        cart.items.findIndex(
          (item) =>
            item.food.toString() ===
            foodId
        );

      if (itemIndex > -1) {
        cart.items[
          itemIndex
        ].quantity +=
          quantity || 1;
      } else {
        cart.items.push({
          food: foodId,
          quantity:
            quantity || 1,
        });
      }

      await cart.save();
    }

    res.status(200).json({
      success: true,
      message:
        "Item added to cart",
      cart,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.food");

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    // Remove invalid food references
    cart.items = cart.items.filter(
      (item) => item.food !== null
    );

    await cart.save();

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateCartItem =
  async (req, res) => {
    try {
      const {
        foodId,
        quantity,
      } = req.body;

      const cart =
        await Cart.findOne({
          user: req.user._id,
        });

      if (!cart) {
        return res.status(404).json({
          success: false,
          message:
            "Cart not found",
        });
      }

      const item =
        cart.items.find(
          (item) =>
            item.food.toString() ===
            foodId
        );

      if (!item) {
        return res.status(404).json({
          success: false,
          message:
            "Item not found",
        });
      }

      item.quantity =
        Number(quantity);

      await cart.save();

      res.status(200).json({
        success: true,
        message:
          "Quantity updated",
        cart,
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
  export const removeCartItem =
  async (req, res) => {
    try {
      const { foodId } =
        req.params;

      const cart =
        await Cart.findOne({
          user: req.user._id,
        });

      if (!cart) {
        return res.status(404).json({
          success: false,
          message:
            "Cart not found",
        });
      }

      cart.items =
        cart.items.filter(
          (item) =>
            item.food.toString() !==
            foodId
        );

      await cart.save();

      res.status(200).json({
        success: true,
        message:
          "Item removed",
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
  export const clearCart = async (
  req,
  res
) => {
  try {
    const cart =
      await Cart.findOne({
        user: req.user._id,
      });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message:
          "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      success: true,
      message:
        "Cart cleared",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};