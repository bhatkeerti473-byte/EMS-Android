const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Ensure ClientVenueDetails is imported
if (!content.includes('import ClientVenueDetails')) {
  content = content.replace(
    'import SelectVenue from "./user-dashboard/pages/SelectVenue";',
    'import SelectVenue from "./user-dashboard/pages/SelectVenue";\nimport ClientVenueDetails from "./user-dashboard/pages/ClientVenueDetails";'
  );
}

// Ensure the client premium routes are there
const clientPremiumRoutes = `
      {/* --- Client Dashboard Premium Routes --- */}
      <Route
        path="/client/dashboard"
        element={
          <UserProtectedRoute>
            <Dashboard />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/client/select-date"
        element={
          <UserProtectedRoute>
            <SelectDate />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/client/event-type"
        element={
          <UserProtectedRoute>
            <EventType />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/client/event-type-request"
        element={
          <UserProtectedRoute>
            <EventTypeRequest />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/client/select-venue"
        element={
          <UserProtectedRoute>
            <SelectVenue />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/client/venue-details/:id"
        element={
          <UserProtectedRoute>
            <ClientVenueDetails />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/client/home-function"
        element={
          <UserProtectedRoute>
            <HomeFunction />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/client/decoration"
        element={
          <UserProtectedRoute>
            <Decoration />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/client/browse-events"`;

if (!content.includes('/client/select-venue')) {
  content = content.replace(
    '<Route\n        path="/client/browse-events"',
    clientPremiumRoutes
  );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Restored missing client premium routes.");
