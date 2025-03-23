import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  X,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  Cpu,
  HardDrive,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Check,
} from "lucide-react";
import apiService from "../utils/apiService";
import { toast } from "sonner";

// Constants
const BACKEND_URL = "http://localhost:5000"; // Update if your backend is on a different URL
const PLACEHOLDER_IMAGE = "./placeholder.jpg";

const LaptopManagement = () => {
  const [laptops, setLaptops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Function to safely get the full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER_IMAGE;

    // Check if it's already an absolute URL
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // If it's a relative path, prepend the backend URL
    return `${BACKEND_URL}${imagePath}`;
  };

  // Fetch laptops from API
  useEffect(() => {
    const fetchLaptops = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Prepare query parameters
        const params = {
          page: currentPage,
          limit,
        };

        // Only add filters that are actually set
        if (searchTerm) params.search = searchTerm;
        if (selectedBrands.length === 1) params.brand = selectedBrands[0];
        if (selectedTypes.length === 1) params.type = selectedTypes[0];

        // Sort parameter based on sortBy
        switch (sortBy) {
          case "newest":
            params.sort = "-createdAt";
            break;
          case "oldest":
            params.sort = "createdAt";
            break;
          case "name":
            params.sort = "name";
            break;
          case "price-low":
            params.sort = "price";
            break;
          case "price-high":
            params.sort = "-price";
            break;
          case "stock-low":
            params.sort = "stock";
            break;
          case "stock-high":
            params.sort = "-stock";
            break;
          default:
            params.sort = "-createdAt";
        }

        console.log("Fetching laptops with params:", params);

        const response = await apiService.getLaptops(params);
        console.log("API Response:", response);

        // Process the API response
        if (response && Array.isArray(response.data)) {
          let filteredData = response.data;

          // Client-side filtering for price range (since API might not support it)
          if (priceRange.min) {
            filteredData = filteredData.filter(
              (laptop) => laptop.price >= parseFloat(priceRange.min)
            );
          }
          if (priceRange.max) {
            filteredData = filteredData.filter(
              (laptop) => laptop.price <= parseFloat(priceRange.max)
            );
          }

          // Client-side filtering for multiple brands/types (if API doesn't support it)
          if (selectedBrands.length > 1) {
            filteredData = filteredData.filter((laptop) =>
              selectedBrands.includes(laptop.brand)
            );
          }
          if (selectedTypes.length > 1) {
            filteredData = filteredData.filter((laptop) =>
              selectedTypes.includes(laptop.type)
            );
          }

          setLaptops(filteredData);
          setTotalPages(
            Math.ceil((response.total || response.count || 0) / limit)
          );
          setTotalCount(response.total || response.count || 0);

          // Clear selected items when data changes
          setSelectedItems([]);
        } else {
          console.error("Unexpected API response format:", response);
          setLaptops([]);
          setTotalPages(1);
          setTotalCount(0);
        }
      } catch (err) {
        console.error("Error fetching laptops:", err);
        setError("Failed to load laptops. Please try again.");
        setLaptops([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLaptops();
  }, [
    currentPage,
    limit,
    searchTerm,
    selectedBrands,
    selectedTypes,
    sortBy,
    priceRange,
    deleteSuccess,
  ]);

  // Extract unique brands and types for filters
  const brands = [...new Set(laptops.map((laptop) => laptop.brand))];
  const types = [...new Set(laptops.map((laptop) => laptop.type))];

  const handleBrandFilter = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleTypeFilter = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBrands([]);
    setSelectedTypes([]);
    setPriceRange({ min: "", max: "" });
    setCurrentPage(1);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(laptops.map((laptop) => laptop._id || laptop.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleDeletePrompt = (id) => {
    setItemToDelete(id);
    setConfirmDelete(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      if (itemToDelete) {
        // Single item delete
        await apiService.deleteLaptop(itemToDelete);
        setLaptops(
          laptops.filter((laptop) => (laptop._id || laptop.id) !== itemToDelete)
        );
        toast.success("Laptop deleted successfully");
      } else if (selectedItems.length > 0) {
        // Bulk delete - assuming your API supports this
        // If not, you'll need to loop through and delete one by one
        for (const id of selectedItems) {
          await apiService.deleteLaptop(id);
        }
        setLaptops(
          laptops.filter(
            (laptop) => !selectedItems.includes(laptop._id || laptop.id)
          )
        );
        toast.success(`${selectedItems.length} laptops deleted successfully`);
        setSelectedItems([]);
      }
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 3000);
    } catch (err) {
      console.error("Error deleting laptop(s):", err);
      setError("Failed to delete laptop(s). Please try again.");
      toast.error("Failed to delete laptop(s)");
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(false);
    setItemToDelete(null);
  };

  // Export function (placeholder)
  const handleExport = () => {
    toast.info("Export functionality would go here");
    // In a real implementation, you would generate a CSV or Excel file
  };

  if (isLoading && !laptops.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-5"></div>
          <div className="h-12 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Laptops</h1>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/admin/laptops/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Laptop
          </Link>
        </div>
      </div>

      {/* Success message */}
      {deleteSuccess && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                {itemToDelete
                  ? "Laptop was successfully deleted."
                  : "Selected laptops were successfully deleted."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
          {/* Search */}
          <div className="max-w-lg w-full">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Search laptops by name or brand..."
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
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="stock-low">Stock: Low to High</option>
                  <option value="stock-high">Stock: High to Low</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 pb-4 border-b border-gray-200">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Brands</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center">
                    <input
                      id={`brand-${brand}`}
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandFilter(brand)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`brand-${brand}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Types</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {types.map((type) => (
                  <div key={type} className="flex items-center">
                    <input
                      id={`type-${type}`}
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeFilter(type)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`type-${type}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Price Range
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="min-price" className="sr-only">
                    Minimum Price
                  </label>
                  <input
                    type="number"
                    id="min-price"
                    placeholder="Min $"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, min: e.target.value })
                    }
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="max-price" className="sr-only">
                    Maximum Price
                  </label>
                  <input
                    type="number"
                    id="max-price"
                    placeholder="Max $"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, max: e.target.value })
                    }
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                </div>
              </div>
              <button
                onClick={clearFilters}
                className="mt-3 w-full inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="mt-4 flex items-center justify-between px-4 py-3 bg-orange-50 rounded-md">
            <div className="text-sm text-orange-700">
              <strong>{selectedItems.length}</strong> items selected
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Selected
              </button>
              <button
                onClick={handleExport}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-1" />
                Export Selected
              </button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-500">
          Showing {laptops.length} of {totalCount} laptops
          {(selectedBrands.length > 0 ||
            selectedTypes.length > 0 ||
            priceRange.min ||
            priceRange.max ||
            searchTerm) && <span> with applied filters</span>}
        </div>
      </div>

      {/* Laptops Grid */}
      {laptops.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
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
                        selectedItems.length === laptops.length &&
                        laptops.length > 0
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
                  Laptop
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Specs
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Stock
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Updated
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
              {laptops.map((laptop) => (
                <tr key={laptop._id || laptop.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(
                          laptop._id || laptop.id
                        )}
                        onChange={() =>
                          handleSelectItem(laptop._id || laptop.id)
                        }
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-md object-cover"
                          src={
                            laptop.images && laptop.images.length > 0
                              ? getImageUrl(laptop.images[0])
                              : PLACEHOLDER_IMAGE
                          }
                          alt={laptop.name}
                          onError={(e) => {
                            console.error("Image load error:", e.target.src);
                            e.target.src = PLACEHOLDER_IMAGE;
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {laptop.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {laptop.brand} • {laptop.type}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Cpu className="h-4 w-4 text-gray-400 mr-1" />
                      {laptop.processor || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <HardDrive className="h-4 w-4 text-gray-400 mr-1" />
                      {laptop.ram || "N/A"} • {laptop.storage || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${laptop.price ? laptop.price.toFixed(2) : "0.00"}
                    </div>
                    {laptop.discountPrice && (
                      <div className="text-sm line-through text-gray-500">
                        ${laptop.discountPrice.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm font-medium ${
                        laptop.stock <= 5 ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {laptop.stock || 0} units
                      {laptop.stock <= 5 && (
                        <div className="mt-1 flex items-center">
                          <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                          <span className="text-xs">Low stock</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {laptop.updatedAt
                      ? new Date(laptop.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/order/${laptop._id || laptop.id}`}
                        className="text-gray-600 hover:text-gray-900"
                        title="View Laptop"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/admin/laptops/edit/${laptop._id || laptop.id}`}
                        className="text-orange-600 hover:text-orange-900"
                        title="Edit Laptop"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() =>
                          handleDeletePrompt(laptop._id || laptop.id)
                        }
                        className="text-red-600 hover:text-red-900"
                        title="Delete Laptop"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-8 text-center rounded-lg shadow">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No laptops found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ||
            selectedBrands.length > 0 ||
            selectedTypes.length > 0 ||
            priceRange.min ||
            priceRange.max ? (
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
              <>
                Get started by adding a new laptop.
                <Link
                  to="/admin/laptops/new"
                  className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Laptop
                </Link>
              </>
            )}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing {laptops.length > 0 ? (currentPage - 1) * limit + 1 : 0}{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * limit, totalCount)}
                </span>{" "}
                of <span className="font-medium">{totalCount}</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Show limited page numbers with ellipsis for large page counts */}
                {[...Array(totalPages)].map((_, i) => {
                  // Always show first, last, and pages around current
                  const pageIndex = i + 1;
                  const show =
                    pageIndex === 1 ||
                    pageIndex === totalPages ||
                    (pageIndex >= currentPage - 1 &&
                      pageIndex <= currentPage + 1);

                  // Show ellipsis instead of distant pages
                  if (!show) {
                    // Show ellipsis only once for each gap
                    if (pageIndex === 2 || pageIndex === totalPages - 1) {
                      return (
                        <span
                          key={i}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageIndex)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        currentPage === pageIndex
                          ? "z-10 bg-orange-50 border-orange-500 text-orange-600"
                          : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                      } text-sm font-medium`}
                    >
                      {pageIndex}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {itemToDelete
                        ? "Delete Laptop"
                        : "Delete Selected Laptops"}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {itemToDelete
                          ? "Are you sure you want to delete this laptop? This action cannot be undone."
                          : `Are you sure you want to delete ${selectedItems.length} selected laptops? This action cannot be undone.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCancel}
                  disabled={isDeleting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaptopManagement;
