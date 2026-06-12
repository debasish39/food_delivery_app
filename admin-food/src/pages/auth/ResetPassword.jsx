import { useState } from "react";

import toast from "react-hot-toast";

import {
  useNavigate,
} from "react-router-dom";

import {
  resetPassword,
} from "../../services/authService";

export default function ResetPassword() {

  const [otp, setOtp] =
    useState("");

  const [newPassword,
    setNewPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading,
    setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  const email =
    localStorage.getItem(
      "resetEmail"
    );

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (
        newPassword !==
        confirmPassword
      ) {
        return toast.error(
          "Passwords do not match"
        );
      }

      try {

        setLoading(true);

        const { data } =
          await resetPassword({
            email,
            otp,
            newPassword,
          });

        toast.success(
          data.message
        );

        localStorage.removeItem(
          "resetEmail"
        );

        navigate(
          "/login"
        );

      } catch (error) {

        toast.error(
          error.response?.data
            ?.message ||
            "Reset Failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Reset Password
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-4"
        >

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value
              )
            }
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="New Password"
            value={
              newPassword
            }
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={
              confirmPassword
            }
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className="w-full border p-3 rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg"
          >
            {loading
              ? "Updating..."
              : "Reset Password"}
          </button>

        </form>

      </div>

    </div>
  );
}