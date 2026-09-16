const fs = require('fs');

const file = 'c:\\Users\\ASUS\\OneDrive\\Desktop\\event-management-system\\frontend\\src\\user-dashboard\\pages\\ExpectedGuests.jsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `
    const savedType = localStorage.getItem("booking_event_type_id") || localStorage.getItem("booking_event_type");
    if (savedType) setEventType(savedType);

    const savedTypeTitle = localStorage.getItem("booking_event_type_title") || localStorage.getItem("booking_event_type");
    if (savedTypeTitle) setEventTypeTitle(savedTypeTitle);

    const savedTitle = localStorage.getItem("booking_custom_title");
    if (savedTitle) setCustomTitle(savedTitle);

    const savedDate = localStorage.getItem("booking_event_date") || localStorage.getItem("booking_date");
    if (savedDate) setEventDate(savedDate);
`;

content = content.replace(/    const savedType = localStorage\.getItem\("booking_event_type_id"\);\s*if \(savedType\) setEventType\(savedType\);\s*const savedTypeTitle = localStorage\.getItem\("booking_event_type_title"\);\s*if \(savedTypeTitle\) setEventTypeTitle\(savedTypeTitle\);\s*const savedTitle = localStorage\.getItem\("booking_custom_title"\);\s*if \(savedTitle\) setCustomTitle\(savedTitle\);\s*const savedDate = localStorage\.getItem\("booking_event_date"\);\s*if \(savedDate\) setEventDate\(savedDate\);/s, replacement.trim());

// Also, wait, let's make sure the image logic correctly uses lower case without crashing
// it already has: src={eventImages[eventType?.toLowerCase()] || eventImages.other}
// so it is safe.

fs.writeFileSync(file, content, 'utf8');
console.log("Updated ExpectedGuests.jsx to handle legacy localStorage keys");
