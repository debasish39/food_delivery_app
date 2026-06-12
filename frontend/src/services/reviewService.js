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
    export const likeReview = (
  foodId,
  reviewId
) =>
  API.put(
    `/reviews/${foodId}/review/${reviewId}/like`
  );

export const dislikeReview = (
  foodId,
  reviewId
) =>
  API.put(
    `/reviews/${foodId}/review/${reviewId}/dislike`
  );