import React from 'react';
import { useBooking } from '../../hooks/useBooking';

export default function SeatLegend() {
  const { state } = useBooking();
  
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">Seat Legend</h4>
      
      <div className="flex items-center">
        <div className="w-6 h-6 bg-white border border-gray-300 rounded-lg flex items-center justify-center mr-2"></div>
        <span className="text-sm text-gray-600">Available</span>
      </div>
      
      <div className="flex items-center">
        <div className="w-6 h-6 bg-primary text-white rounded-lg flex items-center justify-center mr-2"></div>
        <span className="text-sm text-gray-600">Selected</span>
      </div>
      
      <div className="flex items-center">
        <div className="w-6 h-6 bg-gray-300 text-gray-500 rounded-lg flex items-center justify-center mr-2"></div>
        <span className="text-sm text-gray-600">Occupied</span>
      </div>
      
      <div className="flex items-center">
        <div className="w-6 h-6 bg-red-100 text-red-500 rounded-lg flex items-center justify-center mr-2"></div>
        <span className="text-sm text-gray-600">Blocked</span>
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <h4 className="font-medium text-gray-900 mb-2">Your Travel Class</h4>
        <div className="space-y-2">
          <div className={`flex items-center p-2 rounded ${
            state.selectedTravelClass === 'ECONOMY' ? 'bg-green-100 border border-green-300' : ''
          }`}>
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">Economy</span>
          </div>
          <div className={`flex items-center p-2 rounded ${
            state.selectedTravelClass === 'PREMIUM_ECONOMY' ? 'bg-blue-100 border border-blue-300' : ''
          }`}>
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">Premium Economy</span>
          </div>
          <div className={`flex items-center p-2 rounded ${
            state.selectedTravelClass === 'BUSINESS' ? 'bg-purple-100 border border-purple-300' : ''
          }`}>
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">Business</span>
          </div>
          <div className={`flex items-center p-2 rounded ${
            state.selectedTravelClass === 'FIRST' ? 'bg-yellow-100 border border-yellow-300' : ''
          }`}>
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">First Class</span>
          </div>
        </div>
      </div>
    </div>
  );
}