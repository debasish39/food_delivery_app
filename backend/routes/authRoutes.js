import express from "express";

import {
  registerUser,
  verifyEmailOtp,
  sendLoginOtp,
  verifyLoginOtp,
  loginUser,
  resendOtp,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  verifyUser,
  deleteUser,
  blockUser,
  unblockUser,
} from "../controllers/authController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../utils/multer.js";

const router = express.Router();
router.get(
  "/users",
  protect,
  adminOnly,
  getAllUsers,
  
);

router.get(
  "/users/:id",
  protect,
  adminOnly,
  getSingleUser
);

router.put(
  "/users/:id/role",
  protect,
  adminOnly,
  updateUserRole
);

router.put(
  "/users/:id/verify",
  protect,
  adminOnly,
  verifyUser
);

router.delete(
  "/users/:id",
  protect,
  adminOnly,
  deleteUser
);

// Register
router.post(
  "/register",
  registerUser
);


// Verify Email OTP
router.post(
  "/verify-email",
  verifyEmailOtp
);


// Resend Verification OTP
router.post(
  "/resend-otp",
  resendOtp
);


// Login With Password
router.post(
  "/login",
  loginUser
);


// Send Login OTP
router.post(
  "/send-login-otp",
  sendLoginOtp
);


// Verify Login OTP
router.post(
  "/verify-login-otp",
  verifyLoginOtp
);

router.post(
  "/resend-otp",
  resendOtp
);
router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password",
  resetPassword
);

router.put(
  "/change-password",
  protect,
  changePassword
);
// Profile
router.get(
  "/profile",
  protect, 
  getProfile
);
router.put(
  "/profile",
  protect,
  upload.single(
    "profileImage"
  ),
  updateProfile
);
router.put(
  "/users/:id/block",
  protect,
  adminOnly,
  blockUser
);

router.put(
  "/users/:id/unblock",
  protect,
  adminOnly,
  unblockUser
);
export default router;