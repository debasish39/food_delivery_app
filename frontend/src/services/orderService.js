import API from "../api/axios";

// Create Order
export const createOrder = (
  orderData
) =>
  API.post(
    "/orders",
    orderData
  );

// My Orders
export const getMyOrders =
  () =>
    API.get(
      "/orders/my-orders"
    );

// Single Order
export const getSingleOrder =
  (id) =>
    API.get(
      `/orders/${id}`
    );

// Cancel Order
export const cancelOrder =
  (id,data) =>
    API.put(
      `/orders/cancel/${id}`,data
    );