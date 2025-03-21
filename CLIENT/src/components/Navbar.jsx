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
  const [isScrolled, setIsScrolled] = useState(false);

  // Check if user is admin
  const isAdmin = auth?.user?.role?.toLowerCase() === "admin";

  // Check if current page is an admin page
  const isAdminPage = location.pathname.startsWith("/admin");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      ? "border-green-500 text-gray-900 font-medium"
      : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900";
  };

  const getAdminActiveClass = (path) => {
    return isActive(path)
      ? "border-orange-500 text-orange-900 font-medium"
      : "border-transparent text-orange-600 hover:border-orange-300 hover:text-orange-700";
  };

  const navbarClass = isScrolled
    ? "bg-white shadow-md sticky top-0 z-50 transition-all duration-300"
    : "bg-white shadow-sm transition-all duration-300";

  return (
    <nav className={navbarClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xl font-bold text-green-600">
                  TechHaven
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
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
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900"
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

                  <Link
                    to="/about"
                    className={`${getActiveClass(
                      "/about"
                    )} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    About Us
                  </Link>

                  <Link
                    to="/laptops"
                    className={`${getActiveClass(
                      "/laptops"
                    )} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Laptops
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
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-medium">
                        {auth.user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <span>
                      Hi, {auth.user?.name || "User"}
                      {isAdmin && (
                        <span className="ml-1 px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full">
                          Admin
                        </span>
                      )}
                    </span>
                    <svg
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-green-600 hover:text-green-800 font-medium text-sm"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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

                <Link
                  to="/about"
                  className={`block pl-3 pr-4 py-2 border-l-4 ${
                    isActive("/about")
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
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
                  <Link
                    to="/profile"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3 space-y-1 px-4">
                <Link
                  to="/login"
                  className="block py-2 text-base font-medium text-green-600 hover:text-green-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="block py-2 text-base font-medium text-gray-600 hover:text-gray-800"
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
