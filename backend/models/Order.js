import mongoose from "mongoose";

const phoneRegex = /^[6-9]\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pinRegex = /^\d{6}$/;

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderNumber: {
  type: String,
  unique: true,
},
    items: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        title: {
          type: String,
          required: true,
          trim: true,
        },
        image: {
          type: String,
          default: "",
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    shippingAddress: {
      fullName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
          validator: (v) => !v || emailRegex.test(v),
          message: "Invalid email format",
        },
      },

      phone: {
        type: String,
        required: true,
        validate: {
          validator: (v) => phoneRegex.test(v),
          message: "Invalid phone number",
        },
      },

      alternatePhone: {
        type: String,
        validate: {
          validator: (v) => !v || phoneRegex.test(v),
          message: "Invalid alternate phone number",
        },
        default: "",
      },

      addressLine1: {
        type: String,
        required: true,
        trim: true,
      },

      addressLine2: {
        type: String,
        default: "",
        trim: true,
      },

      landmark: {
        type: String,
        default: "",
        trim: true,
      },

      area: {
        type: String,
        default: "",
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      district: {
        type: String,
        default: "",
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      country: {
        type: String,
        default: "India",
      },

      postalCode: {
        type: String,
        required: true,
        validate: {
          validator: (v) => pinRegex.test(v),
          message: "Invalid postal code",
        },
      },

      latitude: {
        type: Number,
        default: null,
      },

      longitude: {
        type: Number,
        default: null,
      },

      addressType: {
        type: String,
        enum: ["Home", "Hostel", "Office"],
        default: "Home",
      },
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    coupon: {
      code: {
        type: String,
        default: "",
        uppercase: true,
        trim: true,
      },
      discount: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    finalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

paymentInfo: {
  razorpayOrderId: {
    type: String,
    default: "",
  },

  razorpayPaymentId: {
    type: String,
    default: "",
  },

  razorpaySignature: {
    type: String,
    default: "",
  },
},

    deliveryInfo: {
      deliveryPartner: { type: String, default: "" },
      deliveryPartnerPhone: { type: String, default: "" },
      vehicleNumber: { type: String, default: "" },
      deliveryCharge: { type: Number, default: 0, min: 0 },
      estimatedArrivalTime: { type: String, default: "" },
      currentLocation: { type: String, default: "" },
    },

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Preparing",
        "Out For Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
cancelReason: {
  type: String,
  default: "",
},
    deliveredAt: Date,
    cancelledAt: Date,
    paidAt: Date,
    refundInfo: {
  refundId: {
    type: String,
    default: "",
  },

  refundedAmount: {
    type: Number,
    default: 0,
  },

  refundReason: {
    type: String,
    default: "",
  },

  refundedAt: Date,
},
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);