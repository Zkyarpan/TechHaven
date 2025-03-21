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
} from "lucide-react";

const LaptopManagement = () => {
  const [laptops, setLaptops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      // Mock data - in a real app, this would come from an API
      const mockLaptops = [
        {
          id: 1,
          name: "MacBook Pro M3",
          brand: "Apple",
          type: "Ultrabook",
          processor: "Apple M3",
          ram: "16GB",
          storage: "512GB SSD",
          price: 1999.99,
          stock: 15,
          createdAt: "2025-01-15T10:30:00Z",
          updatedAt: "2025-03-01T14:22:00Z",
          image:
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
        },
        {
          id: 2,
          name: "Dell XPS 13",
          brand: "Dell",
          type: "Ultrabook",
          processor: "Intel i7",
          ram: "16GB",
          storage: "1TB SSD",
          price: 1499.99,
          stock: 8,
          createdAt: "2025-01-20T09:15:00Z",
          updatedAt: "2025-02-28T11:45:00Z",
          image:
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
        },
        {
          id: 3,
          name: "Lenovo Legion 5",
          brand: "Lenovo",
          type: "Gaming",
          processor: "AMD Ryzen 7",
          ram: "32GB",
          storage: "1TB SSD",
          price: 1299.99,
          stock: 6,
          createdAt: "2025-02-05T14:20:00Z",
          updatedAt: "2025-03-10T16:30:00Z",
          image:
            "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
        },
        {
          id: 4,
          name: "HP Spectre x360",
          brand: "HP",
          type: "2-in-1",
          processor: "Intel i7",
          ram: "16GB",
          storage: "512GB SSD",
          price: 1399.99,
          stock: 10,
          createdAt: "2025-02-10T11:10:00Z",
          updatedAt: "2025-03-05T13:25:00Z",
          image:
            "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
        },
        {
          id: 5,
          name: "ASUS ROG Zephyrus G14",
          brand: "ASUS",
          type: "Gaming",
          processor: "AMD Ryzen 9",
          ram: "32GB",
          storage: "1TB SSD",
          price: 1799.99,
          stock: 4,
          createdAt: "2025-02-15T16:40:00Z",
          updatedAt: "2025-03-12T09:50:00Z",
          image:
            "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
        },
        {
          id: 6,
          name: "Apple MacBook Air M2",
          brand: "Apple",
          type: "Ultrabook",
          processor: "Apple M2",
          ram: "8GB",
          storage: "256GB SSD",
          price: 1199.99,
          stock: 2,
          createdAt: "2025-01-25T13:45:00Z",
          updatedAt: "2025-03-02T10:15:00Z",
          image:
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
        },
        {
          id: 7,
          name: "Microsoft Surface Laptop 5",
          brand: "Microsoft",
          type: "Ultrabook",
          processor: "Intel i5",
          ram: "16GB",
          storage: "512GB SSD",
          price: 1299.99,
          stock: 7,
          createdAt: "2025-02-18T10:20:00Z",
          updatedAt: "2025-03-08T16:10:00Z",
          image:
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
        },
        {
          id: 8,
          name: "Razer Blade 15",
          brand: "Razer",
          type: "Gaming",
          processor: "Intel i7",
          ram: "16GB",
          storage: "1TB SSD",
          price: 1699.99,
          stock: 3,
          createdAt: "2025-02-22T15:30:00Z",
          updatedAt: "2025-03-15T11:20:00Z",
          image:
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
        },
      ];

      setLaptops(mockLaptops);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Extract unique brands and types for filters
  const brands = [...new Set(laptops.map((laptop) => laptop.brand))];
  const types = [...new Set(laptops.map((laptop) => laptop.type))];

  const handleBrandFilter = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const handleTypeFilter = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBrands([]);
    setSelectedTypes([]);
    setPriceRange({ min: "", max: "" });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(filteredLaptops.map((laptop) => laptop.id));
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

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      // Single item delete
      setLaptops(laptops.filter((laptop) => laptop.id !== itemToDelete));
    } else if (selectedItems.length > 0) {
      // Bulk delete
      setLaptops(
        laptops.filter((laptop) => !selectedItems.includes(laptop.id))
      );
      setSelectedItems([]);
    }
    setConfirmDelete(false);
    setItemToDelete(null);
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(false);
    setItemToDelete(null);
  };

  // Apply all filters and sorting
  const filteredLaptops = laptops
    .filter((laptop) => {
      // Search filter
      if (
        searchTerm &&
        !laptop.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !laptop.brand.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(laptop.brand)) {
        return false;
      }

      // Type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(laptop.type)) {
        return false;
      }

      // Price range filter
      if (priceRange.min && laptop.price < parseFloat(priceRange.min)) {
        return false;
      }
      if (priceRange.max && laptop.price > parseFloat(priceRange.max)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort based on selected option
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "stock-low":
          return a.stock - b.stock;
        case "stock-high":
          return b.stock - a.stock;
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
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
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
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
              <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4 mr-1" />
                Export Selected
              </button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredLaptops.length} of {laptops.length} laptops
          {(selectedBrands.length > 0 ||
            selectedTypes.length > 0 ||
            priceRange.min ||
            priceRange.max ||
            searchTerm) && <span> with applied filters</span>}
        </div>
      </div>

      {/* Laptops Grid */}
      {filteredLaptops.length > 0 ? (
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
                        selectedItems.length === filteredLaptops.length &&
                        filteredLaptops.length > 0
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
              {filteredLaptops.map((laptop) => (
                <tr key={laptop.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(laptop.id)}
                        onChange={() => handleSelectItem(laptop.id)}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-md object-cover"
                          src={laptop.image}
                          alt={laptop.name}
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
                      {laptop.processor}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <HardDrive className="h-4 w-4 text-gray-400 mr-1" />
                      {laptop.ram} • {laptop.storage}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${laptop.price.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm font-medium ${
                        laptop.stock <= 5 ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {laptop.stock} units
                      {laptop.stock <= 5 && (
                        <div className="mt-1 flex items-center">
                          <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                          <span className="text-xs">Low stock</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(laptop.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/order/${laptop.id}`}
                        className="text-gray-600 hover:text-gray-900"
                        title="View Laptop"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/admin/laptops/edit/${laptop.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Laptop"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDeletePrompt(laptop.id)}
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
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCancel}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
