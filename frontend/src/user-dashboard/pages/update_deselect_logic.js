const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'pages', 'EventType.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add handleSelectEvent function
content = content.replace(
  '  const handleContinue = () => {',
  `  const handleSelectEvent = (id) => {
    if (selectedEventType === id) {
      setSelectedEventType(null);
    } else {
      setSelectedEventType(id);
    }
  };

  const handleContinue = () => {`
);

// Replace setSelectedEventType calls
content = content.replace(
  /onClick=\{\(\) => setSelectedEventType\(event\.id\)\}/g,
  'onClick={() => handleSelectEvent(event.id)}'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated EventType.jsx for deselection logic.");
