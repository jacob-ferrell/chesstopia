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

  export default axiosInstance;