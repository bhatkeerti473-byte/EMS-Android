const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'styles', 'premium-dashboard.css');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
`.all-events-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}`,
`.all-events-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}`
);

content = content.replace(
`.a-event-img-wrap {
  height: 100px;
}`,
`.a-event-img-wrap {
  height: 140px;
}`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Fixed all-events-grid CSS.");
