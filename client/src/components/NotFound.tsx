import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, ArrowLeft, SearchX } from 'lucide-react';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | GDC Larkana</title>
        <meta name="description" content="The page you are looking for does not exist." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-lg">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <SearchX className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-7xl font-heading font-bold text-gray-900 mb-4">
            4<span className="text-primary">0</span>4
          </h1>
          <h2 className="text-2xl font-heading font-bold text-gray-800 mb-3">Page Not Found</h2>
          <p className="text-gray-500 mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <Link
              to="/"
              className="btn-primary"
            >
              <Home className="w-4 h-4 mr-2" />
              Home Page
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
