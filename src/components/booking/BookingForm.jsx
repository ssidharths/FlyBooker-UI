import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';
import { useApi } from '../../hooks/useApi';
import PassengerDetails from './PassengerDetails';
import { ArrowLeftIcon, LockClosedIcon } from '@heroicons/react/24/outline';
export default function BookingForm() {
const { flightId } = useParams();
const navigate = useNavigate();
const { state, dispatch } = useBooking();
const { data: flight } = useApi(`/flights/${flightId}`);
const { data: seats } = useApi(`/seats/flight/${flightId}`);
const [isSubmitting, setIsSubmitting] = useState(false);
const [totalPrice, setTotalPrice] = useState(0);
useEffect(() => {
if (!state.selectedFlight && flight) {
dispatch({ type: 'SELECT_FLIGHT', payload: flight });
}
}, [flight, state.selectedFlight, dispatch]);
// Calculate total price
useEffect(() => {
if (state.selectedFlight && seats) {
// Convert from paise to rupees and calculate total
const basePrice = (state.selectedFlight.price || 0);
const selectedSeatsData = seats.filter(seat => state.selectedSeats.includes(seat.id));
const additionalFees = selectedSeatsData.reduce((sum, seat) => sum + (seat.additionalFee || 0), 0);
const seatCount = state.selectedSeats.length;

const calculatedPrice = (basePrice * seatCount) + additionalFees;
console.log('Calculation:', `${basePrice} x ${seatCount} + ${additionalFees} = ${calculatedPrice}`);

setTotalPrice(calculatedPrice);
} else {
setTotalPrice(0);
}
}, [state.selectedFlight, seats, state.selectedSeats]);
const handleSubmit = async (e) => {
e.preventDefault();
setIsSubmitting(true);
try {
const bookingData = {
flightId: state.selectedFlight.id,
passengerName: state.bookingDetails.passengerName,
passengerEmail: state.bookingDetails.passengerEmail,
passengerPhone: state.bookingDetails.passengerPhone,
seatIds: state.selectedSeats,
paymentMethod: state.bookingDetails.paymentMethod
};
const response = await fetch('http://localhost:8080/fb/api/v1/bookings', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify(bookingData),
});
if (!response.ok) {
throw new Error('Booking failed');
}
const booking = await response.json();
dispatch({ type: 'SET_BOOKING', payload: booking });
navigate(`/confirmation/${booking.bookingReference}`);
} catch (error) {
console.error('Booking error:', error);
alert('There was an error processing your booking. Please try again.');
} finally {
setIsSubmitting(false);
}
};
if (!flight) {
return (
<div className="flex justify-center items-center h-64">
<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
</div>
);
}
return (
<div className="max-w-4xl mx-auto">
<div className="mb-8">
<button
onClick={() => navigate(`/seats/${flightId}`)}
className="flex items-center text-primary font-medium"
>
<ArrowLeftIcon className="h-5 w-5 mr-2" />
Back to Seat Selection
</button>
<h1 className="text-3xl font-bold text-gray-900 mt-4">Complete Your Booking</h1>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
<div className="lg:col-span-2">
<div className="bg-white rounded-xl shadow-md p-6 mb-8">
<h2 className="text-xl font-bold text-gray-900 mb-6">Passenger Information</h2>
<PassengerDetails />
</div>
<div className="bg-white rounded-xl shadow-md p-6">
<h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
<div className="space-y-4">
{[
{ value: 'CREDIT_CARD', label: 'Credit Card', icon: '💳' },
{ value: 'DEBIT_CARD', label: 'Debit Card', icon: '💳' },
{ value: 'UPI', label: 'UPI', icon: '▶️'},
{ value: 'BANK_TRANSFER', label: 'Bank Transfer', icon: '🏦' }
].map(method => (
<label
key={method.value}
className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
>
<input
type="radio"
name="paymentMethod"
value={method.value}
checked={state.bookingDetails.paymentMethod === method.value}
onChange={(e) => dispatch({
type: 'UPDATE_BOOKING_DETAILS',
payload: { paymentMethod: e.target.value }
})}
className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
/>
<span className="ml-3 text-lg mr-2">{method.icon}</span>
<span className="font-medium">{method.label}</span>
</label>
))}
</div>
</div>
</div>
<div>
<div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
<h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>

{state.selectedFlight && state.selectedSeats.length > 0 ? (
<div className="mb-6">
<div className="flex justify-between items-start mb-4">
<div>
<p className="font-bold text-gray-900">{state.selectedFlight.airline}</p>
<p className="text-sm text-gray-500">{state.selectedFlight.flightNumber}</p>
</div>
<div className="text-right">
<p className="font-bold text-gray-900">{state.selectedFlight.originAirport}</p>
<p className="text-sm text-gray-500">to</p>
<p className="font-bold text-gray-900">{state.selectedFlight.destinationAirport}</p>
</div>
</div>

<div className="text-sm text-gray-600 mb-4">
<p>Departure: {new Date(state.selectedFlight.departureTime).toLocaleString()}</p>
<p>Duration: {state.selectedFlight.duration}</p>
</div>

<div className="border-t pt-4">
<div className="flex justify-between mb-2">
<span className="text-gray-600">Passengers:</span>
<span>{state.bookingDetails.passengerName || 'Not provided'}</span>
</div>
<div className="flex justify-between mb-2">
<span className="text-gray-600">Seats:</span>
<span>{state.selectedSeats.length} selected</span>
</div>
<div className="flex justify-between mb-2">
<span className="text-gray-600">Base Price:</span>
<span>
₹{state.selectedFlight.price ? (state.selectedFlight.price).toFixed(2) : '0.00'} × {state.selectedSeats.length}
</span>
</div>
<div className="flex justify-between mb-2">
<span className="text-gray-600">Additional Fees:</span>
<span>
₹{seats?.filter(s => state.selectedSeats.includes(s.id))
.reduce((sum, seat) => sum + (seat.additionalFee || 0), 0).toFixed(2)}
</span>
</div>
<div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
<span>Total:</span>
<span className="text-primary">
₹{totalPrice.toFixed(2)}
</span>
</div>
</div>
</div>
) : (
<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
<p className="text-yellow-800">Please select seats to continue with booking.</p>
</div>
)}

<button
onClick={handleSubmit}
disabled={isSubmitting || state.selectedSeats.length === 0}
className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition duration-300 flex items-center justify-center disabled:opacity-50"
>
{isSubmitting ? (
<>
<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
Processing...
</>
) : (
<>
<LockClosedIcon className="h-5 w-5 mr-2" />
Complete Booking
</>
)}
</button>
<p className="text-xs text-gray-500 mt-4 text-center">
By completing this booking, you agree to our Terms of Service and Privacy Policy.
</p>
</div>
</div>
</div>
</div>
);
}