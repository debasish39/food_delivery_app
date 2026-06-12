import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { loginUser } from "../../services/authService";

export default function Login() {

const navigate = useNavigate();

const [formData, setFormData] =
useState({
email: "",
password: "",
});

const [loading, setLoading] =
useState(false);

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]:
e.target.value,
});
};

const handleSubmit =
async (e) => {


  e.preventDefault();

  if (
    !formData.email ||
    !formData.password
  ) {
    return toast.error(
      "Please fill all fields"
    );
  }

  try {

    setLoading(true);

    const { data } =
      await loginUser({
        email:
          formData.email,
        password:
          formData.password,
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
        "Login Failed"
    );

  } finally {

    setLoading(false);
  }
};


return ( <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">


  <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">

    <div className="text-center mb-6">

      <h1 className="text-3xl font-bold">
        Welcome Back
      </h1>

      <p className="text-gray-500 mt-2">
        Login to your account
      </p>

    </div>

    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      <div>

        <label className="block text-sm font-medium mb-1">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={
            formData.email
          }
          onChange={
            handleChange
          }
          placeholder="Enter email"
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
        />

      </div>

      <div>

        <label className="block text-sm font-medium mb-1">
          Password
        </label>

        <input
          type="password"
          name="password"
          value={
            formData.password
          }
          onChange={
            handleChange
          }
          placeholder="Enter password"
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
        />

      </div>

      <div className="flex justify-between items-center">

        <label className="flex items-center gap-2 text-sm">

          <input
            type="checkbox"
          />

          Remember Me

        </label>

        <Link
          to="/forgot-password"
          className="text-orange-500 text-sm font-medium"
        >
          Forgot Password?
        </Link>

      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
      >
        {loading
          ? "Logging In..."
          : "Login"}
      </button>

    </form>

    <div className="mt-4">

      <Link
        to="/login-otp"
        className="block text-center border border-orange-500 text-orange-500 py-3 rounded-lg font-semibold hover:bg-orange-50 transition"
      >
        Login With OTP
      </Link>

    </div>

    <div className="text-center mt-6">

      <p className="text-gray-600">

        Don't have an account?

        <Link
          to="/register"
          className="text-orange-500 font-semibold ml-2"
        >
          Register
        </Link>

      </p>

    </div>

  </div>
</div>


);
}
