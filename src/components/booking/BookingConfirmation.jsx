import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { formatTime, formatDate } from "../../utils/dateUtils";
import { formatPrice } from "../../utils/priceUtils";
import { CheckCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import useInterval from "../../hooks/userInterval";

export default function BookingConfirmation() {
  const { bookingReference } = useParams();
  const navigate = useNavigate();
  const {
    data: booking,
    loading,
    refetch,
  } = useApi(`/bookings/${bookingReference}`);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isPolling, setIsPolling] = useState(true);
  const [pollCount, setPollCount] = useState(0);
  
  // Check if payment is still pending
  useEffect(() => {
    if (booking) {
      setPaymentStatus(booking.paymentStatus);
      if (booking.paymentStatus !== "PENDING") {
        setIsPolling(false);
      }
    }
  }, [booking]);
    
  // Poll for payment status updates every 5 seconds
  useInterval(
    () => {
      if (isPolling) {
        refetch();
        setPollCount((prev) => prev + 1);
      }
    },
    isPolling ? 10000 : null
  );
  
  // Stop polling after 2 minutes (24 attempts) or when payment is no longer pending
  useEffect(() => {
    if (pollCount >= 24 || !isPolling) {
      setIsPolling(false);
    }
  }, [pollCount, isPolling]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Show different UI based on payment status
  const isPaymentPending = paymentStatus === "PENDING";
  const isPaymentCompleted = paymentStatus === "COMPLETED";
  const isPaymentFailed = paymentStatus === "FAILED";
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        {isPaymentCompleted ? (
          <>
            <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for choosing FlyBooker
            </p>
          </>
        ) : isPaymentFailed ? (
          <>
            <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h1>
            <p className="text-lg text-gray-600">
              Your booking could not be completed
            </p>
          </>
        ) : (
          <>
            <div className="h-20 w-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Processing Payment
            </h1>
            <p className="text-lg text-gray-600">
              Please wait while we process your payment. Do not refresh or close this tab
            </p>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          </>
        )}
      </div>
      
  
      <div className="bg-white rounded-xl shadow-md p-8 mb-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Booking Details
            </h2>
            <p className="text-gray-600">
              Reference:{" "}
              <span className="font-mono font-bold">{bookingReference}</span>
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-primary font-medium"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            New Search
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Flight Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Airline:</span>
                <span className="font-medium">{booking?.airline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Flight Number:</span>
                <span className="font-medium">{booking?.flightNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Route:</span>
                <span className="font-medium">
                  {booking?.originAirport} to {booking?.destinationAirport}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Departure:</span>
                <span className="font-medium">
                  {formatDate(booking?.departureTime)} at{" "}
                  {formatTime(booking?.departureTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Arrival:</span>
                <span className="font-medium">
                  {formatDate(booking?.arrivalTime)} at{" "}
                  {formatTime(booking?.arrivalTime)}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Passenger Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{booking?.passengerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{booking?.passengerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{booking?.passengerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seats:</span>
                <span className="font-medium">
                  {booking?.seatNumbers?.join(", ")}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">Booking Status</p>
              <p
                className={`text-lg font-bold ${
                  booking?.status === "CONFIRMED"
                    ? "text-green-600"
                    : booking?.status === "CANCELLED"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {booking?.status}
              </p>
              {/* Add payment status display */}
              <p className="text-gray-600 mt-2">Payment Status</p>
              <p
                className={`text-lg font-bold ${
                  isPaymentCompleted
                    ? "text-green-600"
                    : isPaymentFailed
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {paymentStatus || "PENDING"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-primary">
                {formatPrice(booking?.totalAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Replace the static Next Steps section with conditional rendering */}
      <div
        className={`rounded-xl p-6 text-center ${
          isPaymentCompleted
            ? "bg-blue-50"
            : isPaymentFailed
            ? "bg-red-50"
            : "bg-yellow-50"
        }`}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {isPaymentCompleted
            ? "Next Steps"
            : isPaymentFailed
            ? "What to do now"
            : "Processing Payment"}
        </h3>
        {isPaymentCompleted && (
          <p className="text-gray-600 mb-4">
            Your booking confirmation has been sent to {booking?.passengerEmail}
            . Please arrive at the airport at least 2 hours before departure.
          </p>
        )}
        {isPaymentFailed && (
          <p className="text-gray-600 mb-4">
            We were unable to process your payment. Your booking has been
            cancelled. Please try booking again or contact support if the
            problem persists.
          </p>
        )}
        {isPaymentPending && (
          <p className="text-gray-600 mb-4">
            We're currently processing your payment. This usually takes less
            than a minute. Please do not refresh or close this page.
          </p>
        )}
        <div className="flex justify-center space-x-4">
          {isPaymentCompleted && (
            <>
              <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600">
                Print Ticket
              </button>
              <button className="border border-primary text-primary px-6 py-2 rounded-lg font-medium hover:bg-blue-50">
                Add to Calendar
              </button>
              <button 
                onClick={() => navigate("/")}
                className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-200"
              >
                Book Another Flight
              </button>
            </>
          )}
          {isPaymentFailed && (
            <>
              <button
                onClick={() => navigate("/")}
                className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600"
              >
                Try Again
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50">
                Contact Support
              </button>
            </>
          )}
          {isPaymentPending && (
            <button
            onClick={() => (window.location.href = "/my-bookings")}
            className="border border-primary text-primary px-6 py-2 rounded-lg font-medium hover:bg-blue-50"
            >
              View My Bookings
            </button>
          )}
        </div>
      </div>
    </div>
  );
}