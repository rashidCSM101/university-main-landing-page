import { Link } from 'react-router-dom';
import { ArrowLeft, Globe2 } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 text-white">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 bg-[#00C8C8]/10 rounded-3xl flex items-center justify-center mx-auto border border-[#00C8C8]/30">
          <Globe2 className="w-10 h-10 text-[#00C8C8]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-heading font-extrabold text-white">404</h1>
          <h2 className="text-xl font-bold text-gray-200">Page Not Found</h2>
          <p className="text-sm text-gray-400">
            The requested climate resource, data portal, or route could not be found.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#00C8C8] text-gray-950 font-bold rounded-xl hover:bg-teal-400 transition-colors text-sm shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
