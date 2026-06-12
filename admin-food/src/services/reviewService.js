import API from "../api/axios";

export const createReview =
  (formData) =>
    API.post(
      "/reviews",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );