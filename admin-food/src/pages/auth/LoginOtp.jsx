import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
sendLoginOtp,
verifyLoginOtp,
} from "../../services/authService";

export default function LoginOtp() {

const navigate = useNavigate();

const [email, setEmail] =
useState("");

const [otp, setOtp] =
useState("");

const [otpSent, setOtpSent] =
useState(false);

const [loading, setLoading] =
useState(false);

const handleSendOtp =
async () => {


  if (!email) {
    return toast.error(
      "Please enter email"
    );
  }

  try {

    setLoading(true);

    const { data } =
      await sendLoginOtp({
        email,
      });

    toast.success(
      data.message
    );

    setOtpSent(true);

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


const handleVerifyOtp =
async (e) => {


  e.preventDefault();

  if (!otp) {
    return toast.error(
      "Please enter OTP"
    );
  }

  try {

    setLoading(true);

    const { data } =
      await verifyLoginOtp({
        email,
        otp,
      });

    localStorage.setItem(
      "token",
      data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(
        data.user
      )
    );

    toast.success(
      "Login Successful"
    );

    window.location.href = "/";

  } catch (error) {

    toast.error(
      error.response?.data
        ?.message ||
        "OTP Verification Failed"
    );

  } finally {

    setLoading(false);
  }
};


return ( <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">


  <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">

    <div className="text-center mb-6">

      <h1 className="text-3xl font-bold">
        Login With OTP
      </h1>

      <p className="text-gray-500 mt-2">
        Login using email OTP
      </p>

    </div>

    <div className="space-y-4">

      <div>

        <label className="block text-sm font-medium mb-1">
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          placeholder="Enter your email"
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
        />

      </div>

      {!otpSent ? (

        <button
          onClick={
            handleSendOtp
          }
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
        >
          {loading
            ? "Sending OTP..."
            : "Send OTP"}
        </button>

      ) : (

        <form
          onSubmit={
            handleVerifyOtp
          }
          className="space-y-4"
        >

          <div>

            <label className="block text-sm font-medium mb-1">
              OTP
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                )
              }
              placeholder="Enter OTP"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>

          <button
            type="button"
            onClick={
              handleSendOtp
            }
            className="w-full border border-orange-500 text-orange-500 py-3 rounded-lg font-semibold hover:bg-orange-50"
          >
            Resend OTP
          </button>

        </form>

      )}

    </div>

    <div className="text-center mt-6">

      <p className="text-gray-600">

        Prefer password login?

        <Link
          to="/login"
          className="text-orange-500 font-semibold ml-2"
        >
          Login
        </Link>

      </p>

    </div>

  </div>

</div>


);
}
