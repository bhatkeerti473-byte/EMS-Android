const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add missing imports
const missingImports = `
import SelectDate from "./user-dashboard/pages/SelectDate";
import EventType from "./user-dashboard/pages/EventType";
import EventTypeRequest from "./user-dashboard/pages/EventTypeRequest";
import SelectVenue from "./user-dashboard/pages/SelectVenue";
import HomeFunction from "./user-dashboard/pages/HomeFunction";
import Decoration from "./user-dashboard/pages/Decoration";
import Catering from "./user-dashboard/pages/Catering";
import AdditionalServices from "./user-dashboard/pages/AdditionalServices";
import BookingSummary from "./user-dashboard/pages/BookingSummary";
import ClientVenueDetails from "./user-dashboard/pages/ClientVenueDetails";
`;

if (!content.includes('import SelectDate')) {
  content = content.replace(
    'import Dashboard from "./user-dashboard/pages/Dashboard";',
    'import Dashboard from "./user-dashboard/pages/Dashboard";\n' + missingImports
  );
}

// 2. Add missing routes
const missingRoutes = `
      {/* --- Restored Premium Flow Routes --- */}
      <Route path="/client/dashboard" element={<UserProtectedRoute><Dashboard /></UserProtectedRoute>} />
      <Route path="/client/select-date" element={<UserProtectedRoute><SelectDate /></UserProtectedRoute>} />
      <Route path="/client/event-type" element={<UserProtectedRoute><EventType /></UserProtectedRoute>} />
      <Route path="/client/event-type-request" element={<UserProtectedRoute><EventTypeRequest /></UserProtectedRoute>} />
      <Route path="/client/select-venue" element={<UserProtectedRoute><SelectVenue /></UserProtectedRoute>} />
      <Route path="/client/venue-details/:id" element={<UserProtectedRoute><ClientVenueDetails /></UserProtectedRoute>} />
      <Route path="/client/home-function" element={<UserProtectedRoute><HomeFunction /></UserProtectedRoute>} />
      <Route path="/client/decoration" element={<UserProtectedRoute><Decoration /></UserProtectedRoute>} />
      <Route path="/client/catering" element={<UserProtectedRoute><Catering /></UserProtectedRoute>} />
      <Route path="/client/services" element={<UserProtectedRoute><AdditionalServices /></UserProtectedRoute>} />
      <Route path="/client/summary" element={<UserProtectedRoute><BookingSummary /></UserProtectedRoute>} />
      <Route path="/client/confirmation" element={<UserProtectedRoute><BookingSummary /></UserProtectedRoute>} />
`;

if (!content.includes('path="/client/select-date"')) {
  content = content.replace(
    /<Route\s*path="\/client\/browse-events"/,
    missingRoutes + '\n      <Route\n        path="/client/browse-events"'
  );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Restored all missing routes and imports in App.jsx.");
