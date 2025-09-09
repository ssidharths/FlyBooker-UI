import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { useBooking } from "../../hooks/useBooking";
import SeatMap from "./SeatMap";
import SeatLegend from "./SeatLegend";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
export default function SeatSelection() {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useBooking();
  const { data: seats, loading, refetch } = useApi(`/seats/flight/${flightId}`);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (refetch) {
      console.log("Refreshing seat availability data");
      refetch();
    }
  }, [flightId, refetch]);

  useEffect(() => {
    console.log("🔍 Flight pricing debug by travel class:");
    console.log("- Current travel class:", state.selectedTravelClass);
    console.log("- Selected flight full object:", state.selectedFlight);
    
    // Log all possible price-related properties
    if (state.selectedFlight) {
      console.log("- price:", state.selectedFlight.price);
      console.log("- basePrice:", state.selectedFlight.basePrice);
      console.log("- fare:", state.selectedFlight.fare);
      console.log("- economyPrice:", state.selectedFlight.economyPrice);
      console.log("- amount:", state.selectedFlight.amount);
    }
  }, [state.selectedFlight, state.selectedTravelClass]);

  useEffect(() => {
    if (state.selectedFlight && seats) {
      // Try to get the price from either basePrice or price property
      const basePrice = state.selectedFlight.price || 0;
      const selectedSeatsData = seats.filter((seat) =>
        state.selectedSeats.includes(seat.id)
      );
      const additionalFees = selectedSeatsData.reduce(
        (sum, seat) => sum + (seat.additionalFee || 0),
        0
      );
      const seatCount = state.selectedSeats.length;
      const subtotal = basePrice * seatCount + additionalFees;
      const tax = subtotal * 0.12;
      const grandTotal = subtotal + tax;
      setTotalPrice(grandTotal);
    } else {
      console.log("Missing data for price calculation");
      setTotalPrice(0);
    }
  }, [state.selectedSeats, seats, state.selectedFlight]);
  // Travel class sync useEffect
  useEffect(() => {
    if (state.searchParams.travelClass) {
      // Always update to ensure it's in sync
      if (state.selectedTravelClass !== state.searchParams.travelClass) {
        console.log("Syncing travel class:", state.searchParams.travelClass);
        dispatch({
          type: "SET_SELECTED_TRAVEL_CLASS",
          payload: state.searchParams.travelClass,
        });
      }
    }
  }, [state.searchParams.travelClass, state.selectedTravelClass, dispatch]);
  // Reset seats when travel class changes
  // useEffect(() => {
  //   if (state.selectedTravelClass && state.selectedSeats.length > 0) {
  //     // If travel class changes and seats are selected, reset them
  //     console.log("Travel class changed, resetting selected seats");
  //     dispatch({ type: "RESET_SELECTED_SEATS" });
  //   }
  // }, [state.selectedTravelClass, state.selectedSeats.length, dispatch]);

  const prevTravelClassRef = useRef(state.selectedTravelClass);

  useEffect(() => {
    // Only clear seats if travel class is set and seats are selected
    // Avoid clearing on initial load when selectedTravelClass is null
    const prevTravelClass = prevTravelClassRef.current;
    const currentTravelClass = state.selectedTravelClass;
  // Clear seats only when travel class actually changes (not on initial load)
      if (prevTravelClass && currentTravelClass && prevTravelClass !== currentTravelClass && state.selectedSeats.length > 0) {
        console.log("Travel class changed from", prevTravelClass, "to", currentTravelClass, "- clearing selected seats");
        dispatch({ type: "RESET_SELECTED_SEATS" });
      }
      prevTravelClassRef.current = currentTravelClass;

  }, [state.selectedTravelClass, state.selectedSeats.length, dispatch]);

  const handleContinue = () => {
    if (state.selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }
    navigate(`/booking/${flightId}`);
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate("/flights")}
          className="flex items-center text-primary font-medium"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Flights
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">
          Select Your Seats
        </h1>
        <p className="text-gray-600 mt-2">
          {state.selectedFlight?.airline} Flight{" "}
          {state.selectedFlight?.flightNumber}
        </p>
        {/* Travel class display */}
        <div className="mt-2">
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Travel Class:{" "}
            {state.selectedTravelClass
              ? state.selectedTravelClass.replace("_", " ")
              : "Not Set"}
          </span>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Seat Map</h2>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="inline-block bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">
                    FRONT
                  </div>
                </div>
                <SeatMap seats={seats} />
              </div>
            </div>
          </div>
          <div className="lg:w-1/4">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Your Selection
              </h3>

              <div className="mb-6">
                <SeatLegend />
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Base Price:</span>
                  <span className="font-medium">
                    {state.selectedFlight?.price
                      ? `₹${state.selectedFlight.price}`
                      : "₹ 0"}{" "}
                    × {state.selectedSeats.length}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Additional Fees:</span>
                  <span className="font-medium">
                    ₹
                    {seats
                      ?.filter((s) => state.selectedSeats.includes(s.id))
                      .reduce((sum, seat) => sum + (seat.additionalFee || 0), 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tax (12%):</span>
                  <span className="font-medium">
                    ₹
                    {(
                      ((state.selectedFlight?.price || 0) *
                        state.selectedSeats.length +
                        seats
                          ?.filter((s) => state.selectedSeats.includes(s.id))
                          .reduce(
                            (sum, seat) => sum + (seat.additionalFee || 0),
                            0
                          )) *
                      0.12
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
                  <span>Total:</span>
                  <span className="text-primary">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleContinue}
                disabled={state.selectedSeats.length === 0}
                className={`w-full bg-primary text-white py-3 rounded-lg font-medium mt-6 hover:bg-blue-600 transition duration-300 ${
                  state.selectedSeats.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Continue to Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
