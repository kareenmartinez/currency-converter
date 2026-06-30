import axios from "axios";

import { env } from "./env";

export const httpClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 10_000,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";

    return Promise.reject(new Error(message));
  }
);
