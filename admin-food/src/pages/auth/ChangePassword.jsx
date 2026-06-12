import { useState } from "react";

import toast from "react-hot-toast";

import {
  changePassword,
} from "../../services/authService";

export default function ChangePassword() {

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
      ) {
        return toast.error(
          "All fields are required"
        );
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        return toast.error(
          "Passwords do not match"
        );
      }

      if (
        newPassword.length < 6
      ) {
        return toast.error(
          "Password must be at least 6 characters"
        );
      }

      try {

        setLoading(true);

        const { data } =
          await changePassword({
            currentPassword,
            newPassword,
          });

        toast.success(
          data.message
        );

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

      } catch (error) {

        toast.error(
          error.response?.data
            ?.message ||
            "Failed to change password"
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Change Password
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-4"
        >

          <div>

            <label className="block mb-1 font-medium">
              Current Password
            </label>

            <input
              type="password"
              value={
                currentPassword
              }
              onChange={(e) =>
                setCurrentPassword(
                  e.target.value
                )
              }
              className="w-full border p-3 rounded-lg"
              placeholder="Enter current password"
            />

          </div>

          <div>

            <label className="block mb-1 font-medium">
              New Password
            </label>

            <input
              type="password"
              value={
                newPassword
              }
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
              className="w-full border p-3 rounded-lg"
              placeholder="Enter new password"
            />

          </div>

          <div>

            <label className="block mb-1 font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              value={
                confirmPassword
              }
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="w-full border p-3 rounded-lg"
              placeholder="Confirm new password"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
          >
            {loading
              ? "Updating..."
              : "Change Password"}
          </button>

        </form>

      </div>

    </div>
  );
}