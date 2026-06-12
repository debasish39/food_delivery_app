import { useState } from "react";

import toast from "react-hot-toast";

import {
  useNavigate,
} from "react-router-dom";

import {
  forgotPassword,
} from "../../services/authService";

export default function ForgotPassword() {

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const { data } =
          await forgotPassword({
            email,
          });

        toast.success(
          data.message
        );

        localStorage.setItem(
          "resetEmail",
          email
        );

        navigate(
          "/reset-password"
        );

      } catch (error) {

        toast.error(
          error.response?.data
            ?.message ||
            "Failed to send OTP"
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Forgot Password
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-4"
        >

          <div>

            <label className="block mb-1">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full border p-3 rounded-lg"
              placeholder="Enter your email"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg"
          >
            {loading
              ? "Sending..."
              : "Send OTP"}
          </button>

        </form>

      </div>

    </div>
  );
}