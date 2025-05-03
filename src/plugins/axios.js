import axios from "axios";

const axiosIns = axios.create({
  // baseURL: "http://localhost:8000/api",
  baseURL: "https://mas-pos.appmedia.id/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosIns.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosIns;
