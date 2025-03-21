import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  DollarSign,
  Users,
  ShoppingBag,
  Laptop,
  ChevronRight,
  AlertCircle,
  Package,
  TrendingUp,
  TrendingDown,
  Clock,
  Search,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week"); // week, month, year

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      // Mock data - in a real app, this would come from an API
      const mockStats = {
        totalSales: {
          value: 52849.99,
          change: 12.5,
          trending: "up",
        },
        orders: {
          value: 128,
          change: 8.2,
          trending: "up",
        },
        customers: {
          value: 312,
          change: 15.3,
          trending: "up",
        },
        revenue: {
          value: 42279.99,
          change: -3.8,
          trending: "down",
        },
      };

      const mockRecentOrders = [
        {
          id: "ORD-2023-0012",
          date: "March 15, 2025",
          customer: "John Doe",
          email: "john.doe@example.com",
          items: [{ name: "MacBook Pro M3", quantity: 1, price: 1999.99 }],
          total: 1999.99,
          status: "delivered",
        },
        {
          id: "ORD-2023-0011",
          date: "March 14, 2025",
          customer: "Jane Smith",
          email: "jane.smith@example.com",
          items: [
            { name: "Dell XPS 13", quantity: 1, price: 1499.99 },
            { name: "External Monitor", quantity: 1, price: 349.99 },
          ],
          total: 1849.98,
          status: "processing",
        },
        {
          id: "ORD-2023-0010",
          date: "March 13, 2025",
          customer: "Robert Johnson",
          email: "robert.j@example.com",
          items: [{ name: "Lenovo ThinkPad X1", quantity: 1, price: 1699.99 }],
          total: 1699.99,
          status: "shipped",
        },
        {
          id: "ORD-2023-0009",
          date: "March 12, 2025",
          customer: "Emily Williams",
          email: "emily.w@example.com",
          items: [
            { name: "HP Spectre x360", quantity: 1, price: 1399.99 },
            { name: "Laptop Bag", quantity: 1, price: 79.99 },
          ],
          total: 1479.98,
          status: "processing",
        },
        {
          id: "ORD-2023-0008",
          date: "March 11, 2025",
          customer: "Michael Brown",
          email: "michael.b@example.com",
          items: [{ name: "ASUS ROG Zephyrus", quantity: 1, price: 1799.99 }],
          total: 1799.99,
          status: "pending",
        },
      ];

      const mockLowStockItems = [
        {
          id: 5,
          name: "Apple MacBook Air M2",
          stock: 2,
          threshold: 5,
          price: 1199.99,
          image:
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
        },
        {
          id: 12,
          name: "Microsoft Surface Laptop 5",
          stock: 3,
          threshold: 5,
          price: 1299.99,
          image:
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
        },
        {
          id: 8,
          name: "Razer Blade 15",
          stock: 1,
          threshold: 5,
          price: 1699.99,
          image:
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
        },
      ];

      setStats(mockStats);
      setRecentOrders(mockRecentOrders);
      setLowStockItems(mockLowStockItems);
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

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

  const getStatIcon = (key) => {
    switch (key) {
      case "totalSales":
        return <ShoppingBag className="h-6 w-6 text-orange-500" />;
      case "orders":
        return <Package className="h-6 w-6 text-blue-500" />;
      case "customers":
        return <Users className="h-6 w-6 text-green-500" />;
      case "revenue":
        return <DollarSign className="h-6 w-6 text-purple-500" />;
      default:
        return <BarChart3 className="h-6 w-6 text-gray-500" />;
    }
  };

  const getTrendIcon = (trending) => {
    if (trending === "up") {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    }
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-5"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="mt-4 sm:mt-0">
          <div className="flex items-center space-x-2">
            <label htmlFor="time-range" className="text-sm text-gray-600">
              Time period:
            </label>
            <select
              id="time-range"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats &&
          Object.entries(stats).map(([key, data]) => (
            <div key={key} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100 mr-4">
                  {getStatIcon(key)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {key === "totalSales" && "Total Sales"}
                    {key === "orders" && "Orders"}
                    {key === "customers" && "Customers"}
                    {key === "revenue" && "Revenue"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {key.includes("Sales") || key === "revenue"
                      ? `$${data.value.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : data.value.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                {getTrendIcon(data.trending)}
                <span
                  className={`ml-1 ${
                    data.trending === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {data.change > 0 ? "+" : ""}
                  {data.change}%
                </span>
                <span className="ml-1 text-gray-500">
                  from previous {timeRange}
                </span>
              </div>
            </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h2>
              <Link
                to="/admin/orders"
                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Order
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
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.customer}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Low Stock Alert
              </h2>
              <Link
                to="/admin/laptops"
                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                Manage Inventory
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item) => (
                  <div key={item.id} className="p-4 flex items-center">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-center object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm font-medium text-gray-900">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                        <p className="text-sm text-red-500">
                          Only {item.stock} left in stock!
                        </p>
                      </div>
                      <div className="mt-2">
                        <Link
                          to={`/admin/laptops/edit/${item.id}`}
                          className="text-sm font-medium text-orange-600 hover:text-orange-500"
                        >
                          Update Inventory
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <Laptop className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No low stock items
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    All inventory levels are currently healthy.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <Link
                  to="/admin/laptops/new"
                  className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-300 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <div className="flex items-center">
                    <Laptop className="h-5 w-5 text-orange-500 mr-3" />
                    <span>Add New Laptop</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
                <Link
                  to="/admin/orders"
                  className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-300 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-orange-500 mr-3" />
                    <span>Manage Orders</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
                <Link
                  to="/admin/reports"
                  className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-300 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <div className="flex items-center">
                    <BarChart3 className="h-5 w-5 text-orange-500 mr-3" />
                    <span>View Sales Reports</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
        </div>
        <div className="p-6">
          <ol className="relative border-l border-gray-200 ml-3">
            <li className="mb-6 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                <Users className="w-3 h-3 text-blue-500" />
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="flex items-center text-sm font-semibold text-gray-900">
                    New customer registered
                  </h3>
                  <p className="text-sm text-gray-600">
                    Michael Thompson created an account
                  </p>
                </div>
                <time className="text-xs text-gray-500">5 minutes ago</time>
              </div>
            </li>
            <li className="mb-6 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                <ShoppingBag className="w-3 h-3 text-green-500" />
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="flex items-center text-sm font-semibold text-gray-900">
                    New order placed
                  </h3>
                  <p className="text-sm text-gray-600">
                    Order #ORD-2023-0013 for $1,249.99
                  </p>
                </div>
                <time className="text-xs text-gray-500">15 minutes ago</time>
              </div>
            </li>
            <li className="mb-6 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-yellow-100 rounded-full -left-3 ring-8 ring-white">
                <Package className="w-3 h-3 text-yellow-500" />
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="flex items-center text-sm font-semibold text-gray-900">
                    Order status updated
                  </h3>
                  <p className="text-sm text-gray-600">
                    Order #ORD-2023-0010 changed to "Shipped"
                  </p>
                </div>
                <time className="text-xs text-gray-500">1 hour ago</time>
              </div>
            </li>
            <li className="mb-6 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-purple-100 rounded-full -left-3 ring-8 ring-white">
                <Laptop className="w-3 h-3 text-purple-500" />
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="flex items-center text-sm font-semibold text-gray-900">
                    Inventory updated
                  </h3>
                  <p className="text-sm text-gray-600">
                    Admin user added 5 new MacBook Pro M3 units
                  </p>
                </div>
                <time className="text-xs text-gray-500">3 hours ago</time>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
