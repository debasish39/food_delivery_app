import API from "../api/axios";

export const createRazorpayOrder =
  (
    amount,
    orderId
  ) =>
    API.post(
      "/payment/create-order",
      {
        amount,
        orderId,
      }
    );

export const verifyPayment =
  (paymentData) =>
    API.post(
      "/payment/verify",
      paymentData
    );