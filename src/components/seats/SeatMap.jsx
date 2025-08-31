import { useBooking } from '../../hooks/useBooking';

export default function SeatMap({ seats }) {
  const { state, dispatch } = useBooking();
  
  const handleSeatClick = (seatId) => {    
    // Find the seat object
    const seat = seats.find(s => s.id === seatId);
    if (!seat) return;
    
    // Check if seat matches the selected travel class
    if (state.selectedTravelClass && seat.seatClass !== state.selectedTravelClass) {
      alert(`You can only select ${state.selectedTravelClass.replace('_', ' ')} seats for this booking.`);
      return;
    }
    
    dispatch({ type: 'TOGGLE_SEAT', payload: seatId });
  };

  // Group seats by row
  const seatsByRow = {};
  seats?.forEach(seat => {
    const row = seat.seatNumber.match(/\d+/)[0];
    if (!seatsByRow[row]) {
      seatsByRow[row] = [];
    }
    seatsByRow[row].push(seat);
  });

  const getSeatColor = (seat) => {
    // Check if seat matches travel class
    const isCorrectClass = !state.selectedTravelClass || seat.seatClass === state.selectedTravelClass;
    
    if (state.selectedSeats.includes(seat.id)) {
      return 'bg-primary text-white';
    }
    
    switch (seat.status) {
      case 'AVAILABLE':
        if (!isCorrectClass) {
          return 'bg-gray-100 text-gray-400 cursor-not-allowed'; // Disabled look
        }
        return 'bg-white border border-gray-300 hover:bg-gray-100 cursor-pointer';
      case 'OCCUPIED':
        return 'bg-gray-300 text-gray-500 cursor-not-allowed';
      case 'BLOCKED':
        return 'bg-red-100 text-red-500 cursor-not-allowed';
      default:
        return 'bg-white border border-gray-300';
    }
  };

  const getSeatTitle = (seat) => {
    if (seat.status !== 'AVAILABLE') return `${seat.seatNumber} - ${seat.status}`;
    if (state.selectedTravelClass && seat.seatClass !== state.selectedTravelClass) {
      return `${seat.seatNumber} - ${seat.seatClass} (Not available for your class)`;
    }
    return `${seat.seatNumber} - ${seat.seatClass}`;
  };

  return (
    <div className="space-y-2">
      {Object.keys(seatsByRow).map(row => (
        <div key={row} className="flex justify-center items-center space-x-2">
          <div className="w-8 text-center text-sm text-gray-500 font-medium">{row}</div>
          <div className="flex space-x-2">
            {seatsByRow[row].map(seat => (
              <button
                key={seat.id}
                onClick={() => seat.status === 'AVAILABLE' && handleSeatClick(seat.id)}
                disabled={seat.status !== 'AVAILABLE' || 
                         (state.selectedTravelClass && seat.seatClass !== state.selectedTravelClass)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition duration-200 ${getSeatColor(seat)}`}
                title={getSeatTitle(seat)}
              >
                {seat.seatNumber.replace(/\d+/, '')}
              </button>
            ))}
          </div>
          <div className="w-8"></div>
        </div>
      ))}
    </div>
  );
}