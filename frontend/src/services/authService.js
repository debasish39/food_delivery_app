import API from "../api/axios";

export const registerUser = (
  data
) =>
  API.post(
    "/auth/register",
    data
  );

export const verifyEmailOtp =
  (data) =>
    API.post(
      "/auth/verify-email",
      data
    );
    export const resendOtp = (data) =>
  API.post(
    "/auth/resend-otp",
    data
  );
// Login with password
export const loginUser = (
  data
) =>
  API.post(
    "/auth/login",
    data
  );
// Login with OTP
export const sendLoginOtp =
  (data) =>
    API.post(
      "/auth/send-login-otp",
      data
    );

export const verifyLoginOtp =
  (data) =>
    API.post(
      "/auth/verify-login-otp",
      data
    );
export const forgotPassword =
  (data) =>
    API.post(
      "/auth/forgot-password",
      data
    );

export const resetPassword =
  (data) =>
    API.post(
      "/auth/reset-password",
      data
    );

export const changePassword =
  (data) =>
    API.put(
      "/auth/change-password",
      data
    );
export const getProfile = () =>
  API.get("/auth/profile");