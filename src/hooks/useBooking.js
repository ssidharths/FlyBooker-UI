import { useContext } from 'react';
import { BookingContext } from './BookingContext';

export function useBooking() {
  return useContext(BookingContext);
}