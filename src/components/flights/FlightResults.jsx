import { useNavigate } from "react-router-dom";
import { useBooking } from "../../hooks/useBooking";
import { useApi } from "../../hooks/useApi";
import FlightCard from "./FlightCard";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function FlightResults() {
  const navigate = useNavigate();
  const { state } = useBooking();
  const {
    data: flights,
    loading,
    error,
  } = useApi("/flights/search", {
    method: "POST",
    data: state.searchParams,
  });
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Error Loading Flights
        </h2>
        <p className="text-gray-600 mb-6">Please try again later</p>
        <button
          onClick={() => navigate("/")}
          className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600"
        >
          Back to Search
        </button>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-primary font-medium"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Search
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">
          Available Flights
        </h1>
        <p className="text-gray-600 mt-2">
          {state.searchParams.origin} to {state.searchParams.destination} on{" "}
          {state.searchParams.departureDate}
        </p>
      </div>
      {flights?.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Flights Found
          </h2>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600"
          >
            Modify Search
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {flights?.map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
        </div>
      )}
    </div>
  );
}
