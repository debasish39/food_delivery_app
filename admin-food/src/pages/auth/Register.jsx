import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../../services/authService";

export default function Register() {
const navigate = useNavigate();

const [formData, setFormData] = useState({
  fullname: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: "admin",
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

const handleSubmit = async (
e
) => {
e.preventDefault();


if (
  !formData.fullname ||
  !formData.email ||
  !formData.phone ||
  !formData.password ||
  !formData.confirmPassword ||
  !formData.role
) {
  return toast.error(
    "All fields are required"
  );
}

if (
  formData.password !==
  formData.confirmPassword
) {
  return toast.error(
    "Passwords do not match"
  );
}

if (
  formData.password.length < 6
) {
  return toast.error(
    "Password must be at least 6 characters"
  );
}

try {
  setLoading(true);

  const { data } = await registerUser({
  fullname: formData.fullname,
  email: formData.email,
  phone: formData.phone,
  password: formData.password,
  role: formData.role,
});

  toast.success(
    data.message
  );

  navigate(
    "/verify-email",
    {
      state: {
        email:
          formData.email,
      },
    }
  );
} catch (error) {
  toast.error(
    error.response?.data
      ?.message ||
      "Registration failed"
  );
} finally {
  setLoading(false);
}


};

return ( <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">


  <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">

    <div className="text-center mb-6">
      <h1 className="text-3xl font-bold">
        Create Account
      </h1>

      <p className="text-gray-500 mt-2">
        Register to order your
        favorite food
      </p>
    </div>

    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-4"
    >

      <div>
        <label className="block text-sm font-medium mb-1">
          Full Name
        </label>

        <input
          type="text"
          name="fullname"
          value={
            formData.fullname
          }
          onChange={
            handleChange
          }
          placeholder="Enter full name"
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

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
          Phone Number
        </label>

        <input
          type="text"
          name="phone"
          value={
            formData.phone
          }
          onChange={
            handleChange
          }
          placeholder="Enter phone number"
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
<div>
  <label className="block text-sm font-medium mb-1">
    Role
  </label>

  <input
    type="text"
    name="role"
    value={formData.role}
    readOnly
    className="w-full border rounded-lg px-4 py-3 bg-gray-100 cursor-not-allowed"
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

      <div>
        <label className="block text-sm font-medium mb-1">
          Confirm Password
        </label>

        <input
          type="password"
          name="confirmPassword"
          value={
            formData.confirmPassword
          }
          onChange={
            handleChange
          }
          placeholder="Confirm password"
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
      >
        {loading
          ? "Creating Account..."
          : "Register"}
      </button>
    </form>

    <div className="text-center mt-6">

      <p className="text-gray-600">
        Already have an
        account?

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
