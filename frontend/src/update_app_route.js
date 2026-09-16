const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Import ClientVenueDetails
content = content.replace(
  'import SelectVenue from "./user-dashboard/pages/SelectVenue";',
  'import SelectVenue from "./user-dashboard/pages/SelectVenue";\nimport ClientVenueDetails from "./user-dashboard/pages/ClientVenueDetails";'
);

// Add the Route
const routeStr = `<Route
        path="/client/venue-details/:id"
        element={
          <UserProtectedRoute>
            <ClientVenueDetails />
          </UserProtectedRoute>
        }
      />`;

content = content.replace(
  /<Route\s*path="\/client\/select-venue"[\s\S]*?<\/UserProtectedRoute>\s*\}/m,
  match => `${match}\n      ${routeStr}`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated App.jsx with ClientVenueDetails route.");
