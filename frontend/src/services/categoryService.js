import API from "../api/axios";

export const getCategories =
  () =>
    API.get(
      "/categories"
    );

export const getCategory =
  (id) =>
    API.get(
      `/categories/${id}`
    );