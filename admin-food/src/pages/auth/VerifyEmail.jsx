import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
verifyEmailOtp,
resendOtp,
} from "../../services/authService";

export default function VerifyEmail() {

const navigate = useNavigate();

const location = useLocation();

const [email, setEmail] =
useState(
location.state?.email || ""
);

const [otp, setOtp] =
useState("");

const [loading, setLoading] =
useState(false);

const [resendLoading,
setResendLoading] =
useState(false);

const handleVerify =
async (e) => {


  e.preventDefault();

  if (!email) {
    return toast.error(
      "Email is required"
    );
  }

  if (!otp) {
    return toast.error(
      "OTP is required"
    );
  }

  try {

    setLoading(true);

    const { data } =
      await verifyEmailOtp({
        email,
        otp,
      });

    toast.success(
      data.message
    );

    navigate("/login");

  } catch (error) {

    toast.error(
      error.response?.data
        ?.message ||
        "Verification failed"
    );

  } finally {

    setLoading(false);
  }
};


const handleResendOtp =
async () => {


  if (!email) {
    return toast.error(
      "Please enter email"
    );
  }

  try {

    setResendLoading(true);

    const { data } =
      await resendOtp({
        email,
      });

    toast.success(
      data.message
    );

  } catch (error) {

    toast.error(
      error.response?.data
        ?.message ||
        "Failed to resend OTP"
    );

  } finally {

    setResendLoading(false);
  }
};


return ( <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">


  <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">

    <div className="text-center mb-6">

      <h1 className="text-3xl font-bold">
        Verify Email
      </h1>

      <p className="text-gray-500 mt-2">
        Enter the OTP sent to
        your email
      </p>

    </div>

    <form
      onSubmit={handleVerify}
      className="space-y-4"
    >

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
          placeholder="Enter email"
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
        />

      </div>

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
          placeholder="Enter 6 digit OTP"
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
        />

      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
      >
        {loading
          ? "Verifying..."
          : "Verify Email"}
      </button>

    </form>

    <button
      onClick={
        handleResendOtp
      }
      disabled={
        resendLoading
      }
      className="w-full mt-4 border border-orange-500 text-orange-500 py-3 rounded-lg font-semibold hover:bg-orange-50 transition"
    >
      {resendLoading
        ? "Sending..."
        : "Resend OTP"}
    </button>

    <div className="text-center mt-6">

      <p className="text-gray-600">
        Already verified?

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
