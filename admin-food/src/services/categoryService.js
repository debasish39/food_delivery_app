import API from "../api/axios";

// Get All Categories
export const getCategories =
  () =>
    API.get(
      "/categories"
    );

// Get Single Category
export const getCategory =
  (id) =>
    API.get(
      `/categories/${id}`
    );

// Create Category
export const createCategory =
  (formData) =>
    API.post(
      "/categories",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

export const updateCategory =
  (id, formData) =>
    API.put(
      `/categories/${id}`,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );
// Delete Category
export const deleteCategory =
  (id) =>
    API.delete(
      `/categories/${id}`
    );
// Get Foods By Category
// Get Foods By Category
export const getFoodsByCategory = (categoryId) =>
  API.get(`/foods/category/${categoryId}`);