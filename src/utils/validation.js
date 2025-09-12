// Validation utility functions
export const validatePassengerDetails = (passengerDetails) => {
    const errors = {
      passengerName: '',
      passengerEmail: '',
      passengerPhone: ''
    };
  
    // Validate name
    if (!passengerDetails.passengerName.trim()) {
      errors.passengerName = 'Full name is required';
    } else if (passengerDetails.passengerName.trim().length < 2) {
      errors.passengerName = 'Please enter a valid name';
    }
  
    // Validate email
    if (!passengerDetails.passengerEmail.trim()) {
      errors.passengerEmail = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(passengerDetails.passengerEmail)) {
        errors.passengerEmail = 'Please enter a valid email address';
      }
    }
  
    // Validate phone
    if (!passengerDetails.passengerPhone.trim()) {
      errors.passengerPhone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\\(\\)]+$/.test(passengerDetails.passengerPhone)) {
      errors.passengerPhone = 'Please enter a valid phone number';
    }
  
    return errors;
  };
  
  export const isFormValid = (passengerDetails, selectedSeats, paymentMethod) => {
    const errors = validatePassengerDetails(passengerDetails);
    
    return (
      !errors.passengerName &&
      !errors.passengerEmail &&
      !errors.passengerPhone &&
      selectedSeats.length > 0 &&
      paymentMethod
    );
  };