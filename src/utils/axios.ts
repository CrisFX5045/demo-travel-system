import axios, { AxiosError, AxiosResponse } from "axios";
import { JWT_HOST_API } from "@/configs/auth";

const axiosInstance = axios.create({
  baseURL: JWT_HOST_API,
  timeout: Number(import.meta.env.VITE_TICA_TOUR_API_TIMEOUT_MS ?? 15000),
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) =>
    Promise.reject(error.response?.data || "Something went wrong")
);

export default axiosInstance;
