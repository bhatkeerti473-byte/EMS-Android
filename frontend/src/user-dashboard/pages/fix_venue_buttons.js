const fs = require('fs');
const path = require('path');

const cssPath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'styles', 'premium-dashboard.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Revert btn-outline-sm
cssContent = cssContent.replace(
  /\.btn-outline-sm\s*\{\s*background:\s*#fff7ed;\s*border:\s*1px solid #fdba74;\s*color:\s*#ea580c;\s*\}/,
  `.btn-outline-sm {\r\n  background: white;\r\n  border: 1px solid #cbd5e1;\r\n  color: #475569;\r\n}`
);
cssContent = cssContent.replace(
  /\.btn-outline-sm:hover\s*\{\s*background:\s*#ffedd5;\s*border-color:\s*#fb923c;\s*\}/,
  `.btn-outline-sm:hover {\r\n  background: #f8fafc;\r\n  border-color: #94a3b8;\r\n}`
);

// Revert btn-outline-xs
cssContent = cssContent.replace(
  /\.btn-outline-xs\s*\{\s*background:\s*#fff7ed;\s*border:\s*1px solid #fdba74;\s*color:\s*#ea580c;\s*\}/,
  `.btn-outline-xs {\r\n  background: white;\r\n  border: 1px solid #cbd5e1;\r\n  color: #475569;\r\n}`
);
cssContent = cssContent.replace(
  /\.btn-outline-xs:hover\s*\{\s*background:\s*#ffedd5;\s*border-color:\s*#fb923c;\s*\}/,
  `.btn-outline-xs:hover {\r\n  background: #f8fafc;\r\n}`
);

// Add light orange button for venue
cssContent += `\n.btn-outline-light-orange {
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff7ed;
  border: 1px solid #fdba74;
  color: #ea580c;
  flex: 1;
}
.btn-outline-light-orange:hover {
  background: #ffedd5;
  border-color: #fb923c;
}\n`;

fs.writeFileSync(cssPath, cssContent, 'utf8');

const venuePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'pages', 'SelectVenue.jsx');
let venueContent = fs.readFileSync(venuePath, 'utf8');

venueContent = venueContent.replace(
  /<button className="btn-outline">View Details<\/button>/g,
  `<button className="btn-outline-light-orange">View Details</button>`
);

fs.writeFileSync(venuePath, venueContent, 'utf8');

console.log("Reverted Event Type buttons and updated Venue View Details buttons.");
