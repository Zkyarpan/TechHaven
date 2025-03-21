import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Truck,
  Calendar,
  Check,
  Clock,
  CreditCard,
  MapPin,
  AlertCircle,
  X,
  Download,
  RefreshCw,
  Package,
  ChevronRight,
  MemoryStick 
} from "lucide-react";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      // This would be replaced with an API call in a real application
      const mockOrder = {
        id: id || "NEW12345",
        date: "March 15, 2025",
        timestamp: "2025-03-15T10:30:00Z",
        status:
          id === "ORD-2023-0012"
            ? "delivered"
            : id === "ORD-2023-0010"
            ? "shipped"
            : "processing",
        items: [
          {
            id: 101,
            name: "MacBook Pro M3",
            price: 1999.99,
            quantity: 1,
            warranty: "Premium Care - 3 years",
            warrantyPrice: 499.99,
            image:
              "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
          },
        ],
        subtotal: 1999.99,
        warranty: 499.99,
        shipping: 0,
        tax: 200.0,
        total: 2699.98,
        shipping_address: {
          name: "John Doe",
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zip: "10001",
          country: "USA",
        },
        billing_address: {
          name: "John Doe",
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zip: "10001",
          country: "USA",
        },
        payment_method: "Credit Card (ending in 4242)",
        tracking_number:
          id === "ORD-2023-0012" || id === "ORD-2023-0010"
            ? "TRK98765432"
            : null,
        estimated_delivery:
          id === "ORD-2023-0012" || id === "ORD-2023-0010"
            ? "March 18, 2025"
            : "Pending",
        delivery_date: id === "ORD-2023-0012" ? "March 17, 2025" : null,
        delivery_notes: id === "ORD-2023-0012" ? "Left with doorman" : null,
        timeline: [
          {
            status: "ordered",
            date: "March 15, 2025",
            time: "10:30 AM",
            description: "Order placed",
          },
          {
            status: "payment_confirmed",
            date: "March 15, 2025",
            time: "10:32 AM",
            description: "Payment confirmed",
          },
          {
            status: "processing",
            date: "March 15, 2025",
            time: "11:45 AM",
            description: "Order processing started",
          },
          ...(id === "ORD-2023-0010" || id === "ORD-2023-0012"
            ? [
                {
                  status: "packed",
                  date: "March 16, 2025",
                  time: "9:20 AM",
                  description: "Order packed and ready for shipping",
                },
                {
                  status: "shipped",
                  date: "March 16, 2025",
                  time: "2:15 PM",
                  description: "Order shipped",
                },
              ]
            : []),
          ...(id === "ORD-2023-0012"
            ? [
                {
                  status: "out_for_delivery",
                  date: "March 17, 2025",
                  time: "8:30 AM",
                  description: "Out for delivery",
                },
                {
                  status: "delivered",
                  date: "March 17, 2025",
                  time: "2:45 PM",
                  description: "Delivered - Left with doorman",
                },
              ]
            : []),
        ],
      };

      setOrder(mockOrder);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <Check className="h-6 w-6 text-green-500" />;
      case "shipped":
        return <Truck className="h-6 w-6 text-blue-500" />;
      case "processing":
        return <RefreshCw className="h-6 w-6 text-yellow-500" />;
      case "cancelled":
        return <X className="h-6 w-6 text-red-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500" />;
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

  const getTimelineIcon = (status) => {
    switch (status) {
      case "ordered":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "payment_confirmed":
        return <CreditCard className="h-5 w-5 text-green-500" />;
      case "processing":
        return <RefreshCw className="h-5 w-5 text-yellow-500" />;
      case "packed":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "out_for_delivery":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "delivered":
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 mb-6 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 mb-6 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-40 bg-gray-200 rounded col-span-2"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-10 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The order you are looking for does not exist.
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Button */}
      <button
        onClick={() => navigate("/orders")}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Orders
      </button>

      {/* Order Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 mr-3">
                Order #{order.id}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                  order.status
                )}`}
              >
                {getStatusText(order.status)}
              </span>
            </div>
            <p className="text-gray-600 mt-1">Placed on {order.date}</p>
          </div>

          {order.status !== "cancelled" && (
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <Download className="h-4 w-4 mr-2" />
                Invoice
              </button>

              {order.status === "delivered" && (
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Return Item
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Order Items
              </h2>
            </div>
            <div className="px-6 py-4">
              <ul role="list" className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <li key={item.id} className="py-4 flex">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <Link to={`/laptops/${item.id}`}>{item.name}</Link>
                          </h3>
                          <p className="ml-4">${item.price.toFixed(2)}</p>
                        </div>
                        {item.warranty && (
                          <p className="mt-1 text-sm text-gray-500">
                            {item.warranty}
                          </p>
                        )}
                      </div>
                      <div className="flex-1 flex items-end justify-between text-sm">
                        <p className="text-gray-500">Qty {item.quantity}</p>
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

          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Order Timeline
              </h2>
            </div>
            <div className="px-6 py-4">
              <ol className="relative border-l border-gray-200 ml-3">
                {order.timeline.map((event, index) => (
                  <li key={index} className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-white rounded-full -left-4 ring-4 ring-white">
                      {getTimelineIcon(event.status)}
                    </span>
                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                      {event.description}
                      {index === order.timeline.length - 1 && (
                        <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">
                          Latest
                        </span>
                      )}
                    </h3>
                    <time className="block mb-2 text-sm font-normal leading-none text-gray-500">
                      {event.date} at {event.time}
                    </time>
                  </li>
                ))}

                {order.status !== "delivered" &&
                  order.status !== "cancelled" && (
                    <li className="mb-6 ml-6 opacity-50">
                      <span className="absolute flex items-center justify-center w-8 h-8 bg-white rounded-full -left-4 ring-4 ring-white">
                        <Check className="h-5 w-5 text-gray-400" />
                      </span>
                      <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-500">
                        Delivery
                      </h3>
                      <time className="block mb-2 text-sm font-normal leading-none text-gray-500">
                        Estimated: {order.estimated_delivery}
                      </time>
                    </li>
                  )}
              </ol>
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Shipping */}
        <div className="space-y-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Order Summary
              </h2>
            </div>
            <div className="px-6 py-4">
              <dl className="space-y-3">
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-600">Subtotal</dt>
                  <dd className="text-gray-900">
                    ${order.subtotal.toFixed(2)}
                  </dd>
                </div>
                {order.warranty > 0 && (
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-600">Warranty</dt>
                    <dd className="text-gray-900">
                      ${order.warranty.toFixed(2)}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-600">Shipping</dt>
                  <dd className="text-gray-900">
                    {order.shipping === 0
                      ? "Free"
                      : `$${order.shipping.toFixed(2)}`}
                  </dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-600">Tax</dt>
                  <dd className="text-gray-900">${order.tax.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <dt className="font-medium text-gray-900">Total</dt>
                  <dd className="font-bold text-gray-900">
                    ${order.total.toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Shipping Information
              </h2>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-start mb-4">
                <MapPin className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Shipping Address
                  </h3>
                  <address className="mt-1 text-sm text-gray-600 not-italic">
                    {order.shipping_address.name}
                    <br />
                    {order.shipping_address.street}
                    <br />
                    {order.shipping_address.city},{" "}
                    {order.shipping_address.state} {order.shipping_address.zip}
                    <br />
                    {order.shipping_address.country}
                  </address>
                </div>
              </div>

              {order.status === "shipped" || order.status === "delivered" ? (
                <div className="flex items-start">
                  <Truck className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Delivery Details
                    </h3>
                    <div className="mt-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Tracking Number:</span>{" "}
                        {order.tracking_number}
                      </p>
                      <p className="mt-1">
                        <span className="font-medium">
                          {order.status === "delivered"
                            ? "Delivered on:"
                            : "Estimated delivery:"}
                        </span>{" "}
                        {order.status === "delivered"
                          ? order.delivery_date
                          : order.estimated_delivery}
                      </p>
                      {order.delivery_notes && (
                        <p className="mt-1">
                          <span className="font-medium">Notes:</span>{" "}
                          {order.delivery_notes}
                        </p>
                      )}
                    </div>
                    {order.status === "shipped" && (
                      <a
                        href="#"
                        className="mt-2 inline-flex items-center text-sm font-medium text-green-600 hover:text-green-500"
                      >
                        Track Package <ChevronRight className="ml-1 h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Processing
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Your order is being processed. Tracking information will
                      be available once the order ships.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Payment Information
              </h2>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-start">
                <CreditCard className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Payment Method
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {order.payment_method}
                  </p>

                  <h3 className="text-sm font-medium text-gray-900 mt-4">
                    Billing Address
                  </h3>
                  <address className="mt-1 text-sm text-gray-600 not-italic">
                    {order.billing_address.name}
                    <br />
                    {order.billing_address.street}
                    <br />
                    {order.billing_address.city}, {order.billing_address.state}{" "}
                    {order.billing_address.zip}
                    <br />
                    {order.billing_address.country}
                  </address>
                </div>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Need Help?
              </h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 mb-4">
                If you have any questions or concerns about your order, our
                support team is here to help.
              </p>
              <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
