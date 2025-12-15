import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
   children: ReactNode;
}

interface ErrorBoundaryState {
   hasError: boolean;
   message?: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
   state: ErrorBoundaryState = {
      hasError: false,
      message: undefined,
   };

   static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      return { hasError: true, message: error?.message };
   }

   componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      // Surface the original error details to the console for debugging
      console.error(
         "Unhandled error caught by ErrorBoundary",
         error,
         errorInfo
      );
   }

   private handleReset = () => {
      this.setState({ hasError: false, message: undefined });
   };

   render() {
      if (this.state.hasError) {
         return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
               <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
                  <h1 className="text-xl font-semibold text-slate-900">
                     Something went wrong
                  </h1>
                  <p className="mt-2 text-sm text-slate-600">
                     Try refreshing the page or attempt to continue.
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                     <button
                        type="button"
                        onClick={this.handleReset}
                        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:shadow-sm"
                     >
                        Try again
                     </button>
                     <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                     >
                        Reload
                     </button>
                  </div>
                  {this.state.message ? (
                     <p
                        className="mt-3 truncate text-xs text-slate-500"
                        aria-live="polite"
                     >
                        Details: {this.state.message}
                     </p>
                  ) : null}
               </div>
            </div>
         );
      }

      return this.props.children;
   }
}

export default ErrorBoundary;
