import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Protected Route for authenticated users only
export const ProtectedRoute = () => {
  const { auth } = useContext(AuthContext);

  // If loading, show a simple loading screen
  if (auth.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-center text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login page
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

// Admin Route for admin users only
export const AdminRoute = () => {
  const { auth } = useContext(AuthContext);

  // If loading, show a simple loading screen
  if (auth.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-center text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login page
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If not admin, redirect to unauthorized page
  if (auth.user?.role?.toLowerCase() !== "admin") {
    return <Navigate to="/unauthorized" />;
  }

  // If admin, render the child routes
  return <Outlet />;
};
