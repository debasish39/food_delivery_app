import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      default: "",
    },

    images: [
      {
        type: String,
      },
    ],
likes: {
  type: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  default: [],
},

dislikes: {
  type: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  default: [],
},
    createdAt: {
      type: Date,
      default:
        Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const foodSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    images: [
  {
    type: String,
    default: [],
  },
],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Food",
  foodSchema
);