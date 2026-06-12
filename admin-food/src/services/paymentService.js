import API from "../api/axios";

export const getAllPayments = () =>
  API.get("/payment/payments");

export const refundPayment = (
  orderId,
  refundReason
) =>
  API.post(
    `/payment/refund/${orderId}`,
    { refundReason }
  );