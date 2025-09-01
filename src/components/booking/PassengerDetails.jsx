import { useBooking } from '../../hooks/useBooking';
import { validatePassengerDetails } from '../../utils/validation';
import { useState, useEffect } from 'react';

export default function PassengerDetails({ onValidationChange }) {
  const { state, dispatch } = useBooking();
  const [errors, setErrors] = useState({
    passengerName: '',
    passengerEmail: '',
    passengerPhone: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: 'UPDATE_BOOKING_DETAILS',
      payload: { [name]: value }
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const updatedDetails = {
      ...state.bookingDetails,
      [name]: value
    };
    const validationErrors = validatePassengerDetails(updatedDetails);
    setErrors(prev => ({
      ...prev,
      [name]: validationErrors[name]
    }));
  };

  // Notify parent component about validation changes
  useEffect(() => {
    const validationErrors = validatePassengerDetails(state.bookingDetails);
    const hasErrors = Object.values(validationErrors).some(error => error);
    onValidationChange(!hasErrors);
  }, [state.bookingDetails, onValidationChange]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="passengerName"
          value={state.bookingDetails.passengerName}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
            errors.passengerName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="John Doe"
          required
        />
        {errors.passengerName && (
          <p className="mt-1 text-sm text-red-600">{errors.passengerName}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="passengerEmail"
          value={state.bookingDetails.passengerEmail}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
            errors.passengerEmail ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="john@example.com"
          required
        />
        {errors.passengerEmail && (
          <p className="mt-1 text-sm text-red-600">{errors.passengerEmail}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="passengerPhone"
          value={state.bookingDetails.passengerPhone}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
            errors.passengerPhone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="+1 (555) 123-4567"
          required
        />
        {errors.passengerPhone && (
          <p className="mt-1 text-sm text-red-600">{errors.passengerPhone}</p>
        )}
      </div>
    </div>
  );
}