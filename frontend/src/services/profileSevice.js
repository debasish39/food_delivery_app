import API from "../api/axios";

// Get Profile
export const getProfile = () =>
  API.get("/auth/profile");

// Update Profile + Image
export const updateProfile = (
  formData
) =>
  API.put(
    "/auth/profile",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );