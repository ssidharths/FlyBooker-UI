import { Link } from "react-router-dom";
import { PlaneIcon } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            <PlaneIcon className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900">FlyBooker</span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-primary font-medium"
            >
              Flights
            </Link>
            <Link
              to="/my-bookings"
              className="text-gray-600 hover:text-primary font-medium"
            >
              My Bookings
            </Link>
            <Link
              to="/"
              className="text-gray-600 hover:text-primary font-medium"
            >
              Support
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-primary">
              Sign In
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
