const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'styles', 'premium-dashboard.css');
let content = fs.readFileSync(filePath, 'utf8');

// 1. flower-card
content = content.replace(
`.flower-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}`,
`.flower-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(79, 70, 229, 0.25);
  border-color: #818cf8;
}`
);

// 2. design-card
content = content.replace(
`.design-card {
  min-width: 200px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  padding-bottom: 12px;
}`,
`.design-card {
  min-width: 200px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  padding-bottom: 12px;
}
.design-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(79, 70, 229, 0.25);
  border-color: #818cf8;
}`
);

// 3. package-card
content = content.replace(
`.package-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}`,
`.package-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  cursor: pointer;
}
.package-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(79, 70, 229, 0.25);
  border-color: #818cf8;
}`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated hover states for Decoration cards.");
