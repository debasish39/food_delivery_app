import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Coupon from "../models/Coupon.js";
import razorpay from "../utils/razorpay.js";
import Food from "../models/Food.js";
export const createOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod,
      coupon,
      directBuy
    } = req.body;

    let items = [];

    // =========================
    // CASE 1: DIRECT BUY
    // =========================
    if (directBuy) {
      const food = await Food.findById(directBuy.food._id);

      if (!food) {
        return res.status(404).json({
          success: false,
          message: "Food not found",
        });
      }

      if (food.stock < directBuy.quantity) {
        return res.status(400).json({
          success: false,
          message: "Not enough stock",
        });
      }

      items = [
        {
          food: food._id,
          title: food.title,
          image: food.images?.[0] || "",
          price: food.price,
          quantity: directBuy.quantity,
        },
      ];
    }

    // =========================
    // CASE 2: CART ORDER
    // =========================
    else {
      const cart = await Cart.findOne({
        user: req.user._id,
      }).populate("items.food");

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Cart is empty",
        });
      }

      items = cart.items.map((item) => ({
        food: item.food._id,
        title: item.food.title,
        image: item.food.images?.[0] || "",
        price: item.food.price,
        quantity: item.quantity,
      }));
    }

    // =========================
    // TOTAL CALCULATION
    // =========================
    const totalPrice = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    let discount = 0;
    let couponData = null;

    if (coupon?.code) {
      couponData = await Coupon.findOne({ code: coupon.code });

      if (!couponData || !couponData.isActive) {
        return res.status(400).json({
          success: false,
          message: "Invalid coupon",
        });
      }

      discount = couponData.discountValue;
    }

    const finalPrice = Math.max(totalPrice - discount, 0);

    // =========================
    // STOCK CHECK
    // =========================
    for (const item of items) {
      const food = await Food.findById(item.food);

      if (!food || food.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${item.title} not available`,
        });
      }
    }

    // =========================
    // CREATE ORDER
    // =========================
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      totalPrice,
      finalPrice,
      coupon: couponData
        ? { code: couponData.code, discount }
        : { code: "", discount: 0 },
      paymentMethod,
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    // =========================
    // REDUCE STOCK
    // =========================
    for (const item of items) {
      await Food.findByIdAndUpdate(item.food, {
        $inc: { stock: -item.quantity },
      });
    }

    // =========================
    // CLEAR CART ONLY IF CART ORDER
    // =========================
    if (!directBuy) {
      const cart = await Cart.findOne({ user: req.user._id });
      cart.items = [];
      await cart.save();
    }

    res.status(201).json({
      success: true,
      order,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "fullname email"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "fullname email").sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus =
  async (req, res) => {
    try {
      const order =
        await Order.findById(
          req.params.id
        ).populate(
          "user",
          "fullname email"
        );
           

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found",
        });
      }

      order.orderStatus =
        req.body.orderStatus;

      // Delivery Information
      if (
        req.body.orderStatus ===
        "Out For Delivery"
      ) {

        order.deliveryInfo = {
          deliveryPartner:
            req.body.deliveryPartner,

          deliveryPartnerPhone:
            req.body.deliveryPartnerPhone,

          vehicleNumber:
            req.body.vehicleNumber,

          deliveryCharge:
            req.body.deliveryCharge || 0,

          estimatedArrivalTime:
            req.body.estimatedArrivalTime,
        };
      }
if (req.body.orderStatus === "Delivered") {
  order.deliveredAt = new Date();

  // COD becomes paid only after delivery
  if (order.paymentMethod === "COD") {
    order.paymentStatus = "Paid";
  }

  // ONLINE: keep as Paid (only if not already handled via Razorpay webhook)
  if (order.paymentMethod === "ONLINE" && order.paymentStatus !== "Paid") {
    order.paymentStatus = "Paid";
  }
}
      await order.save();

      // Emails
      if (
        order.orderStatus ===
        "Preparing"
      ) {

        await sendEmail(
          order.user.email,
          "Order Confirmed",
          `
          <h2>Your Order is Confirmed</h2>

          <p>Hello ${order.user.fullname}</p>

          <p>Your food is being prepared.</p>

          <p>Order ID: ${order._id}</p>
          `
        );
      }

      if (
        order.orderStatus ===
        "Out For Delivery"
      ) {

        await sendEmail(
          order.user.email,
          "Food Out For Delivery",
          `
          <h2>Your Food Is On The Way</h2>

          <p>Hello ${order.user.fullname}</p>

          <p>Delivery Partner:
          ${order.deliveryInfo.deliveryPartner}</p>

          <p>Phone:
          ${order.deliveryInfo.deliveryPartnerPhone}</p>

          <p>Vehicle:
          ${order.deliveryInfo.vehicleNumber}</p>

          <p>ETA:
          ${order.deliveryInfo.estimatedArrivalTime}</p>
          `
        );
      }

      if (
        order.orderStatus ===
        "Delivered"
      ) {

        await sendEmail(
          order.user.email,
          "Order Delivered",
          `
          <h2>Order Delivered</h2>

          <p>Hello ${order.user.fullname}</p>

          <p>Your order has been delivered successfully.</p>

          <p>Please leave a review.</p>
          `
        );
      }

      res.status(200).json({
        success: true,
        message:
          "Order status updated",
        order,
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

export const cancelOrder = async (
  req,
  res
) => {
  try {

    const order =
      await Order.findById(
        req.params.id
      ).populate(
        "user",
        "fullname email"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found",
      });
    }

    if (
      [
        "Out For Delivery",
        "Delivered",
        "Cancelled",
      ].includes(
        order.orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Cannot cancel order in ${order.orderStatus} status`,
      });
    }

    // Restore Stock
    for (const item of order.items) {

      await Food.findByIdAndUpdate(
        item.food,
        {
          $inc: {
            stock:
              item.quantity,
          },
        }
      );

    }

    order.orderStatus =
      "Cancelled";

    order.cancelReason =
      req.body.reason ||
      "Cancelled by user";

    order.cancelledAt =
      new Date();

  if (
  order.paymentMethod === "ONLINE" &&
  order.paymentStatus === "Paid" &&
  order.paymentInfo?.razorpayPaymentId
) {
  try {
    const refund = await razorpay.payments.refund(
      order.paymentInfo.razorpayPaymentId,
      {
        amount: Math.round(order.finalPrice * 100), // paise
      }
    );

    order.paymentStatus = "Refunded";

    order.refundInfo = {
      refundedAmount: order.finalPrice,
      razorpayRefundId: refund.id,
      refundStatus: refund.status, // processed/pending
      refundReason: order.cancelReason,
      refundedAt: new Date(),
    };
  } catch (err) {
    console.log("Razorpay refund failed:", err);

    return res.status(500).json({
      success: false,
      message: "Refund failed. Please contact support.",
    });
  }
}
    await order.save();

    // Send Email
    await sendEmail(
      order.user.email,
      "Order Cancelled",
      `
      <h2>Order Cancelled</h2>

      <p>Hello ${order.user.fullname}</p>

      <p>Your order has been cancelled successfully.</p>

      <p>
        <strong>Order ID:</strong>
        ${order._id}
      </p>

      <p>
        <strong>Reason:</strong>
        ${order.cancelReason}
      </p>

      ${
        order.paymentMethod ===
          "ONLINE"
          ? `
        <p>
          Refund Amount:
          ₹${order.finalPrice}
        </p>
      `
          : ""
      }

      <p>
        Thank you for using FoodHub.
      </p>
      `
    );

    res.status(200).json({
      success: true,
      message:
        "Order cancelled successfully",
      order,
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
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus !== "Delivered") {
      for (const item of order.items) {
        await Food.findByIdAndUpdate(item.food, {
          $inc: { stock: item.quantity },
        });
      }
    }

    await order.deleteOne();

    res.json({
      success: true,
      message: "Order deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
