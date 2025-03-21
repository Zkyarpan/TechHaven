import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Save,
  X,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";

const LaptopForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    type: "",
    processor: "",
    ram: "",
    storage: "",
    graphics: "",
    display: "",
    resolution: "",
    battery: "",
    connectivity: "",
    ports: "",
    weight: "",
    dimensions: "",
    operatingSystem: "",
    color: "",
    price: "",
    stock: "",
    description: "",
    features: [""],
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  // Predefined options for selects
  const brands = [
    "Apple",
    "Dell",
    "HP",
    "Lenovo",
    "ASUS",
    "Acer",
    "Microsoft",
    "Razer",
    "MSI",
    "Samsung",
  ];
  const types = [
    "Ultrabook",
    "2-in-1",
    "Gaming",
    "Budget",
    "Business",
    "Chromebook",
    "Workstation",
  ];
  const osOptions = [
    "Windows 11",
    "Windows 10",
    "macOS",
    "Chrome OS",
    "Linux",
    "Ubuntu",
  ];

  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      // Simulate API fetch for laptop data
      setTimeout(() => {
        // Mock data for an existing laptop (in a real app, you'd fetch from API)
        const mockLaptop = {
          id: parseInt(id),
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
          operatingSystem: "macOS",
          color: "Space Gray",
          price: 1999.99,
          stock: 15,
          description:
            "Experience the extraordinary power and efficiency of Apple's most advanced laptop. The MacBook Pro with M3 chip offers unprecedented performance and battery life in a sleek, portable design. Perfect for professionals, creatives, and anyone who demands the best.",
          features: [
            "Apple M3 chip for exceptional performance",
            "Up to 20 hours of battery life",
            "Stunning Retina display with high brightness",
            "Advanced camera and audio system",
            "Thunderbolt ports for high-speed connectivity",
          ],
          images: [
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1026&q=80",
            "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
          ],
        };

        setFormData({
          ...mockLaptop,
          price: mockLaptop.price.toString(),
          stock: mockLaptop.stock.toString(),
        });
        setPreviewImages(mockLaptop.images);
        setIsLoading(false);
      }, 1000);
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData({
      ...formData,
      features: updatedFeatures,
    });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ""],
    });
  };

  const removeFeature = (index) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData({
      ...formData,
      features: updatedFeatures,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);

    // Create preview URLs for the new images
    const newPreviewImages = files.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviewImages]);
  };

  const removeImage = (index) => {
    // Remove from both arrays
    const updatedImages = [...images];
    const updatedPreviews = [...previewImages];

    // Revoke object URL to avoid memory leaks
    if (index < images.length) {
      updatedImages.splice(index, 1);
      setImages(updatedImages);
    } else {
      // If it's from the previewImages (from server)
      const previewIndex = index - images.length;
      updatedPreviews.splice(previewIndex, 1);
    }

    setPreviewImages(updatedPreviews);
  };

  const validate = () => {
    const newErrors = {};

    // Required fields
    const requiredFields = [
      "name",
      "brand",
      "type",
      "processor",
      "ram",
      "storage",
      "display",
      "price",
      "stock",
    ];
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // Price must be a valid number
    if (
      formData.price &&
      (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0)
    ) {
      newErrors.price = "Price must be a valid positive number";
    }

    // Stock must be a valid integer
    if (
      formData.stock &&
      (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0)
    ) {
      newErrors.stock = "Stock must be a valid non-negative integer";
    }

    // At least one feature required
    if (!formData.features.some((feature) => feature.trim() !== "")) {
      newErrors.features = "Add at least one feature";
    }

    // At least one image required
    if (images.length === 0 && previewImages.length === 0) {
      newErrors.images = "Add at least one image";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      // Scroll to first error
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success message based on mode
      setSuccess(
        isEditMode
          ? "Laptop updated successfully!"
          : "New laptop added successfully!"
      );

      // Wait a moment to show success message, then redirect
      setTimeout(() => {
        navigate("/admin/laptops");
      }, 1500);
    } catch (error) {
      setErrors({ submit: "Failed to save laptop. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-5"></div>
          <div className="h-96 bg-gray-200 rounded mb-5"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between">
        <div>
          <Link
            to="/admin/laptops"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Laptops
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? "Edit Laptop" : "Add New Laptop"}
          </h1>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Success Alert */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {errors.submit && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errors.submit}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Laptop Name<span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.name ? "border-red-300" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 error-message">
                      {errors.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium text-gray-700"
                >
                  Brand<span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <select
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.brand ? "border-red-300" : ""
                    }`}
                  >
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                  {errors.brand && (
                    <p className="mt-1 text-sm text-red-600 error-message">
                      {errors.brand}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Type<span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.type ? "border-red-300" : ""
                    }`}
                  >
                    <option value="">Select Type</option>
                    {types.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600 error-message">
                      {errors.type}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-gray-700"
                >
                  Color
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price ($)<span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.price ? "border-red-300" : ""
                    }`}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600 error-message">
                      {errors.price}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700"
                >
                  Stock<span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.stock ? "border-red-300" : ""
                    }`}
                  />
                  {errors.stock && (
                    <p className="mt-1 text-sm text-red-600 error-message">
                      {errors.stock}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Technical Specifications
            </h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="processor"
                  className="block text-sm font-medium text-gray-700"
                >
                  Processor<span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="processor"
                    name="processor"
                    value={formData.processor}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.processor ? "border-red-300" : ""
                    }`}
                  />
                  {errors.processor && (
                    <p className="mt-1 text-sm text-red-600 error-message">
                      {errors.processor}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="graphics"
                  className="block text-sm font-medium text-gray-700"
                >
                  Graphics
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="graphics"
                    name="graphics"
                    value={formData.graphics}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="ram"
                  className="block text-sm font-medium text-gray-700"
                >
                  RAM<span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="ram"
                    name="ram"
                    value={formData.ram}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.ram ? "border-red-300" : ""
                    }`}
                  />
                  {errors.ram && (
                    <p className="mt-1 text-sm text-red-600 error-message">
                      {errors.ram}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="storage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Storage<span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="storage"
                    name="storage"
                    value={formData.storage}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.storage ? "border-red-300" : ""
                    }`}
                  />
                  {errors.storage && (
                    <p className="mt-1 text-sm text-red-600 error-message">
                      {errors.storage}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="display"
                  className="block text-sm font-medium text-gray-700"
                >
                  Display<span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="display"
                    name="display"
                    value={formData.display}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.display ? "border-red-300" : ""
                    }`}
                  />
                  {errors.display && (
                    <p className="mt-1 text-sm text-red-600 error-message">
                      {errors.display}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="resolution"
                  className="block text-sm font-medium text-gray-700"
                >
                  Resolution
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="resolution"
                    name="resolution"
                    value={formData.resolution}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="battery"
                  className="block text-sm font-medium text-gray-700"
                >
                  Battery Life
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="battery"
                    name="battery"
                    value={formData.battery}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="connectivity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Connectivity
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="connectivity"
                    name="connectivity"
                    value={formData.connectivity}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="ports"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ports
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="ports"
                    name="ports"
                    value={formData.ports}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="operatingSystem"
                  className="block text-sm font-medium text-gray-700"
                >
                  Operating System
                </label>
                <div className="mt-1">
                  <select
                    id="operatingSystem"
                    name="operatingSystem"
                    value={formData.operatingSystem}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Select OS</option>
                    {osOptions.map((os) => (
                      <option key={os} value={os}>
                        {os}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium text-gray-700"
                >
                  Weight
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="dimensions"
                  className="block text-sm font-medium text-gray-700"
                >
                  Dimensions
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="dimensions"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Description & Features
            </h2>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Write a detailed description of the laptop.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    Key Features<span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-1 space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) =>
                          handleFeatureChange(index, e.target.value)
                        }
                        className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder={`Feature ${index + 1}`}
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="ml-2 p-1 rounded-full text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {errors.features && (
                  <p className="mt-1 text-sm text-red-600 error-message">
                    {errors.features}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Images</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Laptop Images<span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mb-4">
                {/* Image Previews */}
                {previewImages.map((preview, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden h-32 bg-gray-100"
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-white shadow hover:bg-gray-100"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                ))}

                {/* Upload Button */}
                <div className="relative rounded-lg border-2 border-dashed border-gray-300 h-32 flex justify-center items-center hover:border-orange-500">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="image-upload"
                        className="relative cursor-pointer rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"
                      >
                        <span>Upload images</span>
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {errors.images && (
                <p className="mt-1 text-sm text-red-600 error-message">
                  {errors.images}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Upload high-quality images of the laptop from different angles.
                First image will be the main product image.
              </p>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/laptops")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? (
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
                  {isEditMode ? "Updating..." : "Saving..."}
                </>
              ) : (
                <>{isEditMode ? "Update Laptop" : "Save Laptop"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LaptopForm;
