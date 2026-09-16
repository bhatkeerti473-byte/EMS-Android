const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'styles', 'premium-dashboard.css');
let content = fs.readFileSync(filePath, 'utf8');

// Fix the bad replacement
content = content.replace(
`.suggested-room.all-events-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.a-event-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.a-event-img-wrap {
  height: 140px;
}`,
`.suggested-room-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s ease;
}
.suggested-room-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(79, 70, 229, 0.25);
  border-color: #818cf8;
}`
);

// Apply the intended fix
content = content.replace(
`.all-events-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}
.a-event-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.a-event-img-wrap {
  height: 100px;
}`,
`.all-events-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.a-event-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.a-event-img-wrap {
  height: 140px;
}`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Fixed CSS.");
