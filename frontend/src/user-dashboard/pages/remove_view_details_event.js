const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'pages', 'EventType.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Remove View Details from trending cards
content = content.replace(
  /<button className="btn-outline-sm">View Details<\/button>\r?\n\s*<button/g,
  '<button'
);

// Remove View Details from all events cards
content = content.replace(
  /<button className="btn-outline-xs">View Details<\/button>\r?\n\s*<button/g,
  '<button'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Removed View Details buttons from Event Type page.");
