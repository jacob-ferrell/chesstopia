import axios from "axios";

const baseURL = "http://127.0.0.1:8080/api/";

const axiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  "Access-Control-Allow-Origin": "*",
});

axiosInstance.interceptors.response.use(
  (response) => {
    const { data } = response;
    console.log(response)
    if (!data?.token) return response;
    localStorage.setItem("token", data.token);
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${data.token}`;
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
