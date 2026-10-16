import axios, { AxiosInstance } from "axios";
import hasValidToken from "./util/hasValidToken";

// An empty VITE_SERVER means "same origin": the Vite dev server proxies /api.
const baseURL = `${import.meta.env.VITE_SERVER ?? ""}/api`;

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  "Access-Control-Allow-Origin": "*",
} as Parameters<typeof axios.create>[0]);

axiosInstance.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("token");
    if (token && hasValidToken()) {
      request.headers["Authorization"] = `Bearer ${token}`;
    } else if (token) {
      // An expired or malformed token is worse than none: the backend rejects
      // any request carrying it, even public ones like /auth/register.
      localStorage.removeItem("token");
    }
    return request;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (!data?.token || data.headerName) return response;
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
