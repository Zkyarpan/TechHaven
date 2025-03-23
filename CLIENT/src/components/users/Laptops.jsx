import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Cpu,
  HardDrive,
  Battery,
  Monitor,
  Wifi,
  Search,
  SlidersHorizontal,
  X,
  Heart,
  AlertCircle,
} from "lucide-react";
import apiService from "../utils/apiService";
import { toast } from "sonner";

const Laptops = () => {
  const [laptops, setLaptops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    brand: [],
    price: "",
    type: [],
    processor: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchLaptops = async () => {
      setIsLoading(true);
      try {
        // Get laptops from API
        const response = await apiService.getLaptops();
        setLaptops(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching laptops:", err);
        setError("Failed to load laptops. Please try again.");
        toast.error("Error loading laptops");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLaptops();
  }, []);

  const handleFilterChange = (category, value) => {
    if (category === "price") {
      setFilters({ ...filters, [category]: value });
    } else {
      let updatedValues = [...filters[category]];
      if (updatedValues.includes(value)) {
        updatedValues = updatedValues.filter((item) => item !== value);
      } else {
        updatedValues.push(value);
      }
      setFilters({ ...filters, [category]: updatedValues });
    }
  };

  const clearFilters = () => {
    setFilters({
      brand: [],
      price: "",
      type: [],
      processor: [],
    });
    setSearchTerm("");
  };

  const toggleWishlist = (laptopId) => {
    if (wishlist.includes(laptopId)) {
      setWishlist(wishlist.filter((id) => id !== laptopId));
      toast.success("Removed from wishlist");
    } else {
      setWishlist([...wishlist, laptopId]);
      toast.success("Added to wishlist");
    }
  };

  const filteredLaptops = laptops
    .filter((laptop) => {
      // Search filter
      if (
        searchTerm &&
        !laptop.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Brand filter
      if (filters.brand.length > 0 && !filters.brand.includes(laptop.brand)) {
        return false;
      }

      // Type filter - if we track types in the database
      if (filters.type.length > 0) {
        // Check if laptop has a type property, or infer type from other properties
        const laptopType = laptop.type || inferTypeFromLaptop(laptop);
        if (!filters.type.includes(laptopType)) {
          return false;
        }
      }

      // Processor filter
      if (filters.processor.length > 0 && laptop.processor) {
        const processorType = laptop.processor.split(" ")[0];
        if (!filters.processor.some((p) => laptop.processor.includes(p))) {
          return false;
        }
      }

      // Price filter
      if (filters.price) {
        if (filters.price === "under1000" && laptop.price >= 1000) return false;
        if (
          filters.price === "1000to1500" &&
          (laptop.price < 1000 || laptop.price > 1500)
        )
          return false;
        if (
          filters.price === "1500to2000" &&
          (laptop.price < 1500 || laptop.price > 2000)
        )
          return false;
        if (filters.price === "over2000" && laptop.price <= 2000) return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort logic
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      // Default is "featured" or any other value (no specific sort)
      return 0;
    });

  // Infer laptop type from its properties if not explicitly set
  const inferTypeFromLaptop = (laptop) => {
    if (!laptop) return "Unknown";

    // Check for keywords in the name or description
    const nameAndDesc = (
      laptop.name +
      " " +
      (laptop.description || "")
    ).toLowerCase();

    if (nameAndDesc.includes("gaming")) return "Gaming";
    if (nameAndDesc.includes("2-in-1") || nameAndDesc.includes("convertible"))
      return "2-in-1";
    if (nameAndDesc.includes("ultrabook") || laptop.weight < 1.5)
      return "Ultrabook";
    if (nameAndDesc.includes("workstation")) return "Workstation";

    // Default
    return "Standard";
  };

  // Get unique brands, types, etc. for filter options
  const brands = [
    ...new Set(laptops.map((laptop) => laptop.brand).filter(Boolean)),
  ];

  // For types, collect explicit types or infer them
  const allTypes = laptops.map(
    (laptop) => laptop.type || inferTypeFromLaptop(laptop)
  );
  const types = [...new Set(allTypes.filter(Boolean))];

  // For processors, extract the manufacturer
  const processors = [
    ...new Set(
      laptops
        .filter((laptop) => laptop.processor)
        .map((laptop) => laptop.processor.split(" ")[0])
        .filter(Boolean)
    ),
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 mb-6 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-80 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-10 rounded-lg shadow text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Laptops
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Laptops</h1>
          <p className="mt-2 text-gray-600">
            Browse our selection of high-quality laptops for every need
          </p>
        </div>

        {/* Search & Sort Controls - Mobile */}
        <div className="md:hidden mb-6 flex flex-col space-y-4">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Search laptops"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Filters - Desktop */}
          <div
            className={`w-full md:w-64 mb-6 md:mb-0 md:mr-8 ${
              !showFilters && "hidden md:block"
            }`}
          >
            <div className="bg-white p-5 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-green-600 hover:text-green-500"
                >
                  Clear All
                </button>
              </div>

              {/* Filter sections */}
              <div className="space-y-6">
                {/* Brand Filter */}
                {brands.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Brand
                    </h3>
                    <div className="space-y-2">
                      {brands.map((brand) => (
                        <div key={brand} className="flex items-center">
                          <input
                            id={`brand-${brand}`}
                            name="brand"
                            type="checkbox"
                            checked={filters.brand.includes(brand)}
                            onChange={() => handleFilterChange("brand", brand)}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`brand-${brand}`}
                            className="ml-3 text-sm text-gray-600"
                          >
                            {brand}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Price Range
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="price-under1000"
                        name="price"
                        type="radio"
                        checked={filters.price === "under1000"}
                        onChange={() =>
                          handleFilterChange("price", "under1000")
                        }
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <label
                        htmlFor="price-under1000"
                        className="ml-3 text-sm text-gray-600"
                      >
                        Under $1,000
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="price-1000to1500"
                        name="price"
                        type="radio"
                        checked={filters.price === "1000to1500"}
                        onChange={() =>
                          handleFilterChange("price", "1000to1500")
                        }
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <label
                        htmlFor="price-1000to1500"
                        className="ml-3 text-sm text-gray-600"
                      >
                        $1,000 - $1,500
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="price-1500to2000"
                        name="price"
                        type="radio"
                        checked={filters.price === "1500to2000"}
                        onChange={() =>
                          handleFilterChange("price", "1500to2000")
                        }
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <label
                        htmlFor="price-1500to2000"
                        className="ml-3 text-sm text-gray-600"
                      >
                        $1,500 - $2,000
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="price-over2000"
                        name="price"
                        type="radio"
                        checked={filters.price === "over2000"}
                        onChange={() => handleFilterChange("price", "over2000")}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <label
                        htmlFor="price-over2000"
                        className="ml-3 text-sm text-gray-600"
                      >
                        Over $2,000
                      </label>
                    </div>
                  </div>
                </div>

                {/* Type Filter */}
                {types.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Type
                    </h3>
                    <div className="space-y-2">
                      {types.map((type) => (
                        <div key={type} className="flex items-center">
                          <input
                            id={`type-${type}`}
                            name="type"
                            type="checkbox"
                            checked={filters.type.includes(type)}
                            onChange={() => handleFilterChange("type", type)}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`type-${type}`}
                            className="ml-3 text-sm text-gray-600"
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Processor Filter */}
                {processors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Processor
                    </h3>
                    <div className="space-y-2">
                      {processors.map((processor) => (
                        <div key={processor} className="flex items-center">
                          <input
                            id={`processor-${processor}`}
                            name="processor"
                            type="checkbox"
                            checked={filters.processor.includes(processor)}
                            onChange={() =>
                              handleFilterChange("processor", processor)
                            }
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`processor-${processor}`}
                            className="ml-3 text-sm text-gray-600"
                          >
                            {processor}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Desktop search and sort */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <div className="relative rounded-md shadow-sm max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Search laptops"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                )}
              </div>

              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-2">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Laptops Grid */}
            {filteredLaptops.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLaptops.map((laptop) => (
                  <div
                    key={laptop._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          laptop.images && laptop.images.length > 0
                            ? laptop.images[0]
                            : "https://via.placeholder.com/300x200?text=No+Image"
                        }
                        alt={laptop.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <button
                        className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow hover:bg-gray-100"
                        onClick={() => toggleWishlist(laptop._id)}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            wishlist.includes(laptop._id)
                              ? "text-red-500"
                              : "text-gray-400 hover:text-red-500"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-green-600 truncate">
                        {laptop.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        {laptop.brand} •{" "}
                        {laptop.type || inferTypeFromLaptop(laptop)}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {laptop.processor && (
                          <div className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center">
                            <Cpu className="h-3 w-3 mr-1" />
                            {laptop.processor}
                          </div>
                        )}
                        {(laptop.ram || laptop.storage) && (
                          <div className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center">
                            <HardDrive className="h-3 w-3 mr-1" />
                            {laptop.ram}
                            {laptop.ram && laptop.storage ? "/" : ""}
                            {laptop.storage}
                          </div>
                        )}
                        {laptop.display && (
                          <div className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center">
                            <Monitor className="h-3 w-3 mr-1" />
                            {laptop.display}
                          </div>
                        )}
                        {laptop.battery && (
                          <div className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center">
                            <Battery className="h-3 w-3 mr-1" />
                            {laptop.battery}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xl font-bold text-gray-900">
                            ${laptop.price?.toFixed(2)}
                          </div>
                          {laptop.rating && (
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`h-4 w-4 ${
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
                              <span className="text-xs text-gray-500 ml-1">
                                ({laptop.numReviews || 0})
                              </span>
                            </div>
                          )}
                        </div>
                        <Link
                          to={`/order/${laptop._id}`}
                          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            laptop.isAvailable && laptop.stock > 0
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-gray-400 cursor-not-allowed"
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                          onClick={(e) => {
                            if (!laptop.isAvailable || laptop.stock <= 0) {
                              e.preventDefault();
                              toast.error("This laptop is out of stock");
                            }
                          }}
                        >
                          {laptop.isAvailable && laptop.stock > 0
                            ? "Order Now"
                            : "Out of Stock"}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-10 rounded-lg shadow text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No laptops found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Laptops;
