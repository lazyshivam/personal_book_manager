// src/services/api.ts
import axios from "axios";

const api = axios.create({
   baseURL: "/api",
  // baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Crucial: ensures HTTP-only cookies are sent/received automatically
  headers: {
    "Content-Type": "application/json",
  },
});

// Track if a refresh is already in progress to avoid infinite loops or multiple refresh calls
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, success = true) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Response Interceptor to handle background token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If there's no config (e.g. network error with no response), just reject
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Check if error is 401 Unauthorized and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If the failed request WAS the refresh token route itself, avoid looping — just log out
      if (originalRequest.url?.includes("/user/auth/refresh-tokens")) {
        isRefreshing = false;
        processQueue(error);
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If a refresh is already happening, queue this request until it finishes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call your backend endpoint that reads the old refresh cookie and issues a new access token cookie
        await api.post("/user/auth/refresh-tokens");

        // Processing queued requests now that the token is refreshed
        isRefreshing = false;
        processQueue(null);

        // Retry the original request that failed
        return api(originalRequest);
      } catch (refreshError) {
        // If the refresh token has also expired or is invalid, kick user out to login
        isRefreshing = false;
        processQueue(refreshError);
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;