// axiosInstance.js
import axios from "axios";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired. Redirecting to login...", {
        position: "top-center",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2500);
    }
    return Promise.reject(error);
  }
);

export default instance;
