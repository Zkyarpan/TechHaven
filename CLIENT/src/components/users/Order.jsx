import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  CreditCard,
  Cpu,
  HardDrive,
  Monitor,
  Battery,
  Wifi,
  Check,
  ArrowLeft,
  MemoryStick,
} from "lucide-react";

const Order = () => {
  const { laptopId } = useParams();
  const navigate = useNavigate();
  const [laptop, setLaptop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWarranty, setSelectedWarranty] = useState("standard");
  const [quantity, setQuantity] = useState(1);
  const [shipping, setShipping] = useState("standard");
  const [total, setTotal] = useState(0);

  // Fetch laptop data
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      // In a real app, this would be an API call like:
      // fetch(`/api/laptops/${laptopId}`)
      const mockLaptop = {
        id: parseInt(laptopId),
        name: "MacBook Pro M3",
        brand: "Apple",
        type: "Ultrabook",
        processor: "Apple M3",
        ram: "16GB",
        storage: "512GB SSD",
        graphics: "10-core GPU",
        display: "14-inch Retina",
        resolution: "3024 x 1964",
        battery: "20 hours",
        connectivity: "Wi-Fi 6E, Bluetooth 5.3",
        ports: "3x Thunderbolt 4, HDMI, SD card slot",
        weight: "3.5 lbs (1.6 kg)",
        dimensions: "12.31 x 8.71 x 0.61 inches",
        operatingSystem: "macOS Sonoma",
        color: "Space Gray",
        price: 1999.99,
        stock: 15,
        rating: 4.8,
        reviews: 124,
        images: [
          "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1026&q=80",
          "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
        ],
        features: [
          "Apple M3 chip for exceptional performance",
          "Up to 20 hours of battery life",
          "Stunning Retina display with high brightness",
          "Advanced camera and audio system",
          "Thunderbolt ports for high-speed connectivity",
        ],
        description:
          "Experience the extraordinary power and efficiency of Apple's most advanced laptop. The MacBook Pro with M3 chip offers unprecedented performance and battery life in a sleek, portable design. Perfect for professionals, creatives, and anyone who demands the best.",
        warrantyOptions: [
          {
            id: "standard",
            name: "Standard Warranty",
            duration: "1 year",
            price: 0,
            coverage: "Hardware defects and failures",
          },
          {
            id: "extended",
            name: "Extended Warranty",
            duration: "3 years",
            price: 299.99,
            coverage: "Hardware defects, failures, and technical support",
          },
          {
            id: "premium",
            name: "Premium Care",
            duration: "3 years",
            price: 499.99,
            coverage:
              "Hardware defects, failures, technical support, and accidental damage",
          },
        ],
        shippingOptions: [
          {
            id: "standard",
            name: "Standard Shipping",
            duration: "3-5 business days",
            price: 0,
          },
          {
            id: "express",
            name: "Express Shipping",
            duration: "1-2 business days",
            price: 29.99,
          },
          {
            id: "nextDay",
            name: "Next Day Delivery",
            duration: "Next business day",
            price: 49.99,
          },
        ],
      };

      setLaptop(mockLaptop);
      setIsLoading(false);
    }, 1000);
  }, [laptopId]);

  // Calculate total price whenever relevant factors change
  useEffect(() => {
    if (laptop) {
      const warrantyOption = laptop.warrantyOptions.find(
        (w) => w.id === selectedWarranty
      );
      const shippingOption = laptop.shippingOptions.find(
        (s) => s.id === shipping
      );

      const laptopTotal = laptop.price * quantity;
      const warrantyTotal = warrantyOption.price * quantity;
      const shippingTotal = shippingOption.price;

      setTotal(laptopTotal + warrantyTotal + shippingTotal);
    }
  }, [laptop, selectedWarranty, quantity, shipping]);

  const handlePlaceOrder = () => {
    // In a real app, this would submit the order to an API
    // For demo purposes, navigate to the order confirmation
    navigate("/order-details/NEW12345");
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 mb-6 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!laptop) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-10 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Laptop Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The laptop you are looking for does not exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/laptops")}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Browse Laptops
          </button>
        </div>
      </div>
    );
  }

  const selectedWarrantyOption = laptop.warrantyOptions.find(
    (w) => w.id === selectedWarranty
  );
  const selectedShippingOption = laptop.shippingOptions.find(
    (s) => s.id === shipping
  );

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => navigate("/laptops")}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Laptops
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column - Laptop Images & Details */}
          <div>
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="mb-4 h-80 overflow-hidden rounded-md">
                <img
                  src={laptop.images[0]}
                  alt={laptop.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {laptop.images.map((image, index) => (
                  <div
                    key={index}
                    className={`h-20 rounded-md overflow-hidden cursor-pointer border-2 ${
                      index === 0 ? "border-green-500" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${laptop.name} - view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Product Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Cpu className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Processor
                    </p>
                    <p className="text-sm text-gray-600">{laptop.processor}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MemoryStick className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">RAM</p>
                    <p className="text-sm text-gray-600">{laptop.ram}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <HardDrive className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Storage</p>
                    <p className="text-sm text-gray-600">{laptop.storage}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Monitor className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Display</p>
                    <p className="text-sm text-gray-600">{laptop.display}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Battery className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Battery</p>
                    <p className="text-sm text-gray-600">{laptop.battery}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Wifi className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Connectivity
                    </p>
                    <p className="text-sm text-gray-600">
                      {laptop.connectivity}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Description
              </h3>
              <p className="text-gray-700 mb-6">{laptop.description}</p>

              <h4 className="font-medium text-gray-900 mb-2">Key Features</h4>
              <ul className="space-y-2 mb-4">
                {laptop.features.map((feature, index) => (
                  <li key={index} className="flex">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Order Form */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {laptop.name}
              </h1>
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(laptop.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  {laptop.rating} ({laptop.reviews} reviews)
                </span>
              </div>

              <div className="flex items-baseline mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  ${laptop.price.toFixed(2)}
                </h2>
                {laptop.stock < 5 && (
                  <span className="ml-3 text-sm text-red-600">
                    Only {laptop.stock} left in stock!
                  </span>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Quantity
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                >
                  {[...Array(Math.min(5, laptop.stock))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Protection Plan
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose a warranty plan to protect your investment
              </p>

              <div className="space-y-3">
                {laptop.warrantyOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedWarranty === option.id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedWarranty(option.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {option.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {option.duration} • {option.coverage}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {option.price === 0
                            ? "Included"
                            : `+$${option.price.toFixed(2)}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Options
              </h3>
              <div className="space-y-3">
                {laptop.shippingOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      shipping === option.id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setShipping(option.id)}
                  >
                    <div className="flex items-start">
                      <Truck className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {option.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Estimated delivery: {option.duration}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {option.price === 0
                            ? "Free"
                            : `$${option.price.toFixed(2)}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {laptop.name} ({quantity})
                  </span>
                  <span className="text-gray-900 font-medium">
                    ${(laptop.price * quantity).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {selectedWarrantyOption.name} ({quantity})
                  </span>
                  <span className="text-gray-900 font-medium">
                    {selectedWarrantyOption.price === 0
                      ? "Included"
                      : `$${(selectedWarrantyOption.price * quantity).toFixed(
                          2
                        )}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {selectedShippingOption.name}
                  </span>
                  <span className="text-gray-900 font-medium">
                    {selectedShippingOption.price === 0
                      ? "Free"
                      : `$${selectedShippingOption.price.toFixed(2)}`}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center"
            >
              Place Order <ChevronRight className="ml-1 h-5 w-5" />
            </button>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600">
              <div className="flex items-center mb-2 sm:mb-0">
                <ShieldCheck className="h-4 w-4 text-green-600 mr-1" />
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center mb-2 sm:mb-0">
                <Truck className="h-4 w-4 text-green-600 mr-1" />
                <span>Free returns within 30 days</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 text-green-600 mr-1" />
                <span>Multiple payment methods</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
