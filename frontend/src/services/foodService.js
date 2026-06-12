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