import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiService from "../utils/apiService";
import {
  Search,
  Filter,
  Download,
  X,
  Check,
  Truck,
  Package,
  Calendar,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ExternalLink,
  FileText,
  Mail,
  Edit,
} from "lucide-react";
import { toast } from "sonner";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [bulkActionOpen, setBulkActionOpen] = useState(false);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getAdminOrders();
        setOrders(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      case "pending":
        return <AlertCircle className="h-5 w-5 text-purple-500" />;
      case "cancelled":
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(filteredOrders.map((order) => order._id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((orderId) => orderId !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const toggleOrderExpand = (id) => {
    if (expandedOrderId === id) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(id);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await apiService.updateOrderStatus(id, { status: newStatus });
      setOrders(
        orders.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const bulkUpdateStatus = async (newStatus) => {
    try {
      // Create an array of promises for each status update
      const updatePromises = selectedOrders.map((orderId) =>
        apiService.updateOrderStatus(orderId, { status: newStatus })
      );

      // Wait for all updates to complete
      await Promise.all(updatePromises);

      // Update local state
      setOrders(
        orders.map((order) =>
          selectedOrders.includes(order._id)
            ? { ...order, status: newStatus }
            : order
        )
      );

      setSelectedOrders([]);
      setBulkActionOpen(false);
      toast.success(`${selectedOrders.length} orders updated to ${newStatus}`);
    } catch (error) {
      console.error("Error with bulk update:", error);
      toast.error("Failed to update some orders");
    }
  };

  const exportOrders = () => {
    // This would be implemented to generate and download a CSV/Excel file
    toast.info("Export functionality coming soon");
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

  // Apply all filters and sorting
  const filteredOrders = orders
    .filter((order) => {
      // Search filter
      if (
        searchTerm &&
        !order._id.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(order.user?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        !(order.user?.email || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && order.status !== statusFilter) {
        return false;
      }

      // Date filter
      if (dateFilter !== "all") {
        const orderDate = new Date(order.createdAt);
        const currentDate = new Date();

        if (dateFilter === "today") {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (orderDate < today) return false;
        } else if (dateFilter === "week") {
          const weekAgo = new Date();
          weekAgo.setDate(currentDate.getDate() - 7);
          if (orderDate < weekAgo) return false;
        } else if (dateFilter === "month") {
          const monthAgo = new Date();
          monthAgo.setMonth(currentDate.getMonth() - 1);
          if (orderDate < monthAgo) return false;
        } else if (dateFilter === "quarter") {
          const quarterAgo = new Date();
          quarterAgo.setMonth(currentDate.getMonth() - 3);
          if (orderDate < quarterAgo) return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      // Sort based on selected option
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "amount-high":
          return b.totalPrice - a.totalPrice;
        case "amount-low":
          return a.totalPrice - b.totalPrice;
        case "name":
          return (a.user?.name || "").localeCompare(b.user?.name || "");
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-5"></div>
          <div className="h-12 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={exportOrders}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Orders
          </button>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
          {/* Search */}
          <div className="max-w-lg w-full">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Search orders by ID, customer name, or email..."
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters {showFilters ? "▲" : "▼"}
            </button>
            <div className="relative inline-block text-left">
              <div>
                <label htmlFor="sort-by" className="sr-only">
                  Sort by
                </label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount-high">Amount: High to Low</option>
                  <option value="amount-low">Amount: Low to High</option>
                  <option value="name">Customer Name</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-gray-200">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Status</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    statusFilter === "all"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("pending")}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    statusFilter === "pending"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setStatusFilter("processing")}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    statusFilter === "processing"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  Processing
                </button>
                <button
                  onClick={() => setStatusFilter("shipped")}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    statusFilter === "shipped"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  Shipped
                </button>
                <button
                  onClick={() => setStatusFilter("delivered")}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    statusFilter === "delivered"
                      ? "bg-green-100 text-green-700"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  Delivered
                </button>
                <button
                  onClick={() => setStatusFilter("cancelled")}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    statusFilter === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  Cancelled
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Date</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setDateFilter("all")}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    dateFilter === "all"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  All Time
                </button>
                <button
                  onClick={() => setDateFilter("today")}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    dateFilter === "today"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setDateFilter("week")}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    dateFilter === "week"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => setDateFilter("month")}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    dateFilter === "month"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  Last 30 Days
                </button>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="mt-4 flex items-center justify-between px-4 py-3 bg-orange-50 rounded-md">
            <div className="text-sm text-orange-700">
              <strong>{selectedOrders.length}</strong> orders selected
            </div>
            <div className="relative">
              <button
                onClick={() => setBulkActionOpen(!bulkActionOpen)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Bulk Actions
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
              {bulkActionOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      onClick={() => bulkUpdateStatus("processing")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Mark as Processing
                    </button>
                    <button
                      onClick={() => bulkUpdateStatus("shipped")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Mark as Shipped
                    </button>
                    <button
                      onClick={() => bulkUpdateStatus("delivered")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Mark as Delivered
                    </button>
                    <button
                      onClick={() => bulkUpdateStatus("cancelled")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Mark as Cancelled
                    </button>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={exportOrders}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Export Selected
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredOrders.length} of {orders.length} orders
          {(statusFilter !== "all" || dateFilter !== "all" || searchTerm) && (
            <span> with applied filters</span>
          )}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedOrders.length === filteredOrders.length &&
                          filteredOrders.length > 0
                        }
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Payment
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr
                      className={`${
                        expandedOrderId === order._id
                          ? "bg-gray-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order._id)}
                            onChange={() => handleSelectOrder(order._id)}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <button
                          className="hover:text-orange-600 focus:outline-none"
                          onClick={() => toggleOrderExpand(order._id)}
                        >
                          {order._id.substring(0, 10)}...
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.user?.name || "Guest User"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user?.email || "No email provided"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${order.totalPrice?.toFixed(2) || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">
                            {order.status}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                            order.isPaid ? "paid" : "pending"
                          )}`}
                        >
                          <span className="capitalize">
                            {order.isPaid ? "Paid" : "Pending"}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/admin/orders/${order._id}`}
                            className="text-orange-600 hover:text-orange-900"
                            title="View Details"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => {}}
                            className="text-gray-600 hover:text-gray-900"
                            title="Print Invoice"
                          >
                            <FileText className="h-5 w-5" />
                          </button>
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const dropdown = document.getElementById(
                                  `status-dropdown-${order._id}`
                                );
                                if (dropdown) {
                                  dropdown.classList.toggle("hidden");
                                }
                              }}
                              className="text-gray-600 hover:text-gray-900"
                              title="Update Status"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <div
                              id={`status-dropdown-${order._id}`}
                              className="hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                            >
                              <div
                                className="py-1"
                                role="menu"
                                aria-orientation="vertical"
                              >
                                <button
                                  onClick={() =>
                                    updateOrderStatus(order._id, "pending")
                                  }
                                  className={`block w-full text-left px-4 py-2 text-sm ${
                                    order.status === "pending"
                                      ? "bg-purple-100 text-purple-700"
                                      : "text-gray-700 hover:bg-gray-100"
                                  }`}
                                  role="menuitem"
                                >
                                  Pending
                                </button>
                                <button
                                  onClick={() =>
                                    updateOrderStatus(order._id, "processing")
                                  }
                                  className={`block w-full text-left px-4 py-2 text-sm ${
                                    order.status === "processing"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "text-gray-700 hover:bg-gray-100"
                                  }`}
                                  role="menuitem"
                                >
                                  Processing
                                </button>
                                <button
                                  onClick={() =>
                                    updateOrderStatus(order._id, "shipped")
                                  }
                                  className={`block w-full text-left px-4 py-2 text-sm ${
                                    order.status === "shipped"
                                      ? "bg-blue-100 text-blue-700"
                                      : "text-gray-700 hover:bg-gray-100"
                                  }`}
                                  role="menuitem"
                                >
                                  Shipped
                                </button>
                                <button
                                  onClick={() =>
                                    updateOrderStatus(order._id, "delivered")
                                  }
                                  className={`block w-full text-left px-4 py-2 text-sm ${
                                    order.status === "delivered"
                                      ? "bg-green-100 text-green-700"
                                      : "text-gray-700 hover:bg-gray-100"
                                  }`}
                                  role="menuitem"
                                >
                                  Delivered
                                </button>
                                <button
                                  onClick={() =>
                                    updateOrderStatus(order._id, "cancelled")
                                  }
                                  className={`block w-full text-left px-4 py-2 text-sm ${
                                    order.status === "cancelled"
                                      ? "bg-red-100 text-red-700"
                                      : "text-gray-700 hover:bg-gray-100"
                                  }`}
                                  role="menuitem"
                                >
                                  Cancelled
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    {expandedOrderId === order._id && (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 bg-gray-50">
                          <div className="text-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                  Order Details
                                </h4>
                                <div className="bg-white rounded p-4 shadow-sm">
                                  <div className="mb-4">
                                    <div className="text-xs text-gray-500 uppercase font-medium mb-1">
                                      Items
                                    </div>
                                    {order.orderItems.map((item, index) => (
                                      <div
                                        key={index}
                                        className="flex justify-between mb-1"
                                      >
                                        <span>
                                          {item.quantity}x {item.name}
                                        </span>
                                        <span>${item.price.toFixed(2)}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="border-t border-gray-200 pt-3 space-y-1">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">
                                        Subtotal:
                                      </span>
                                      <span>${order.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">
                                        Tax:
                                      </span>
                                      <span>${order.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">
                                        Shipping:
                                      </span>
                                      <span>
                                        ${order.shippingCost.toFixed(2)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between font-medium border-t border-gray-200 pt-1 mt-1">
                                      <span>Total:</span>
                                      <span>
                                        ${order.totalPrice.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                  Shipping Information
                                </h4>
                                <div className="bg-white rounded p-4 shadow-sm">
                                  <div className="text-xs text-gray-500 uppercase font-medium mb-1">
                                    Address
                                  </div>
                                  <p className="text-gray-700 mb-3">
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

                                  <div className="text-xs text-gray-500 uppercase font-medium mb-1">
                                    Method
                                  </div>
                                  <p className="text-gray-700 mb-3">
                                    {order.shippingMethod ||
                                      "Standard Shipping"}
                                  </p>

                                  {order.trackingNumber && (
                                    <>
                                      <div className="text-xs text-gray-500 uppercase font-medium mb-1">
                                        Tracking Number
                                      </div>
                                      <p className="text-gray-700 mb-3">
                                        {order.trackingNumber}
                                      </p>
                                    </>
                                  )}

                                  <div className="text-xs text-gray-500 uppercase font-medium mb-1">
                                    Estimated Delivery
                                  </div>
                                  <p className="text-gray-700">
                                    {order.estimatedDelivery
                                      ? formatDate(order.estimatedDelivery)
                                      : order.status === "pending" ||
                                        order.status === "processing"
                                      ? "Pending"
                                      : order.status === "cancelled"
                                      ? "Cancelled"
                                      : "No estimate available"}
                                  </p>
                                </div>

                                <div className="mt-4 flex justify-end space-x-2">
                                  <button
                                    onClick={() => {}}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                  >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Email Customer
                                  </button>
                                  <Link
                                    to={`/admin/orders/${order._id}`}
                                    className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                  >
                                    View Full Details
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 text-center rounded-lg shadow">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No orders found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== "all" || dateFilter !== "all" ? (
              <>
                Try adjusting your search or filter criteria.
                <button
                  onClick={clearFilters}
                  className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Clear Filters
                </button>
              </>
            ) : (
              "No orders have been placed yet."
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
