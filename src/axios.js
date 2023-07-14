import axios from "axios";

//const baseURL = "http://127.0.0.1:8080/api/";
const baseURL = "http://45.4.172.7:8081/chess-0.0.1-SNAPSHOT/api/";

const axiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  "Access-Control-Allow-Origin": "*",
});

axiosInstance.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("token");
    if (token) {
      request.headers['Authorization'] = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    Promise.reject(error);
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (!data?.token) return response;
    localStorage.setItem("token", data.token);
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${data.token}`;
    return response;
  },
  (error) => {
    if (error.response && error.response.data) {
      alert(error.response.data.message); 
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
