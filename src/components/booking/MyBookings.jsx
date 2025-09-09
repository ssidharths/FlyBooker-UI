import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/outline";

export default function MyBookings() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setSearched(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/bookings/email/${email}`
      );
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingReference, bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
      return;
    }
    
    setCancellingId(bookingId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookings/${bookingReference}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Update the booking status in the local state
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status: "CANCELLED" } 
              : booking
          )
        );
      } else {
        alert("Failed to cancel booking. Please try again.");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("An error occurred while cancelling your booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "text-green-600";
      case "CANCELLED":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600";
      case "FAILED":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-2">
          Check your booking status and details
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-grow">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Enter your email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="your.email@example.com"
              required
            />
          </div>
          <div className="self-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                  Search
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      {searched && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {bookings.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">
                No bookings found for this email address.
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600"
              >
                Search for Flights
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {booking.airline} {booking.flightNumber}
                      </h3>
                      <p className="text-gray-600">
                        {booking.originAirport} to {booking.destinationAirport}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Booking Reference:{" "}
                        <span className="font-mono">
                          {booking.bookingReference}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">Status</p>
                      <p
                        className={`font-bold ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </p>
                      <p className="text-gray-600 mt-1">Payment</p>
                      <p
                        className={`font-bold ${getPaymentStatusColor(
                          booking.paymentStatus
                        )}`}
                      >
                        {booking.paymentStatus}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-600">Departure</p>
                      <p className="font-medium">
                        {formatDateTime(booking.departureTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Passenger</p>
                      <p className="font-medium">{booking.passengerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Seats</p>
                      <p className="font-medium">
                        {booking.seatNumbers?.join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-xl font-bold text-primary">
                        {formatPrice(booking.totalAmount)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/confirmation/${booking.bookingReference}`)
                        }
                        className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600"
                      >
                        View Details
                      </button>
                      {booking.status === "CONFIRMED" && booking.paymentStatus === "COMPLETED" && (
                        <button
                          onClick={() => handleCancelBooking(booking.bookingReference, booking.id)}
                          disabled={cancellingId === booking.id}
                          className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 flex items-center"
                        >
                          {cancellingId === booking.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700 mr-2"></div>
                              Cancelling...
                            </>
                          ) : (
                            "Cancel"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}