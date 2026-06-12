/**
 * These functions interact with an API to manage a user's wishlist by getting, adding, removing, and
 * clearing items.
 * @returns These functions are returning promises that will resolve to the response data from the API
 * calls.
 */
import API from "../api/axios";

// Get User Wishlist
export const getWishlist =
  async () => {
    return await API.get(
      "/wishlist"
    );
  };

// Add Food To Wishlist
export const addToWishlist =
  async (foodId) => {
    return await API.post(
      "/wishlist/add",
      {
        foodId,
      }
    );
  };

// Remove Food From Wishlist
export const removeWishlist =
  async (foodId) => {
    return await API.delete(
      `/wishlist/remove/${foodId}`
    );
  };

// Clear Entire Wishlist
export const clearWishlist =
  async () => {
    return await API.delete(
      "/wishlist/clear"
    );
  };