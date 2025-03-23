import axios from "axios";

// Base URL for API requests
const API_URL = "http://localhost:5000";

class ApiService {
  constructor() {
    this.baseUrl = API_URL;

    // Create axios instance with defaults
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add a request interceptor to include auth token
    this.api.interceptors.request.use(
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

    // Add a response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        console.error("API Error:", error.response?.data || error.message);

        // Handle 401 Unauthorized globally
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          // Only redirect if we're in a browser environment
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }

        return Promise.reject(error.response?.data || error);
      }
    );
  }

  // ===========================================================================
  // LAPTOP METHODS
  // ===========================================================================

  getLaptops(params = {}) {
    console.log("Getting laptops with params:", params);
    return this.api.get("/api/laptops", { params }).catch((error) => {
      console.error("Error fetching laptops:", error);
      throw error;
    });
  }

  getLaptopById(id) {
    if (!id) {
      console.error("Invalid laptop ID: ID is empty or undefined");
      return Promise.reject({ message: "Invalid laptop ID provided" });
    }

    // Log the request for debugging
    console.log(`Fetching laptop with ID: ${id}`);

    return this.api
      .get(`/api/laptops/${id}`)
      .then((data) => {
        // If we get a valid response but it's empty or missing key fields
        if (!data || !data.name) {
          console.error("Invalid laptop data received:", data);
          throw new Error("Invalid laptop data received from server");
        }

        // Log successful response
        console.log(`Successfully fetched laptop: ${data.name}`);
        return data;
      })
      .catch((error) => {
        // Enhanced error logging
        if (error.response) {
          console.error(
            `Server responded with status ${error.response.status}`
          );
          console.error("Response data:", error.response.data);
        } else if (error.request) {
          console.error("No response received from server:", error.request);
        } else {
          console.error(`Error setting up request: ${error.message}`);
        }

        // Provide a more detailed error message if possible
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          `Error fetching laptop ${id}`;

        throw {
          message: errorMessage,
          originalError: error,
        };
      });
  }

  getLaptopBySlug(slug) {
    return this.api.get(`/api/laptops/slug/${slug}`).catch((error) => {
      console.error(`Error fetching laptop by slug ${slug}:`, error);
      throw error;
    });
  }

  createLaptop(data) {
    // Handle stock and availability
    if (data.stock !== undefined) {
      data.stock = Number(data.stock);
      data.isAvailable = data.stock > 0;
    } else {
      data.stock = 10;
      data.isAvailable = true;
    }

    // Ensure price is valid
    if (data.price) {
      data.price = Number(data.price);
    }

    return this.api.post("/api/laptops", data).catch((error) => {
      console.error("Error creating laptop:", error);
      throw error;
    });
  }

  updateLaptop(id, data) {
    // Handle stock and availability
    if (data.stock !== undefined) {
      data.stock = Number(data.stock);
      data.isAvailable = data.stock > 0;
    }

    return this.api.put(`/api/laptops/${id}`, data).catch((error) => {
      console.error(`Error updating laptop ${id}:`, error);
      throw error;
    });
  }

  deleteLaptop(id) {
    return this.api.delete(`/api/laptops/${id}`).catch((error) => {
      console.error(`Error deleting laptop ${id}:`, error);
      throw error;
    });
  }

  getFeaturedLaptops(limit = 8) {
    return this.api
      .get("/api/laptops/featured", { params: { limit } })
      .catch((error) => {
        console.error("Error fetching featured laptops:", error);
        throw error;
      });
  }

  getTopRatedLaptops(limit = 5) {
    return this.api
      .get("/api/laptops/top-rated", { params: { limit } })
      .catch((error) => {
        console.error("Error fetching top rated laptops:", error);
        throw error;
      });
  }

  // ===========================================================================
  // CATEGORY METHODS
  // ===========================================================================

  getCategories() {
    return this.api.get("/api/categories").catch((error) => {
      console.error("Error fetching categories:", error);
      throw error;
    });
  }

  getCategoryById(id) {
    return this.api.get(`/api/categories/${id}`).catch((error) => {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    });
  }

  createCategory(data) {
    return this.api.post("/api/categories", data).catch((error) => {
      console.error("Error creating category:", error);
      throw error;
    });
  }

  updateCategory(id, data) {
    return this.api.put(`/api/categories/${id}`, data).catch((error) => {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    });
  }

  deleteCategory(id) {
    return this.api.delete(`/api/categories/${id}`).catch((error) => {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    });
  }

  // ===========================================================================
  // AUTH METHODS
  // ===========================================================================

  login(email, password) {
    return this.api
      .post("/api/auth/login", { email, password })
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        return data;
      })
      .catch((error) => {
        console.error("Login error:", error);
        throw error;
      });
  }

  register(userData) {
    return this.api.post("/api/auth/register", userData).catch((error) => {
      console.error("Register error:", error);
      throw error;
    });
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return Promise.resolve();
  }

  getProfile() {
    return this.api.get("/api/auth/profile").catch((error) => {
      console.error("Error fetching profile:", error);
      throw error;
    });
  }

  // ===========================================================================
  // MULTIPART FORM DATA METHODS (FILE UPLOADS)
  // ===========================================================================

  // Renamed from uploadLaptopWithImages to createLaptopWithImages to match function call in LaptopForm.jsx
  createLaptopWithImages(data, images) {
    const formData = new FormData();

    // Append all regular data fields
    Object.keys(data).forEach((key) => {
      if (key === "features" && Array.isArray(data[key])) {
        data[key].forEach((feature) => {
          if (feature.trim() !== "") {
            formData.append("features", feature);
          }
        });
      } else {
        formData.append(key, data[key]);
      }
    });

    // Append all image files
    if (images && images.length) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    return this.api
      .post("/api/laptops", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((error) => {
        console.error("Error creating laptop with images:", error);
        throw error;
      });
  }

  updateLaptopWithImages(id, data, images, existingImages = []) {
    const formData = new FormData();

    // Append all regular data fields
    Object.keys(data).forEach((key) => {
      if (key === "features" && Array.isArray(data[key])) {
        data[key].forEach((feature) => {
          if (feature.trim() !== "") {
            formData.append("features", feature);
          }
        });
      } else if (key !== "images") {
        // Skip images as we'll handle them separately
        formData.append(key, data[key]);
      }
    });

    // Append existing images to keep
    existingImages.forEach((image) => {
      formData.append("existingImages", image);
    });

    // Append new image files
    if (images && images.length) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    return this.api
      .put(`/api/laptops/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((error) => {
        console.error(`Error updating laptop ${id} with images:`, error);
        throw error;
      });
  }

  // ===========================================================================
  // ORDER METHODS
  // ===========================================================================

  getUserOrders() {
    return this.api.get("/api/orders").catch((error) => {
      console.error("Error fetching user orders:", error);
      throw error;
    });
  }

  getOrderById(id) {
    if (!id) {
      console.error("Invalid order ID: ID is empty or undefined");
      return Promise.reject({ message: "Invalid order ID provided" });
    }

    return this.api
      .get(`/api/orders/${id}`)
      .then((data) => {
        if (!data) {
          console.error("Invalid order data received:", data);
          throw new Error("Invalid order data received from server");
        }
        return data;
      })
      .catch((error) => {
        console.error(`Error fetching order ${id}:`, error);
        throw error;
      });
  }

  createOrder(orderData) {
    return this.api.post("/api/orders", orderData).catch((error) => {
      console.error("Error creating order:", error);
      throw error;
    });
  }

  updateOrderToPaid(id, paymentResult) {
    return this.api
      .put(`/api/orders/${id}/pay`, paymentResult)
      .catch((error) => {
        console.error(`Error updating order ${id} to paid:`, error);
        throw error;
      });
  }

  cancelOrder(id) {
    return this.api.put(`/api/orders/${id}/cancel`).catch((error) => {
      console.error(`Error cancelling order ${id}:`, error);
      throw error;
    });
  }

  // ===========================================================================
  // ADMIN METHODS
  // ===========================================================================

  getAdminOrders(params = {}) {
    return this.api.get("/api/orders/admin", { params }).catch((error) => {
      console.error("Error fetching admin orders:", error);
      throw error;
    });
  }

  updateOrderStatus(id, statusData) {
    return this.api
      .put(`/api/orders/${id}/status`, statusData)
      .catch((error) => {
        console.error(`Error updating order ${id} status:`, error);
        throw error;
      });
  }

  updateShippingDetails(id, shippingData) {
    return this.api
      .put(`/api/orders/${id}/shipping`, shippingData)
      .catch((error) => {
        console.error(
          `Error updating shipping details for order ${id}:`,
          error
        );
        throw error;
      });
  }

  deleteOrder(id) {
    return this.api.delete(`/api/orders/${id}`).catch((error) => {
      console.error(`Error deleting order ${id}:`, error);
      throw error;
    });
  }

  getOrderCount() {
    return this.api.get("/api/orders/count").catch((error) => {
      console.error("Error fetching order count:", error);
      throw error;
    });
  }

  getTotalSales() {
    return this.api.get("/api/orders/total-sales").catch((error) => {
      console.error("Error fetching total sales:", error);
      throw error;
    });
  }

  getDashboardStats() {
    return this.api.get("/api/dashboard/stats").catch((error) => {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
