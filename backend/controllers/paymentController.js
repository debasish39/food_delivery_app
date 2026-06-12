import razorpay from "../utils/razorpay.js";
import crypto from "crypto";
import Order from "../models/Order.js";
import dotenv from "dotenv";

dotenv.config();


// ================= CREATE RAZORPAY ORDER =================
export const createRazorpayOrder =
  async (req, res) => {

    try {

      const {
        amount,
        orderId,
      } = req.body;

      const options = {
        amount:
          amount * 100,

        currency: "INR",

        receipt:
          orderId,

        notes: {
          mongoOrderId:
            orderId,
        },
      };

      const order =
        await razorpay.orders.create(
          options
        );

      res.status(200).json({
        success: true,
        order,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// ================= VERIFY PAYMENT =================
export const verifyPayment =
  async (req, res) => {

    try {

      const {

        razorpay_order_id,

        razorpay_payment_id,

        razorpay_signature,

        orderId,

      } = req.body;

      console.log(
  "Mongo Order ID:",
  orderId
);

console.log(
  "Payment ID:",
  razorpay_payment_id
);
      const generatedSignature =
        crypto
          .createHmac(
            "sha256",
            process.env
              .RAZORPAY_SECRET
          )
          .update(
            `${razorpay_order_id}|${razorpay_payment_id}`
          )
          .digest("hex");

      if (
        generatedSignature !==
        razorpay_signature
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Invalid signature",
        });
      }

      const order =
        await Order.findById(
          orderId
        );

      if (!order) {

        return res.status(404).json({
          success: false,
          message:
            "Order not found",
        });
      }

      order.paymentStatus =
        "Paid";

      order.paidAt =
        new Date();

      order.paymentInfo = {

        razorpayOrderId:
          razorpay_order_id,

        razorpayPaymentId:
          razorpay_payment_id,

        razorpaySignature:
          razorpay_signature,
      };

      await order.save();

      res.status(200).json({
        success: true,
        message:
          "Payment verified successfully",
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


// ================= REFUND PAYMENT =================
export const refundPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentStatus !== "Paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }
console.log(
  "Payment ID:",
  order.paymentInfo?.razorpayPaymentId
);
    // 🔥 Correct Razorpay refund method
    const refund = await razorpay.payments.refund(
      order.paymentInfo.razorpayPaymentId,
      {
        amount: order.finalPrice * 100,
      }
    );

    order.paymentStatus = "Refunded";
    order.orderStatus = "Cancelled";
await order.save();

console.log(
  "Saved Payment Info:",
  order.paymentInfo
);

    res.status(200).json({
      success: true,
      message: "Refund successful",
      refund,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= GET ALL PAYMENTS =================
export const getAllPayments = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "fullname email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      payments: orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};