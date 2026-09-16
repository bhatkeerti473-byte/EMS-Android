const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'styles', 'premium-dashboard.css');
let content = fs.readFileSync(filePath, 'utf8');

// Update btn-outline-sm
content = content.replace(
  /\.btn-outline-sm\s*\{\s*background:\s*white;\s*border:\s*1px solid #cbd5e1;\s*color:\s*#475569;\s*\}/,
  `.btn-outline-sm {\r\n  background: #fff7ed;\r\n  border: 1px solid #fdba74;\r\n  color: #ea580c;\r\n}`
);

content = content.replace(
  /\.btn-outline-sm:hover\s*\{\s*background:\s*#f8fafc;\s*border-color:\s*#94a3b8;\s*\}/,
  `.btn-outline-sm:hover {\r\n  background: #ffedd5;\r\n  border-color: #fb923c;\r\n}`
);

// Update btn-outline-xs
content = content.replace(
  /\.btn-outline-xs\s*\{\s*background:\s*white;\s*border:\s*1px solid #cbd5e1;\s*color:\s*#475569;\s*\}/,
  `.btn-outline-xs {\r\n  background: #fff7ed;\r\n  border: 1px solid #fdba74;\r\n  color: #ea580c;\r\n}`
);

content = content.replace(
  /\.btn-outline-xs:hover\s*\{\s*background:\s*#f8fafc;\s*\}/,
  `.btn-outline-xs:hover {\r\n  background: #ffedd5;\r\n  border-color: #fb923c;\r\n}`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated View Details buttons styling to light orange theme.");
