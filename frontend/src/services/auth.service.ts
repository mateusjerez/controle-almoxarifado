import axios from "axios";

 const API_URL = "http://localhost:8080/api/auth/";
//const API_URL = "http://pascom.suzarte.com.br:12782/api/auth/";

export const register = (username: string, password: string, roles: Array<String>) => {
  return axios.post(API_URL + "signup", {
    username,
    password,
    roles,
  });
};

export const login = (username: string, password: string) => {
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);

  return null;
};
