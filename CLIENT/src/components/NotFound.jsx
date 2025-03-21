import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-green-600">404</h1>
        <h2 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
          Page not found
        </h2>
        <p className="mt-6 text-base text-gray-500">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-10">
          <Link
            to="/"
            className="text-base font-medium text-green-600 hover:text-green-500"
          >
            Go back home<span aria-hidden="true"></span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
