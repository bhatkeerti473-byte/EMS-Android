const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'styles', 'premium-dashboard.css');
let content = fs.readFileSync(filePath, 'utf8');

content += `\n/* New Event Card Hovers */
.t-event-card {
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}
.t-event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(234, 88, 12, 0.25);
  border-color: #ea580c;
  border-left-color: #ea580c;
}

.a-event-card {
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}
.a-event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(234, 88, 12, 0.25);
  border-color: #ea580c;
  border-left-color: #ea580c;
}
`;

fs.writeFileSync(filePath, content, 'utf8');
console.log("Added hover states.");
