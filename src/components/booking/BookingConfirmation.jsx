import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { formatTime, formatDate } from '../../utils/dateUtils';
import { formatPrice } from '../../utils/priceUtils';
import { CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function BookingConfirmation() {
  const { bookingReference } = useParams();
  const navigate = useNavigate();
  const { data: booking, loading } = useApi(`/bookings/${bookingReference}`);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-lg text-gray-600">Thank you for choosing FlyBooker</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 mb-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
            <p className="text-gray-600">Reference: <span className="font-mono font-bold">{bookingReference}</span></p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-primary font-medium"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            New Search
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Flight Information</h3>
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
                  {formatDate(booking?.departureTime)} at {formatTime(booking?.departureTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Arrival:</span>
                <span className="font-medium">
                  {formatDate(booking?.arrivalTime)} at {formatTime(booking?.arrivalTime)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Passenger Information</h3>
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
                <span className="font-medium">{booking?.seatNumbers?.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">Booking Status</p>
              <p className={`text-lg font-bold ${
                booking?.status === 'CONFIRMED' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {booking?.status}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-primary">{formatPrice(booking?.totalAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Next Steps</h3>
        <p className="text-gray-600 mb-4">
          Your booking confirmation has been sent to {booking?.passengerEmail}. 
          Please arrive at the airport at least 2 hours before departure.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600">
            Print Ticket
          </button>
          <button className="border border-primary text-primary px-6 py-2 rounded-lg font-medium hover:bg-blue-50">
            Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
}