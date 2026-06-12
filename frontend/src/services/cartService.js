import API from "../api/axios";

// Get Cart
export const getCart = () =>
  API.get("/cart");

// Add To Cart
export const addToCart = (
  foodId,
  quantity = 1
) =>
  API.post("/cart/add", {
    foodId,
    quantity,
  });

// Update Quantity
export const updateCartItem = (
  foodId,
  quantity
) =>
  API.put("/cart/update", {
    foodId,
    quantity,
  });

// Remove Item
export const removeCartItem =
  (foodId) =>
    API.delete(
      `/cart/remove/${foodId}`
    );

// Clear Cart
export const clearCart = () =>
  API.delete("/cart/clear");