import axios from "axios";

const axiosAuthInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
});

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVICE_URL,
  withCredentials: true,
});

export { axiosAuthInstance as axiosAuth, axiosInstance as axios };
