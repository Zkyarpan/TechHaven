import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

class ComponentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(
      `Error in ${this.props.componentName || "component"}:`,
      error,
      errorInfo
    );
    this.setState({ errorInfo });

    // Optional: Report to an error tracking service
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });

    // If the component provided an onReset callback, call it
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { componentName = "Component" } = this.props;

    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-300 rounded-lg shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">
                Something went wrong in {componentName}
              </h3>

              <div className="mt-2 text-sm text-red-700">
                <p>
                  {this.state.error?.message || "An unexpected error occurred"}
                </p>

                {process.env.NODE_ENV === "development" &&
                  this.state.errorInfo && (
                    <details className="mt-2 border-t border-red-200 pt-2">
                      <summary className="cursor-pointer">
                        Technical Details
                      </summary>
                      <pre className="mt-2 text-xs p-3 bg-red-100 rounded overflow-auto max-h-48">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
              </div>

              <div className="mt-4 flex space-x-3">
                <button
                  onClick={this.handleReset}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Try Again
                </button>

                <button
                  onClick={this.handleReload}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // If there's no error, render the children normally
    return this.props.children;
  }
}

export default ComponentErrorBoundary;

// Usage:
//
// import ComponentErrorBoundary from './ComponentErrorBoundary';
//
// function MyComponent() {
//   return (
//     <ComponentErrorBoundary componentName="Order Form" onReset={() => console.log('Component reset')}>
//       {/* Your component content */}
//     </ComponentErrorBoundary>
//   );
// }
