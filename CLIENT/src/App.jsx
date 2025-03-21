import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";

// Auth Components
import Login from "./components/Login";
import Register from "./components/Register";

// Admin Components
import AdminDashboard from "./components/admin/AdminDashboard";
import LaptopManagement from "./components/admin/LaptopManagement";
import OrderManagement from "./components/admin/OrderManagement";

// User Components
import UserDashboard from "./components/users/UserDashboard"; // User dashboard
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Laptops from "./components/users/Laptops";
import Order from "./components/users/Order";
import Orders from "./components/users/Orders";
import OrderDetails from "./components/users/OrderDetails";
import { Toaster } from "sonner";

// Route Protection
import {
  ProtectedRoute,
  AdminRoute,
} from "./components/routing/ProtectedRoute";
import LaptopForm from "./components/admin/LaptopForm";
import AboutUs from "./components/AboutUs";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Toaster
            position="top-right"
            richColors
            expand={false}
            offset="16px"
            duration={3000}
          />
          <ErrorBoundary>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<AboutUs />} />
                <Route path="/laptops" element={<Laptops />} />

              {/* Protected User Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/order/:laptopId" element={<Order />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/order-details/:id" element={<OrderDetails />} />
              </Route>

              {/* Protected Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/laptops" element={<LaptopManagement />} />
                <Route path="/admin/orders" element={<OrderManagement />} />
                <Route path="/admin/laptops/new" element={<LaptopForm />} />
                <Route
                  path="/admin/laptops/edit/:id"
                  element={<LaptopForm />}
                />
              </Route>

              {/* Fallback Routes */}
              <Route
                path="/unauthorized"
                element={
                  <div className="container mx-auto px-4 py-8">
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                      <h1 className="text-xl font-bold">Unauthorized Access</h1>
                      <p>You don't have permission to access this page.</p>
                    </div>
                  </div>
                }
              />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
          </ErrorBoundary>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
