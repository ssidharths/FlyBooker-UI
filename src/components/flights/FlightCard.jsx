import { useNavigate } from "react-router-dom";
import { useBooking } from "../../hooks/useBooking";
import { formatTime, formatDate } from "../../utils/dateUtils";
import { formatPrice } from "../../utils/priceUtils";
export default function FlightCard({ flight }) {
  const navigate = useNavigate();
  const { dispatch } = useBooking();
  const handleSelectFlight = () => {
    dispatch({ type: "SELECT_FLIGHT", payload: flight });
    navigate(`/seats/${flight.id}`);
  };
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                <span className="font-bold text-gray-700">
                  {flight.airline.substring(0, 2)}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {flight.airline}
                </h3>
                <p className="text-sm text-gray-500">{flight.flightNumber}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatTime(flight.departureTime)}
                </p>
                <p className="text-sm text-gray-500">{flight.originAirport}</p>
                <p className="text-xs text-gray-400">
                  {formatDate(flight.departureTime)}
                </p>
              </div>

              <div className="flex flex-col items-center mx-4">
                <div className="text-sm text-gray-500 mb-1">
                  {flight.duration}
                </div>
                <div className="w-16 h-0.5 bg-gray-300 relative">
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Non-stop</div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {formatTime(flight.arrivalTime)}
                </p>
                <p className="text-sm text-gray-500">
                  {flight.destinationAirport}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDate(flight.arrivalTime)}
                </p>
              </div>
            </div>
          </div>
          <div className="md:ml-8 mt-6 md:mt-0 flex flex-col items-end">
            <div className="text-right mb-4">
              <p className="text-2xl font-bold text-primary">
                {formatPrice(flight.price)}
              </p>
              <p className="text-sm text-gray-500">
                {flight.availableSeats} seats left
              </p>
            </div>
            <button
              onClick={handleSelectFlight}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition duration-300 w-full md:w-auto"
            >
              Select Flight
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
