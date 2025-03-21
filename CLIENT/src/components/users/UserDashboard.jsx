import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  ShoppingBag,
  User,
  Heart,
  Bell,
  MapPin,
  CreditCard,
  Headphones,
  ChevronRight,
} from "lucide-react";

const UserDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      // Mock data - in a real app, this would come from an API
      setRecentOrders([
        {
          id: "ORD-2023-0012",
          date: "March 15, 2025",
          status: "Delivered",
          total: 1299.99,
          items: [{ name: "Dell XPS 13", quantity: 1 }],
        },
        {
          id: "ORD-2023-0008",
          date: "February 28, 2025",
          status: "Processing",
          total: 2149.99,
          items: [
            { name: "MacBook Pro M3", quantity: 1 },
            { name: "USB-C Hub", quantity: 1 },
          ],
        },
      ]);

      setSavedItems([
        {
          id: 101,
          name: "Lenovo ThinkPad X1 Carbon",
          price: 1499.99,
          image:
            "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        },
        {
          id: 102,
          name: "HP Spectre x360",
          price: 1299.99,
          image:
            "https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        },
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

      {/* User Profile Summary */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <User className="h-8 w-8 text-green-600" />
          </div>
          <div className="ml-6">
            <h2 className="text-xl font-semibold">
              {auth?.user?.name || "User"}
            </h2>
            <p className="text-gray-600">
              {auth?.user?.email || "user@example.com"}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                to="/profile/edit"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Edit Profile
              </Link>
              <Link
                to="/orders"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                View All Orders
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <ShoppingBag className="h-8 w-8 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold">My Orders</h3>
          </div>
          <p className="text-gray-600 mb-4">Track, return, or buy again</p>
          <Link
            to="/orders"
            className="text-green-600 font-medium flex items-center hover:text-green-700"
          >
            View Orders <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <Heart className="h-8 w-8 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold">Wishlist</h3>
          </div>
          <p className="text-gray-600 mb-4">{savedItems.length} saved items</p>
          <Link
            to="/wishlist"
            className="text-green-600 font-medium flex items-center hover:text-green-700"
          >
            View Wishlist <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <Headphones className="h-8 w-8 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold">Support</h3>
          </div>
          <p className="text-gray-600 mb-4">Get help with orders or products</p>
          <Link
            to="/support"
            className="text-green-600 font-medium flex items-center hover:text-green-700"
          >
            Contact Support <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order #{order.id}
                    </p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-3">
                  {order.items.map((item, idx) => (
                    <div key={idx}>
                      {item.quantity}x {item.name}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-900">
                    Total: ${order.total.toFixed(2)}
                  </p>
                  <Link
                    to={`/order-details/${order.id}`}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-5 text-center">
              <p className="text-gray-500">No recent orders found</p>
              <Link
                to="/laptops"
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                Browse Laptops
              </Link>
            </div>
          )}
        </div>
        {recentOrders.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <Link
              to="/orders"
              className="text-green-600 font-medium hover:text-green-700 flex items-center justify-center"
            >
              View All Orders <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        )}
      </div>

      {/* Saved Items / Wishlist */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Saved Items</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {savedItems.length > 0 ? (
            savedItems.map((item) => (
              <div key={item.id} className="px-6 py-5 flex items-center">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <h4 className="text-sm font-medium text-gray-900">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <Link
                  to={`/order/${item.id}`}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  Buy Now
                </Link>
              </div>
            ))
          ) : (
            <div className="px-6 py-5 text-center">
              <p className="text-gray-500">No saved items found</p>
              <Link
                to="/laptops"
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                Browse Laptops
              </Link>
            </div>
          )}
        </div>
        {savedItems.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <Link
              to="/wishlist"
              className="text-green-600 font-medium hover:text-green-700 flex items-center justify-center"
            >
              View All Saved Items <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
