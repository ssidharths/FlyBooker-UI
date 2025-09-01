import { createContext, useReducer } from "react";
const BookingContext = createContext();
const initialState = {
  searchParams: {
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    passengers: 1,
    travelClass: "ECONOMY",
  },
  selectedFlight: null,
  selectedSeats: [],
  bookingDetails: {
    passengerName: "",
    passengerEmail: "",
    passengerPhone: "",
    paymentMethod: "CREDIT_CARD",
  },
  booking: null,
  selectedTravelClass: null,
};
function bookingReducer(state, action) {
  switch (action.type) {
    case "SET_SEARCH_PARAMS":
      return { ...state, searchParams: action.payload };
    case "SELECT_FLIGHT":
      return { ...state, selectedFlight: action.payload };
    case "TOGGLE_SEAT": {
      const seatId = action.payload;
      const isSelected = state.selectedSeats.includes(seatId);
      return {
        ...state,
        selectedSeats: isSelected
          ? state.selectedSeats.filter((id) => id !== seatId)
          : [...state.selectedSeats, seatId],
      };
    }
    case "UPDATE_BOOKING_DETAILS":
      return {
        ...state,
        bookingDetails: { ...state.bookingDetails, ...action.payload },
      };
    case "SET_BOOKING":
      return { ...state, booking: action.payload };
    case "RESET_BOOKING":
      return initialState;
    case "SET_SELECTED_TRAVEL_CLASS":
      return { ...state, selectedTravelClass: action.payload };
    default:
      return state;
  }
}
export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}
export { BookingContext };
