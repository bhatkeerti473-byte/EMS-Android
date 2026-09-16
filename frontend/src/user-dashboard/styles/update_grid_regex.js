const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'styles', 'premium-dashboard.css');
let content = fs.readFileSync(filePath, 'utf8');

// Use regex to avoid CRLF/LF issues
content = content.replace(
  /\.all-events-grid\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*repeat\(6,\s*1fr\);\s*gap:\s*16px;\s*\}/,
  `.all-events-grid {\r\n  display: grid;\r\n  grid-template-columns: repeat(4, 1fr);\r\n  gap: 20px;\r\n}`
);

content = content.replace(
  /\.a-event-img-wrap\s*\{\s*height:\s*100px;\s*\}/,
  `.a-event-img-wrap {\r\n  height: 140px;\r\n}`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Regex replace finished.");
