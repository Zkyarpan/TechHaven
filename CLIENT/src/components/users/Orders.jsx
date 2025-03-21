import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      // In a real app, this would be an API call
      const mockOrders = [
        {
          id: "ORD-2023-0012",
          date: "March 15, 2025",
          timestamp: "2025-03-15T10:30:00Z",
          status: "delivered",
          items: [
            {
              id: 101,
              name: "MacBook Pro M3",
              price: 1999.99,
              quantity: 1,
              image:
                "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
            },
          ],
          subtotal: 1999.99,
          shipping: 0,
          tax: 160.0,
          total: 2159.99,
          shipping_address: {
            name: "John Doe",
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zip: "10001",
            country: "USA",
          },
          payment_method: "Credit Card (ending in 4242)",
          tracking_number: "TRK98765432",
          estimated_delivery: "March 18, 2025",
          delivery_date: "March 17, 2025",
          delivery_notes: "Left with doorman",
        },
        {
          id: "ORD-2023-0010",
          date: "March 8, 2025",
          timestamp: "2025-03-08T15:45:00Z",
          status: "shipped",
          items: [
            {
              id: 102,
              name: "Dell XPS 13",
              price: 1499.99,
              quantity: 1,
              image:
                "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
            },
            {
              id: 201,
              name: "USB-C Hub",
              price: 49.99,
              quantity: 1,
              image:
                "https://images.unsplash.com/photo-1656427457484-6890ae34dca3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
            },
          ],
          subtotal: 1549.98,
          shipping: 29.99,
          tax: 124.0,
          total: 1703.97,
          shipping_address: {
            name: "John Doe",
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zip: "10001",
            country: "USA",
          },
          payment_method: "PayPal",
          tracking_number: "TRK12345678",
          estimated_delivery: "March 20, 2025",
        },
        {
          id: "ORD-2023-0008",
          date: "February 28, 2025",
          timestamp: "2025-02-28T09:15:00Z",
          status: "processing",
          items: [
            {
              id: 103,
              name: "Lenovo ThinkPad X1",
              price: 1799.99,
              quantity: 1,
              image:
                "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
            },
          ],
          subtotal: 1799.99,
          shipping: 0,
          tax: 144.0,
          total: 1943.99,
          shipping_address: {
            name: "John Doe",
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zip: "10001",
            country: "USA",
          },
          payment_method: "Credit Card (ending in 4242)",
          estimated_delivery: "March 25, 2025",
        },
        {
          id: "ORD-2023-0005",
          date: "February 15, 2025",
          timestamp: "2025-02-15T11:30:00Z",
          status: "cancelled",
          items: [
            {
              id: 104,
              name: "HP Spectre x360",
              price: 1399.99,
              quantity: 1,
              image:
                "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
            },
          ],
          subtotal: 1399.99,
          shipping: 0,
          tax: 112.0,
          total: 1511.99,
          shipping_address: {
            name: "John Doe",
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zip: "10001",
            country: "USA",
          },
          payment_method: "Credit Card (ending in 4242)",
          cancellation_reason: "Customer requested cancellation",
        },
        {
          id: "ORD-2023-0001",
          date: "January 5, 2025",
          timestamp: "2025-01-05T14:20:00Z",
          status: "delivered",
          items: [
            {
              id: 105,
              name: "ASUS ROG Zephyrus",
              price: 1799.99,
              quantity: 1,
              image:
                "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
            },
          ],
          subtotal: 1799.99,
          shipping: 0,
          tax: 144.0,
          total: 1943.99,
          shipping_address: {
            name: "John Doe",
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zip: "10001",
            country: "USA",
          },
          payment_method: "Credit Card (ending in 4242)",
          tracking_number: "TRK87654321",
          estimated_delivery: "January 10, 2025",
          delivery_date: "January 9, 2025",
        },
      ];

      setOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter orders based on search term, status, and time
  const filteredOrders = orders.filter((order) => {
    // Search filter
    if (
      searchTerm &&
      !order.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !order.items.some((item) =>
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
      const orderDate = new Date(order.timestamp);
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
      default:
        return "bg-gray-100 text-gray-800";
    }
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
              key={order.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              {/* Order Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="flex flex-col mb-4 md:mb-0">
                    <div className="flex items-center">
                      <span className="text-lg font-medium text-gray-900 mr-2">
                        Order #{order.id}
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
                      <span>Placed on {order.date}</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Link
                      to={`/order-details/${order.id}`}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Details
                    </Link>
                    <button
                      onClick={() => toggleOrderExpand(order.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      {expandedOrderId === order.id ? "Hide" : "Show"} Items
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Content - visible when expanded */}
              {expandedOrderId === order.id && (
                <>
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flow-root">
                      <ul
                        role="list"
                        className="-my-6 divide-y divide-gray-200"
                      >
                        {order.items.map((item) => (
                          <li key={item.id} className="py-4 flex">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="ml-6 flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>
                                    <Link to={`/laptops/${item.id}`}>
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
                          {order.shipping_address.name}
                          <br />
                          {order.shipping_address.street}
                          <br />
                          {order.shipping_address.city},{" "}
                          {order.shipping_address.state}{" "}
                          {order.shipping_address.zip}
                          <br />
                          {order.shipping_address.country}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          Payment Method
                        </h4>
                        <p className="text-gray-600">{order.payment_method}</p>

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
                              {order.shipping === 0
                                ? "Free"
                                : `$${order.shipping.toFixed(2)}`}
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
                              ${order.total.toFixed(2)}
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
                        {order.estimated_delivery} • Tracking #:{" "}
                        {order.tracking_number}
                      </span>
                    </>
                  )}
                  {order.status === "delivered" && (
                    <>
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">Delivered on:</span>{" "}
                        {order.delivery_date}
                        {order.delivery_notes && ` • ${order.delivery_notes}`}
                      </span>
                    </>
                  )}
                  {order.status === "cancelled" && (
                    <>
                      <X className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">Cancelled:</span>{" "}
                        {order.cancellation_reason}
                      </span>
                    </>
                  )}
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-900">
                    ${order.total.toFixed(2)}
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
