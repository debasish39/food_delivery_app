import bcrypt from "bcryptjs";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import generateToken from "../utils/generateToken.js";
import cloudinary from "../config/cloudinary.js";

export const registerUser = async (req, res) => {
  try {
    const { fullname, email, password, phone, role } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      fullname,
      email,
      phone,
      password: hashedPassword,
      role,
      emailOtp: otp,
      otpExpire: Date.now() + 10 * 60 * 1000,
    });
    await sendEmail(
      email,
      "Verify Your Email",
      `

  <div style="margin:0;padding:40px 20px;background:#f5f7fb;font-family:Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">


  <div style="background:linear-gradient(135deg,#ff6b35,#ff8c42);padding:35px;text-align:center;">
    <h1 style="margin:0;color:#ffffff;font-size:28px;">
      🍔 Food Delivery
    </h1>
  </div>

  <div style="padding:40px 30px;text-align:center;">

    <h2 style="color:#333;margin-bottom:15px;">
      Email Verification
    </h2>

    <p style="color:#666;font-size:16px;line-height:1.6;">
      Welcome! Please verify your email address using the OTP below.
    </p>

    <div style="
      margin:30px auto;
      display:inline-block;
      background:#fff7f3;
      border:2px dashed #ff6b35;
      padding:18px 40px;
      border-radius:12px;
    ">
      <span style="
        font-size:34px;
        font-weight:bold;
        letter-spacing:8px;
        color:#ff6b35;
      ">
        ${otp}
      </span>
    </div>

    <p style="color:#666;font-size:15px;">
      This OTP is valid for <strong>10 minutes</strong>.
    </p>

    <p style="color:#999;font-size:14px;margin-top:25px;">
      If you didn't request this verification, please ignore this email.
    </p>

  </div>

  <div style="
    background:#fafafa;
    padding:20px;
    text-align:center;
    border-top:1px solid #eeeeee;
  ">
    <p style="margin:0;color:#999;font-size:13px;">
      © 2026 Food Delivery App. All Rights Reserved.
    </p>
  </div>

</div>


  </div>
  `,
    );

    res.status(201).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    console.log(error);
  }
};

export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.emailOtp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (!user.otpExpire || user.otpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }

    user.isVerified = true;

    user.emailOtp = null;
    user.otpExpire = null;

    await user.save();

    res.json({
      success: true,
      message: "Email Verified Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
export const sendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.emailOtp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail(
      email,
      "Your Login Verification Code",
      `

  <div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 20px;">


      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
        
        <tr>
          <td style="background:linear-gradient(135deg,#ff6b35,#ff8c42);padding:30px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:28px;">
              🔐 Verify Your Login
            </h1>
          </td>
        </tr>

        <tr>
          <td style="padding:40px 30px;text-align:center;">
            
            <h2 style="color:#333333;margin-bottom:10px;">
              One-Time Password (OTP)
            </h2>

            <p style="color:#666666;font-size:16px;line-height:1.6;margin-bottom:30px;">
              Use the verification code below to securely access your account.
            </p>

            <div style="display:inline-block;background:#f8fafc;border:2px dashed #ff6b35;border-radius:12px;padding:18px 35px;">
              <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#ff6b35;">
                ${otp}
              </span>
            </div>

            <p style="margin-top:30px;color:#777777;font-size:14px;">
              This OTP will expire in <strong>10 minutes</strong>.
            </p>

            <p style="color:#777777;font-size:14px;">
              If you did not request this code, please ignore this email.
            </p>

          </td>
        </tr>

        <tr>
          <td style="background:#f8fafc;padding:20px;text-align:center;">
            <p style="margin:0;color:#999999;font-size:13px;">
              © 2026 Your Company. All rights reserved.
            </p>
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>


  </div>
  `,
    );

    res.json({
      success: true,
      message: "OTP Sent",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
    });
if (user.isBlocked) {
  return res.status(403).json({
    success: false,
    message:
      "Your account has been blocked by admin",
  });
}
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.emailOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (!user.otpExpire || user.otpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }

    user.emailOtp = null;
    user.otpExpire = null;

    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });
    if (user.isBlocked) {
  return res.status(403).json({
    success: false,
    message:
      "Your account has been blocked by admin",
  });
}
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.emailOtp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail(
      email,
      "Verify Your Email Address",
      `

  <div style="background:#f4f7fb;padding:40px 20px;font-family:Arial,sans-serif;">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">


  <div style="background:linear-gradient(135deg,#2563eb,#3b82f6);padding:30px;text-align:center;">
    <h1 style="color:#ffffff;margin:0;">
      Email Verification
    </h1>
  </div>

  <div style="padding:40px 30px;text-align:center;">

    <h2 style="color:#333;margin-bottom:15px;">
      Welcome!
    </h2>

    <p style="color:#666;font-size:16px;line-height:1.6;">
      Thank you for signing up. Please use the verification code below to confirm your email address.
    </p>

    <div style="margin:30px 0;">
      <span style="
        display:inline-block;
        padding:18px 36px;
        background:#eff6ff;
        border:2px dashed #2563eb;
        border-radius:12px;
        font-size:32px;
        font-weight:bold;
        letter-spacing:8px;
        color:#2563eb;
      ">
        ${otp}
      </span>
    </div>

    <p style="color:#666;font-size:14px;">
      This OTP is valid for <strong>10 minutes</strong>.
    </p>

    <p style="color:#666;font-size:14px;">
      If you didn't create an account, you can safely ignore this email.
    </p>

  </div>

  <div style="background:#f8fafc;padding:20px;text-align:center;">
    <p style="margin:0;color:#999;font-size:13px;">
      © 2026 Your Website. All rights reserved.
    </p>
  </div>

</div>


  </div>
  `,
    );

    res.json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateProfile =
  async (req, res) => {
    try {

      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const {
        fullname,
        email,
        phone,
      } = req.body;

      if (fullname) {
        user.fullname =
          fullname;
      }

      if (email) {

        const emailExists =
          await User.findOne({
            email,
            _id: {
              $ne: user._id,
            },
          });

        if (emailExists) {
          return res.status(400).json({
            success: false,
            message:
              "Email already exists",
          });
        }

        user.email = email;
      }

      if (phone) {
        user.phone = phone;
      }

      if (req.file) {
        user.profileImage =
          req.file.path;
      }

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "Profile updated successfully",
        user: {
          _id: user._id,
          fullname:
            user.fullname,
          email:
            user.email,
          phone:
            user.phone,
          role:
            user.role,
          profileImage:
            user.profileImage,
        },
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

export const changePassword =
  async (req, res) => {
    try {

      const {
        currentPassword,
        newPassword,
      } = req.body;

      const user =
        await User.findById(
          req.user._id
        );

      const isMatch =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message:
            "Current password is incorrect",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      user.password =
        hashedPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "Password changed successfully",
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

export const forgotPassword =
  async (req, res) => {

    try {

      const { email } =
        req.body;

      const user =
        await User.findOne({
          email,
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      const otp =
        Math.floor(
          100000 +
          Math.random() *
            900000
        ).toString();

      user.emailOtp =
        otp;

      user.otpExpire =
        Date.now() +
        10 * 60 * 1000;

      await user.save();

      await sendEmail(
        email,
        "Reset Password OTP",
        `
        <h2>Password Reset</h2>

        <p>Your OTP is:</p>

        <h1>${otp}</h1>

        <p>Valid for 10 minutes.</p>
        `
      );

      res.status(200).json({
        success: true,
        message:
          "Reset OTP sent",
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };
  export const resetPassword =
  async (req, res) => {

    try {

      const {
        email,
        otp,
        newPassword,
      } = req.body;

      const user =
        await User.findOne({
          email,
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      if (
        user.emailOtp !== otp
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid OTP",
        });
      }

      if (
        !user.otpExpire ||
        user.otpExpire <
          Date.now()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "OTP Expired",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      user.password =
        hashedPassword;

      user.emailOtp =
        null;

      user.otpExpire =
        null;

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "Password reset successfully",
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// Get All Users
export const getAllUsers = async (
  req,
  res
) => {
  try {

    const users =
      await User.find()
        .select("-password")
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Get Single User
export const getSingleUser = async (
  req,
  res
) => {
  try {

    const user =
      await User.findById(
        req.params.id
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Update Role
export const updateUserRole =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      user.role =
        req.body.role;

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "Role Updated",
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };

// Verify User
export const verifyUser =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      user.isVerified = true;

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "User Verified",
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };

// Delete User
export const deleteUser =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      await user.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "User Deleted",
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };

export const blockUser =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      user.isBlocked = true;

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "User blocked successfully",
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };

export const unblockUser =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      user.isBlocked = false;

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "User unblocked successfully",
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };