import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import FlightSearch from './components/flights/FlightSearch';
import FlightResults from './components/flights/FlightResults';
import SeatSelection from './components/seats/SeatSelection';
import BookingForm from './components/booking/BookingForm';
import BookingConfirmation from './components/booking/BookingConfirmation';
import MyBooking from './components/booking/MyBookings';
import Footer from './components/layout/Footer';
import { BookingProvider } from './hooks/BookingContext';

function App() {
  return (
    <BookingProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<FlightSearch />} />
              <Route path="/flights" element={<FlightResults />} />
              <Route path="/seats/:flightId" element={<SeatSelection />} />
              <Route path="/booking/:flightId" element={<BookingForm />} />
              <Route path="/confirmation/:bookingReference" element={<BookingConfirmation />} />
              <Route path="/my-bookings" element={<MyBooking />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </BookingProvider>
  );
}

export default App;