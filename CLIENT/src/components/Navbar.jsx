import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const Navbar = () => {
  // Get the context properly with defensive coding
  const context = useContext(AuthContext);
  // Using optional chaining and default values to prevent errors
  const { auth = { isAuthenticated: false, user: null }, logout = () => {} } =
    context || {};

  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if user is admin
  const isAdmin = auth?.user?.role?.toLowerCase() === "admin";

  // Check if current page is an admin page
  const isAdminPage = location.pathname.startsWith("/admin");

  // Debug auth state
  useEffect(() => {
    console.log(
      "Auth state in Navbar:",
      auth,
      "Is Admin:",
      isAdmin,
      "Is Admin Page:",
      isAdminPage
    );
  }, [auth, isAdmin, location]);

  const handleLogout = () => {
    console.log("Logging out...");
    logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Helper function to determine if a link is active
  const isActive = (path) => {
    if (location.pathname === path) return true;
    if (path !== "/" && location.pathname.startsWith(path + "/")) return true;
    return false;
  };

  const getActiveClass = (path) => {
    return isActive(path)
      ? "border-green-500 text-gray-900"
      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700";
  };

  const getAdminActiveClass = (path) => {
    return isActive(path)
      ? "border-orange-500 text-orange-900"
      : "border-transparent text-orange-500 hover:border-orange-300 hover:text-orange-700";
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-green-600">
                TechHaven
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {/* Show different navigation based on context */}
              {isAdminPage ? (
                /* Admin Navigation */
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`${getAdminActiveClass(
                      "/admin/dashboard"
                    )} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/admin/laptops"
                    className={`${getAdminActiveClass(
                      "/admin/laptops"
                    )} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Manage Laptops
                  </Link>
                  <Link
                    to="/admin/orders"
                    className={`${getAdminActiveClass(
                      "/admin/orders"
                    )} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Manage Orders
                  </Link>

                  {/* Link back to user area */}
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                    ← Store Front
                  </Link>
                </>
              ) : (
                /* User Navigation */
                <>
                  <Link
                    to="/"
                    className={`${getActiveClass(
                      "/"
                    )} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Home
                  </Link>

                  {auth?.isAuthenticated && (
                    <>
                      <Link
                        to="/dashboard"
                        className={`${getActiveClass(
                          "/dashboard"
                        )} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                      >
                        My Account
                      </Link>
                      <Link
                        to="/laptops"
                        className={`${getActiveClass(
                          "/laptops"
                        )} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                      >
                        Laptops
                      </Link>
                      <Link
                        to="/orders"
                        className={`${getActiveClass(
                          "/orders"
                        )} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                      >
                        My Orders
                      </Link>

                      {/* Admin link to switch context */}
                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-orange-600 hover:border-orange-300 hover:text-orange-700"
                        >
                          Admin Area →
                        </Link>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {auth?.isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 flex items-center">
                  Hi, {auth.user?.name || "User"}
                  {isAdmin && (
                    <span className="ml-1 px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-3 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-5 py-3 border border-transparent font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {isAdminPage ? (
              /* Admin Mobile Navigation */
              <>
                <Link
                  to="/admin/dashboard"
                  className={`block pl-3 pr-4 py-2 border-l-4 ${
                    isActive("/admin/dashboard")
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-transparent text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin/laptops"
                  className={`block pl-3 pr-4 py-2 border-l-4 ${
                    isActive("/admin/laptops")
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-transparent text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Manage Laptops
                </Link>
                <Link
                  to="/admin/orders"
                  className={`block pl-3 pr-4 py-2 border-l-4 ${
                    isActive("/admin/orders")
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-transparent text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Manage Orders
                </Link>
                <Link
                  to="/dashboard"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Store Front
                </Link>
              </>
            ) : (
              /* User Mobile Navigation */
              <>
                <Link
                  to="/"
                  className={`block pl-3 pr-4 py-2 border-l-4 ${
                    isActive("/")
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>

                {auth?.isAuthenticated && (
                  <>
                    <Link
                      to="/dashboard"
                      className={`block pl-3 pr-4 py-2 border-l-4 ${
                        isActive("/dashboard")
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      to="/laptops"
                      className={`block pl-3 pr-4 py-2 border-l-4 ${
                        isActive("/laptops")
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Laptops
                    </Link>
                    <Link
                      to="/orders"
                      className={`block pl-3 pr-4 py-2 border-l-4 ${
                        isActive("/orders")
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Orders
                    </Link>

                    {/* Admin link for mobile */}
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Admin Area
                      </Link>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          <div className="pt-4 pb-3 border-t border-gray-200">
            {auth?.isAuthenticated ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-medium">
                        {auth.user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center text-base font-medium text-gray-800">
                      {auth.user?.name || "User"}
                      {isAdmin && (
                        <span className="ml-1 px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {auth.user?.email || ""}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-5 py-3 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3 space-y-1 px-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;