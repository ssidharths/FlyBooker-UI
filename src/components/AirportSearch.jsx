import { useState, useRef, useEffect } from "react";
import { searchAirports } from "../utils/airportUtils";

const AirportSearch = ({
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isTouch, setIsTouch] = useState(false);
  const inputRef = useRef();
  const suggestionsRef = useRef();
  const timeoutRef = useRef();

  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  // Detect touch devices
  useEffect(() => {
    const handleTouchStart = () => setIsTouch(true);
    const handleMouseDown = () => setIsTouch(false);

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);

    if (inputValue.length >= 2) {
      const results = searchAirports(inputValue);
      setSuggestions(results);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (airport) => {
    setSearchTerm(airport.displayText);
    setShowSuggestions(false);
    onChange(airport.code); // Pass airport code to parent
  };

  const handleSuggestionTouch = (e, airport) => {
    e.preventDefault(); // Prevent default touch behavior
    handleSuggestionClick(airport);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleBlur = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // For touch devices, use a longer delay
    const delay = isTouch ? 500 : 200;

    timeoutRef.current = setTimeout(() => {
      setShowSuggestions(false);
    }, delay);
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
        autoComplete="off"
      />

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((airport, index) => (
            <div
              key={airport.code}
              onMouseDown={() => handleSuggestionClick(airport)}
              onTouchStart={(e) => handleSuggestionTouch(e, airport)}
              className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                index === selectedIndex ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">
                    {airport.city}
                  </div>
                  <div className="text-sm text-gray-600">
                    {airport.airportName}
                  </div>
                </div>
                <div className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {airport.code}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AirportSearch;
