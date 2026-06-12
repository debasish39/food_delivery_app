import API from "../api/axios";

// ======================
// ADMIN ORDERS
// ======================

// Get All Orders (admin)
export const getAllOrders = () =>
  API.get("/orders/admin/all");

// Update Order Status (admin)
export const updateOrderStatus = (id, data) =>
  API.put(`/orders/admin/status/${id}`, data);

// Delete Order (admin)
export const deleteOrder = (id) =>
  API.delete(`/orders/admin/${id}`);