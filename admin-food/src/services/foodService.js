import API from "../api/axios";

export const getFoods = () =>
  API.get("/foods");

export const getFood = (
  id
) =>
  API.get(
    `/foods/${id}`
  );

export const searchFoods = (
  keyword
) =>
  API.get(
    `/foods/search?keyword=${keyword}`
  );

export const getFoodsByCategory =
  (categoryId) =>
    API.get(
      `/foods/category/${categoryId}`
    );
export const getSingleFood=(id)=>API.get(`/foods/${id}`);
export const createFood =
  (formData) =>
    API.post(
      "/foods",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

export const updateFood =
  (id, formData) =>
    API.put(
      `/foods/${id}`,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );
export const deleteFood =
  (id) =>
    API.delete(
      `/foods/${id}`
    );