import axios from "axios";

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true,
});

// --- RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
  (response) => {
    // If the request is successful, just return the response
    return response;
  },
  (error) => {
    // Check if the error is a 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or unauthorized. Logging out...");

      // Only run this on the client side
      if (typeof window !== "undefined") {
        // Clear any local user data you might have
        localStorage.removeItem("shopease_user");
        
        // Optional: Redirect to login page
        // window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
