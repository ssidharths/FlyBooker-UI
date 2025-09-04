import airportData from '../data/airports.json';

export const searchAirports = (searchTerm) => {
  if (!searchTerm || searchTerm.length < 2) return [];
  
  const results = [];
  const searchLower = searchTerm.toLowerCase();
  
  Object.entries(airportData).forEach(([code, details]) => {
    let matchScore = 0;
    
    // Check city name (highest priority)
    if (details.city.toLowerCase().startsWith(searchLower)) {
      matchScore = 3;
    } else if (details.city.toLowerCase().includes(searchLower)) {
      matchScore = 2;
    }
    
    // Check airport name
    else if (details.airportName.toLowerCase().includes(searchLower)) {
      matchScore = 2;
    }
    
    // Check alternative names
    else if (details.alternativeNames?.some(alt => 
      alt.toLowerCase().includes(searchLower)
    )) {
      matchScore = 1;
    }
    
    // Check airport code
    else if (code.toLowerCase().includes(searchLower)) {
      matchScore = 1;
    }
    
    if (matchScore > 0) {
      results.push({
        code: code,
        displayText: `${details.city} (${code})`,
        fullDisplayText: `${details.city} - ${details.airportName}`,
        city: details.city,
        airportName: details.airportName,
        country: details.country,
        matchScore
      });
    }
  });
  
  // Sort by match score (highest first) and then alphabetically
  return results
    .sort((a, b) => b.matchScore - a.matchScore || a.city.localeCompare(b.city))
    .slice(0, 6); // Limit to 6 results
};

export const getAirportByCode = (code) => {
  return airportData[code] || null;
};
