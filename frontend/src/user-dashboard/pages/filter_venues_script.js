const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'pages', 'SelectVenue.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add useMemo to imports
content = content.replace(
  'import React, { useState, useEffect } from "react";',
  'import React, { useState, useEffect, useMemo } from "react";'
);

// 2. Add outdoor flags to specific venues
content = content.replace(
  'name: "Garden Bliss Banquet",',
  'name: "Garden Bliss Banquet",\n      outdoor: true,'
);
content = content.replace(
  'name: "Sapphire Banquets",',
  'name: "Sapphire Banquets",\n      outdoor: true,'
);

// 3. Add filteredVenues logic right before the return statement
const filterLogic = `
  const filteredVenues = useMemo(() => {
    if (!selectedVenueType) return venues;
    if (selectedVenueType === 'ac') return venues.filter(v => v.ac);
    if (selectedVenueType === 'non-ac') return venues.filter(v => !v.ac);
    if (selectedVenueType === 'outdoor') return venues.filter(v => v.outdoor);
    return venues;
  }, [selectedVenueType]);

  return (`;

content = content.replace(
  /\s*return \(/,
  filterLogic
);

// 4. Update the mapping to use filteredVenues instead of venues
content = content.replace(
  /\{venues\.map\(venue => \(/,
  `{filteredVenues.map(venue => (`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated SelectVenue.jsx to filter venues dynamically.");
