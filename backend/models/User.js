import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: String,

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
   profileImage: {
  type: String,
  default: "",
},
    isVerified: {
      type: Boolean,
      default: false,
    },
isBlocked: {
  type: Boolean,
  default: false,
},
    emailOtp: String,

    otpExpire: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "User",
  userSchema
);