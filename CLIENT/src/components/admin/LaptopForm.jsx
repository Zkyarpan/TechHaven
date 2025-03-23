import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "../utils/apiService";
import { toast } from "sonner";

const LaptopForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [laptop, setLaptop] = useState({
    name: "",
    brand: "",
    description: "",
    processor: "",
    ram: "",
    storage: "",
    display: "",
    graphics: "",
    battery: "",
    connectivity: "",
    price: "",
    stock: 10, // Set a default stock of 10 units
    isAvailable: true, // Default to available
    features: [""],
    images: [],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrls, setPreviewUrls] = useState([]);

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      fetchLaptopData();
    }
  }, [id]);

  const fetchLaptopData = async () => {
    setLoading(true);
    try {
      const data = await apiService.getLaptopById(id);
      // Make sure stock has a value of at least 1 for existing laptops
      const stockValue = data.stock || 0;
      setLaptop({
        ...data,
        stock: stockValue,
        isAvailable: stockValue > 0,
        features: data.features?.length ? data.features : [""],
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching laptop:", err);
      setError("Failed to load laptop data. Please try again.");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Special handling for price and stock - ensure they are numbers
    if (name === "price" || name === "stock") {
      const numericValue = value === "" ? "" : Number(value);
      setLaptop({ ...laptop, [name]: numericValue });

      // If stock is changed, automatically update isAvailable
      if (name === "stock") {
        setLaptop((prevState) => ({
          ...prevState,
          [name]: numericValue,
          isAvailable: numericValue > 0,
        }));
      }
    } else if (type === "checkbox") {
      setLaptop({ ...laptop, [name]: checked });
    } else {
      setLaptop({ ...laptop, [name]: value });
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...laptop.features];
    newFeatures[index] = value;
    setLaptop({ ...laptop, features: newFeatures });
  };

  const addFeatureField = () => {
    setLaptop({ ...laptop, features: [...laptop.features, ""] });
  };

  const removeFeatureField = (index) => {
    const newFeatures = laptop.features.filter((_, i) => i !== index);
    setLaptop({ ...laptop, features: newFeatures.length ? newFeatures : [""] });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles([...imageFiles, ...files]);

    // Generate preview URLs
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const removeImage = (index) => {
    // For preview images
    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);

    // For file uploads
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);
  };

  const removeExistingImage = (imageUrl) => {
    setLaptop({
      ...laptop,
      images: laptop.images.filter((img) => img !== imageUrl),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form data
      if (!laptop.name || !laptop.brand || !laptop.price) {
        throw new Error(
          "Please fill out all required fields: Name, Brand, and Price"
        );
      }

      // Ensure price and stock are positive numbers
      if (laptop.price <= 0) {
        throw new Error("Price must be greater than zero");
      }

      if (laptop.stock < 0) {
        throw new Error("Stock cannot be negative");
      }

      // Filter out empty features
      const cleanedFeatures = laptop.features.filter((f) => f.trim() !== "");

      // Prepare data
      const formData = {
        ...laptop,
        features: cleanedFeatures,
        // Set isAvailable based on stock
        isAvailable: Number(laptop.stock) > 0,
      };

      let result;

      if (isEditMode) {
        // Update
        if (imageFiles.length > 0) {
          result = await apiService.updateLaptopWithImages(
            id,
            formData,
            imageFiles
          );
        } else {
          result = await apiService.updateLaptop(id, formData);
        }
        toast.success("Laptop updated successfully!");
      } else {
        // Create
        if (imageFiles.length > 0) {
          result = await apiService.createLaptopWithImages(
            formData,
            imageFiles
          );
        } else {
          result = await apiService.createLaptop(formData);
        }
        toast.success("Laptop created successfully!");
      }

      navigate("/admin/laptops");
    } catch (err) {
      console.error("Error saving laptop:", err);
      setError(err.message || "Failed to save laptop. Please try again.");
      toast.error(err.message || "Failed to save laptop");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditMode ? "Edit Laptop" : "Add New Laptop"}
      </h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">
              Basic Information
            </h2>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={laptop.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="brand"
                className="block text-sm font-medium text-gray-700"
              >
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={laptop.brand}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={laptop.price}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700"
              >
                Stock (Quantity) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={laptop.stock}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Current availability:{" "}
                {laptop.isAvailable ? "In Stock" : "Out of Stock"}
              </p>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={laptop.description}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">
              Technical Specifications
            </h2>

            <div>
              <label
                htmlFor="processor"
                className="block text-sm font-medium text-gray-700"
              >
                Processor
              </label>
              <input
                type="text"
                id="processor"
                name="processor"
                value={laptop.processor}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="ram"
                className="block text-sm font-medium text-gray-700"
              >
                RAM
              </label>
              <input
                type="text"
                id="ram"
                name="ram"
                value={laptop.ram}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="e.g., 16GB DDR4"
              />
            </div>

            <div>
              <label
                htmlFor="storage"
                className="block text-sm font-medium text-gray-700"
              >
                Storage
              </label>
              <input
                type="text"
                id="storage"
                name="storage"
                value={laptop.storage}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="e.g., 512GB SSD"
              />
            </div>

            <div>
              <label
                htmlFor="display"
                className="block text-sm font-medium text-gray-700"
              >
                Display
              </label>
              <input
                type="text"
                id="display"
                name="display"
                value={laptop.display}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="e.g., 15.6-inch Full HD"
              />
            </div>

            <div>
              <label
                htmlFor="graphics"
                className="block text-sm font-medium text-gray-700"
              >
                Graphics
              </label>
              <input
                type="text"
                id="graphics"
                name="graphics"
                value={laptop.graphics}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="e.g., NVIDIA GeForce RTX 3050"
              />
            </div>

            <div>
              <label
                htmlFor="battery"
                className="block text-sm font-medium text-gray-700"
              >
                Battery
              </label>
              <input
                type="text"
                id="battery"
                name="battery"
                value={laptop.battery}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="e.g., Up to 10 hours"
              />
            </div>

            <div>
              <label
                htmlFor="connectivity"
                className="block text-sm font-medium text-gray-700"
              >
                Connectivity
              </label>
              <input
                type="text"
                id="connectivity"
                name="connectivity"
                value={laptop.connectivity}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="e.g., Wi-Fi 6, Bluetooth 5.0"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Key Features
          </h2>

          <div className="space-y-2">
            {laptop.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Enter feature"
                />
                <button
                  type="button"
                  onClick={() => removeFeatureField(index)}
                  className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addFeatureField}
            className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg
              className="h-4 w-4 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Feature
          </button>
        </div>

        {/* Images */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Product Images
          </h2>

          {/* Existing Images */}
          {laptop.images && laptop.images.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Current Images
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {laptop.images.map((img, index) => (
                  <div key={index} className="relative">
                    <div className="h-24 w-24 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={img}
                        alt={`Product ${index}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img)}
                      className="absolute -top-2 -right-2 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                    >
                      <svg
                        className="h-3 w-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Image Previews */}
          {previewUrls.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                New Images
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <div className="h-24 w-24 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={url}
                        alt={`New ${index}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                    >
                      <svg
                        className="h-3 w-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="images"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                >
                  <span>Upload images</span>
                  <input
                    id="images"
                    name="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/admin/laptops")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Saving...
              </>
            ) : (
              "Save Laptop"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LaptopForm;
