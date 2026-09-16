const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'styles', 'premium-dashboard.css');
let content = fs.readFileSync(filePath, 'utf8');

// 1. food-card
content = content.replace(
`.food-card:hover {
  border-color: #cbd5e1;
}`,
`.food-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(79, 70, 229, 0.25);
  border-color: #818cf8;
}`
);
content = content.replace(
`.food-card {
  flex: 1;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}`,
`.food-card {
  flex: 1;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}`
);

// 2. combo-card
content = content.replace(
`.combo-card {
  min-width: 200px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
}`,
`.combo-card {
  min-width: 200px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}
.combo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(79, 70, 229, 0.25);
  border-color: #818cf8;
}`
);

// 3. menu-item-card
content = content.replace(
`.menu-item-card {
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}`,
`.menu-item-card {
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}
.menu-item-card:hover {
  transform: translateY(-4px);
}
.menu-item-card:hover img {
  border-color: #818cf8;
  box-shadow: 0 8px 16px -4px rgba(79, 70, 229, 0.25);
}`
);

// also custom-combo which doesn't have transition
content = content.replace(
`.custom-combo {
  border: 1px dashed #ea580c;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  background: #fff7ed;
}`,
`.custom-combo {
  border: 1px dashed #ea580c;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  background: #fff7ed;
  cursor: pointer;
  transition: all 0.3s ease;
}
.custom-combo:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(79, 70, 229, 0.25);
  border-color: #ea580c;
}`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated hover states for Catering cards.");
