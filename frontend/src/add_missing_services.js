const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add missing imports if not present
const missingImports = `
import DJService from "./user-dashboard/pages/DJService";
import TransportService from "./user-dashboard/pages/TransportService";
import GuestRooms from "./user-dashboard/pages/GuestRooms";
import StayDateTime from "./user-dashboard/pages/StayDateTime";
`;

if (!content.includes('import DJService')) {
  content = content.replace(
    'import AdditionalServices from "./user-dashboard/pages/AdditionalServices";',
    'import AdditionalServices from "./user-dashboard/pages/AdditionalServices";\n' + missingImports
  );
}

// Add missing routes
const missingRoutes = `
      <Route path="/client/dj-service" element={<UserProtectedRoute><DJService /></UserProtectedRoute>} />
      <Route path="/client/transport-service" element={<UserProtectedRoute><TransportService /></UserProtectedRoute>} />
      <Route path="/client/guest-rooms" element={<UserProtectedRoute><GuestRooms /></UserProtectedRoute>} />
      <Route path="/client/stay-date-time" element={<UserProtectedRoute><StayDateTime /></UserProtectedRoute>} />
      <Route path="/client/booking-summary" element={<UserProtectedRoute><BookingSummary /></UserProtectedRoute>} />
`;

if (!content.includes('path="/client/dj-service"')) {
  content = content.replace(
    /<Route path="\/client\/summary" element=\{<UserProtectedRoute><BookingSummary \/><\/UserProtectedRoute>\} \/>/,
    '<Route path="/client/summary" element={<UserProtectedRoute><BookingSummary /></UserProtectedRoute>} />\n' + missingRoutes
  );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Restored additional missing routes in App.jsx.");
