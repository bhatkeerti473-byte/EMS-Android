const fs = require('fs');

const file = 'c:\\Users\\ASUS\\OneDrive\\Desktop\\event-management-system\\frontend\\src\\user-dashboard\\pages\\ExpectedGuests.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '{customTitle || eventType || "Your Event"}',
  '{customTitle || eventTypeTitle || eventType || "Your Event"}'
);

content = content.replace(
  '{eventType || "Not Selected"}',
  '{eventTypeTitle || eventType || "Not Selected"}'
);

fs.writeFileSync(file, content, 'utf8');
console.log("Updated ExpectedGuests.jsx display names");
