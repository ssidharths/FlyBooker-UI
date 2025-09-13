import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../hooks/useBooking";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import AirportSearch from "../AirportSearch";

export default function FlightSearch() {
  const navigate = useNavigate();
  const { dispatch } = useBooking();
  
  // Store airport codes instead of display text
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    passengers: 1,
    travelClass: "ECONOMY",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataWithClass = {
      ...formData,
      travelClass: formData.travelClass || "ECONOMY",
    };  
    dispatch({ type: "SET_SEARCH_PARAMS", payload: formDataWithClass });
    dispatch({ type: "RESET_SELECTED_SEATS" });
    navigate("/flights");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Perfect Flight
        </h1>
        <p className="text-lg text-gray-600">
          Search millions of flights to get the best deals
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <AirportSearch
                value={formData.origin}
                onChange={(airportCode) =>
                  setFormData({ ...formData, origin: airportCode })
                }
                placeholder="Search city or airport"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <AirportSearch
                value={formData.destination}
                onChange={(airportCode) =>
                  setFormData({ ...formData, destination: airportCode })
                }
                placeholder="Search city or airport"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departure
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.departureDate}
                onChange={(e) =>
                  setFormData({ ...formData, departureDate: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Return (Optional)
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.returnDate}
                onChange={(e) =>
                  setFormData({ ...formData, returnDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passengers & Class
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={formData.passengers}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      passengers: parseInt(e.target.value),
                    })
                  }
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Passenger" : "Passengers"}
                    </option>
                  ))}
                </select>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={formData.travelClass}
                  onChange={(e) =>
                    setFormData({ ...formData, travelClass: e.target.value })
                  }
                >
                  <option value="ECONOMY">Economy</option>
                  <option value="PREMIUM_ECONOMY">Premium Economy</option>
                  <option value="BUSINESS">Business</option>
                  <option value="FIRST">First Class</option>
                </select>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
          >
            <MagnifyingGlassIcon className="h-6 w-6 mr-2" />
            Search Flights
          </button>
        </form>
      </div>
    </div>
  );
}
