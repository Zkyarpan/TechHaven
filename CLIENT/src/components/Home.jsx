import React from "react";
import {
  Laptop,
  Cpu,
  Battery,
  BarChart3,
  Users,
  ShieldCheck,
  HeadphonesIcon,
  RefreshCw,
  TrendingUp,
  Star,
  ChevronRight,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const HomePage = () => {
  // Top selling laptops data
  const topSellingLaptops = [
    {
      name: "ProBook Elite X9",
      category: "Performance",
      price: "$1,299",
      specs: "Intel i9, 32GB RAM, 1TB SSD, RTX 4070",
      image:
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&h=350&q=80",
      rating: 4.8,
      reviews: 256,
      discount: "15% OFF",
    },
    {
      name: "UltraSlim 5",
      category: "Ultrabook",
      price: "$999",
      specs: "Intel i7, 16GB RAM, 512GB SSD, Iris Xe",
      image:
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&h=350&q=80",
      rating: 4.7,
      reviews: 187,
      discount: null,
    },
    {
      name: "BusinessPro 7",
      category: "Business",
      price: "$1,149",
      specs: "AMD Ryzen 9, 32GB RAM, 1TB SSD, Radeon Graphics",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&h=350&q=80",
      rating: 4.9,
      reviews: 324,
      discount: "10% OFF",
    },
    {
      name: "EduBook Air",
      category: "Student",
      price: "$749",
      specs: "Intel i5, 8GB RAM, 256GB SSD, Intel UHD Graphics",
      image:
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&h=350&q=80",
      rating: 4.6,
      reviews: 142,
      discount: null,
    },
  ];

  // Laptop categories
  const laptopCategories = [
    {
      icon: <Cpu className="h-6 w-6 text-white" />,
      title: "Performance",
      description: "High-powered machines for demanding tasks",
      count: "24 models",
    },
    {
      icon: <Battery className="h-6 w-6 text-white" />,
      title: "Ultrabooks",
      description: "Thin, light with exceptional battery life",
      count: "18 models",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-white" />,
      title: "Business",
      description: "Reliable devices for professional use",
      count: "16 models",
    },
    {
      icon: <Users className="h-6 w-6 text-white" />,
      title: "Student",
      description: "Affordable options for education",
      count: "12 models",
    },
  ];

  // Services and benefits
  const services = [
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: "3-Year Warranty",
      description: "Extended protection on all laptops",
    },
    {
      icon: <HeadphonesIcon className="h-8 w-8" />,
      title: "24/7 Tech Support",
      description: "Expert assistance whenever you need",
    },
    {
      icon: <RefreshCw className="h-8 w-8" />,
      title: "30-Day Returns",
      description: "Hassle-free return policy",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Free Upgrades",
      description: "Discounted component upgrades",
    },
  ];

  // Brands we carry
  const brands = [
    "Apple",
    "Dell",
    "HP",
    "Lenovo",
    "Asus",
    "MSI",
    "Acer",
    "Microsoft",
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-800 to-green-900">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Find Your Perfect</span>
                  <span className="block text-green-400">Laptop Today</span>
                </h1>
                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Premium selection of laptops from top brands with expert
                  guidance, competitive pricing, and exceptional after-sales
                  support.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <a
                      href="#top-sellers"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
                    >
                      Shop Now
                    </a>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="#categories"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 md:py-4 md:text-lg md:px-10"
                    >
                      Browse Categories
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&h=800&q=80"
            alt="Featured laptop display"
          />
        </div>
      </div>

      {/* Categories Section */}
      <div id="categories" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">
              Categories
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Find Laptops by Category
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Browse our extensive collection organized by your specific needs
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {laptopCategories.map((category, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-white rounded-lg border border-gray-200 shadow-sm px-6 pb-8 h-full hover:shadow-md transition-shadow duration-300">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-green-500 rounded-md shadow-lg">
                          {category.icon}
                        </span>
                      </div>
                      <h3 className="mt-6 text-lg font-medium text-gray-900 tracking-tight">
                        {category.title}
                      </h3>
                      <p className="mt-2 text-base text-gray-500">
                        {category.description}
                      </p>
                      <p className="mt-1 text-sm font-medium text-green-600">
                        {category.count}
                      </p>
                      <div className="mt-4">
                        <a
                          href="#"
                          className="flex items-center text-sm font-medium text-green-600 hover:text-green-500"
                        >
                          Browse {category.title}{" "}
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Sellers Section */}
      <div id="top-sellers" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">
              Featured Products
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Top Selling Laptops
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Our most popular models loved by customers
            </p>
          </div>

          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {topSellingLaptops.map((laptop, index) => (
              <div
                key={index}
                className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative">
                  <img
                    src={laptop.image}
                    alt={laptop.name}
                    className="w-full h-48 object-cover"
                  />
                  {laptop.discount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                      {laptop.discount}
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-gray-900 bg-opacity-70 text-white px-2 py-1 text-xs rounded">
                    {laptop.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {laptop.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{laptop.specs}</p>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium text-gray-600">
                        {laptop.rating}
                      </span>
                    </div>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-sm text-gray-600">
                      {laptop.reviews} reviews
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">
                      {laptop.price}
                    </span>
                    <a
                      href="#"
                      className="text-sm font-medium text-green-600 hover:text-green-500 flex items-center"
                    >
                      View Details <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href="#"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50"
            >
              View All Laptops <ChevronRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-green-200 font-semibold tracking-wide uppercase">
              Why Choose Us
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
              Premium Service Guaranteed
            </p>
            <p className="mt-4 max-w-2xl text-xl text-green-100 mx-auto">
              We provide more than just laptops - we deliver peace of mind
            </p>
          </div>

          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                <div className="text-green-600 mb-4">{service.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brands Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">
              Trusted Brands
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Top Manufacturers
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="flex justify-center items-center h-24 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
              >
                <span className="text-xl font-medium text-gray-500">
                  {brand}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-green-50 py-10 px-6 sm:py-16 sm:px-12 lg:flex lg:items-center lg:p-20">
            <div className="lg:w-0 lg:flex-1">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                Stay updated with our latest offers
              </h2>
              <p className="mt-4 max-w-3xl text-lg text-gray-500">
                Sign up for our newsletter to receive special discounts, tech
                news, and product updates
              </p>
            </div>
            <div className="mt-12 sm:w-full sm:max-w-md lg:mt-0 lg:ml-8">
              <form className="sm:flex">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email-address"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full border border-gray-300 rounded-md px-5 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="mt-3 w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto"
                >
                  Subscribe
                </button>
              </form>
              <p className="mt-3 text-sm text-gray-500">
                We care about your data. Read our{" "}
                <a
                  href="#"
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Ready to find your perfect laptop?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our expert team is ready to help you choose the right device for
              your needs. Visit one of our stores or shop online today.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Find a Store
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-green-100 hover:bg-green-200"
              >
                Contact Us
              </a>
            </div>
            <div className="mt-6 flex justify-center space-x-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Free Shipping</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Secure Payment</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Price Match Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
