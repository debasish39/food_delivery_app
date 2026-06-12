import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
    },

    minOrderAmount: {
      type: Number,
      default: 0,
    },

    maxDiscount: {
      type: Number,
      default: 0,
    },

    isFirstOrderOnly: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },
    usedBy: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],

usageLimit: {
  type: Number,
  default: 1000,
},

usedCount: {
  type: Number,
  default: 0,
},
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Coupon",
  couponSchema
);