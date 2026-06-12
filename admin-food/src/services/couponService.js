import API from "../api/axios";

export const getCoupons = () =>
  API.get("/coupons");

export const createCoupon = (data) =>
  API.post("/coupons", data);

export const updateCoupon = (id, data) =>
  API.put(`/coupons/${id}`, data);

export const deleteCoupon = (id) =>
  API.delete(`/coupons/${id}`);