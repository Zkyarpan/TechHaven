import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import apiService from "../utils/apiService";
import {
  Search,
  ChevronDown,
  Box,
  Truck,
  Calendar,
  Check,
  X,
  RefreshCw,
  AlertCircle,
  FileText,
} from "lucide-react";

const Orders = () => {
  const { auth } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!auth.isAuthenticated) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await apiService.getUserOrders();
        setOrders(response.data || response);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load your orders. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [auth.isAuthenticated]);

  // Filter orders based on search term, status, and time
  const filteredOrders = orders.filter((order) => {
    // Search filter
    if (
      searchTerm &&
      !order.id?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !order._id?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !order.orderItems?.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) {
      return false;
    }

    // Status filter
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }

    // Time filter
    if (timeFilter !== "all") {
      const orderDate = new Date(order.createdAt || order.timestamp);
      const currentDate = new Date();

      if (timeFilter === "last30days") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);
        if (orderDate < thirtyDaysAgo) return false;
      } else if (timeFilter === "last3months") {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
        if (orderDate < threeMonthsAgo) return false;
      } else if (timeFilter === "last6months") {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
        if (orderDate < sixMonthsAgo) return false;
      }
    }

    return true;
  });

  const toggleOrderExpand = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <Check className="h-5 w-5 text-green-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "processing":
        return <RefreshCw className="h-5 w-5 text-yellow-500" />;
      case "cancelled":
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "shipped":
        return "Shipped";
      case "processing":
        return "Processing";
      case "cancelled":
        return "Cancelled";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 mb-6 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 mb-6 rounded"></div>
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-24 bg-gray-200 mb-4 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Helper to get order ID (handles both id and _id variations)
  const getOrderId = (order) => order._id || order.id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          {/* Search Box */}
          <div className="relative max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Search orders & products"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div>
              <label htmlFor="status-filter" className="sr-only">
                Filter by status
              </label>
              <div className="relative">
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="time-filter" className="sr-only">
                Filter by time
              </label>
              <div className="relative">
                <select
                  id="time-filter"
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="appearance-none w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Time</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last3months">Last 3 Months</option>
                  <option value="last6months">Last 6 Months</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={getOrderId(order)}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              {/* Order Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="flex flex-col mb-4 md:mb-0">
                    <div className="flex items-center">
                      <span className="text-lg font-medium text-gray-900 mr-2">
                        Order #{getOrderId(order)}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        Placed on {formatDate(order.createdAt || order.date)}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Link
                      to={`/order-details/${getOrderId(order)}`}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Details
                    </Link>
                    <button
                      onClick={() => toggleOrderExpand(getOrderId(order))}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      {expandedOrderId === getOrderId(order) ? "Hide" : "Show"}{" "}
                      Items
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Content - visible when expanded */}
              {expandedOrderId === getOrderId(order) && (
                <>
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flow-root">
                      <ul
                        role="list"
                        className="-my-6 divide-y divide-gray-200"
                      >
                        {order.orderItems.map((item, idx) => (
                          <li key={idx} className="py-4 flex">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={
                                  item.image ||
                                  "https://via.placeholder.com/300x200?text=No+Image"
                                }
                                alt={item.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="ml-6 flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>
                                    <Link to={`/laptops/${item.laptop}`}>
                                      {item.name}
                                    </Link>
                                  </h3>
                                  <p className="ml-4">
                                    ${item.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex-1 flex items-end justify-between text-sm">
                                <p className="text-gray-500">
                                  Qty {item.quantity}
                                </p>
                                {order.status === "delivered" && (
                                  <div className="flex">
                                    <button
                                      type="button"
                                      className="font-medium text-green-600 hover:text-green-500"
                                    >
                                      Buy Again
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          Shipping Information
                        </h4>
                        <p className="text-gray-600">
                          {order.shippingAddress.name}
                          <br />
                          {order.shippingAddress.address}
                          <br />
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}{" "}
                          {order.shippingAddress.postalCode}
                          <br />
                          {order.shippingAddress.country}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          Payment Method
                        </h4>
                        <p className="text-gray-600">
                          {order.paymentMethod === "credit_card"
                            ? "Credit Card"
                            : order.paymentMethod === "paypal"
                            ? "PayPal"
                            : order.paymentMethod === "bank_transfer"
                            ? "Bank Transfer"
                            : order.paymentMethod === "cash_on_delivery"
                            ? "Cash on Delivery"
                            : order.paymentMethod}
                        </p>

                        <h4 className="font-medium text-gray-900 mt-4 mb-1">
                          Order Status
                        </h4>
                        <p className="flex items-center text-gray-600">
                          {getStatusIcon(order.status)}
                          <span className="ml-2">
                            {getStatusText(order.status)}
                          </span>
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          Order Summary
                        </h4>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="text-gray-900">
                              ${order.subtotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shipping:</span>
                            <span className="text-gray-900">
                              {order.shippingCost === 0
                                ? "Free"
                                : `$${order.shippingCost.toFixed(2)}`}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax:</span>
                            <span className="text-gray-900">
                              ${order.tax.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between font-medium pt-1 border-t border-gray-200">
                            <span className="text-gray-900">Total:</span>
                            <span className="text-gray-900">
                              ${order.totalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Order Footer */}
              <div className="px-6 py-3 flex items-center justify-between bg-white">
                <div className="flex items-center">
                  {order.status === "shipped" && (
                    <>
                      <Truck className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">Estimated delivery:</span>{" "}
                        {order.estimatedDelivery
                          ? formatDate(order.estimatedDelivery)
                          : "Pending"}
                        {order.trackingNumber &&
                          ` • Tracking #: ${order.trackingNumber}`}
                      </span>
                    </>
                  )}
                  {order.status === "delivered" && (
                    <>
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">Delivered on:</span>{" "}
                        {order.deliveredAt
                          ? formatDate(order.deliveredAt)
                          : "N/A"}
                        {order.notes && ` • ${order.notes}`}
                      </span>
                    </>
                  )}
                  {order.status === "cancelled" && (
                    <>
                      <X className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">Cancelled:</span>{" "}
                        {order.notes || "Order cancelled"}
                      </span>
                    </>
                  )}
                  {(order.status === "pending" ||
                    order.status === "processing") && (
                    <>
                      <RefreshCw className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">
                          {getStatusText(order.status)}:
                        </span>{" "}
                        Your order is being processed
                      </span>
                    </>
                  )}
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-900">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-10 rounded-lg shadow text-center">
          <Box className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders found
          </h3>
          {searchTerm || statusFilter !== "all" || timeFilter !== "all" ? (
            <>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setTimeFilter("all");
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Clear Filters
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders yet
              </p>
              <Link
                to="/laptops"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Browse Laptops
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
