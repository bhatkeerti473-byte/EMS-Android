const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'pages', 'EventType.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Re-add View Details to trending cards
content = content.replace(
  /<button \n                        className="btn-solid-sm"/g,
  `<button className="btn-outline-sm">View Details</button>\n                      <button \n                        className="btn-solid-sm"`
);

// Re-add View Details to all events cards
content = content.replace(
  /<button \n                        className="btn-solid-xs"/g,
  `<button className="btn-outline-xs">View Details</button>\n                      <button \n                        className="btn-solid-xs"`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Restored View Details buttons.");
