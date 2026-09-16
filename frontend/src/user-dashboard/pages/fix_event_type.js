const fs = require('fs');

const file = 'c:\\Users\\ASUS\\OneDrive\\Desktop\\event-management-system\\frontend\\src\\user-dashboard\\pages\\EventType.jsx';
let content = fs.readFileSync(file, 'utf8');

// The original file (since we checked out) has `navigate("/client/select-venue");`
// And `Continue to Venue Selection <ArrowRight size={20} />`

content = content.replace(
    'navigate("/client/select-venue");',
    'navigate("/client/expected-guests");'
);

content = content.replace(
    'Continue to Venue Selection <ArrowRight size={20} />',
    'Continue to Expected Guests <ArrowRight size={20} />'
);

fs.writeFileSync(file, content, 'utf8');
console.log("Replaced navigation in EventType.jsx to expected-guests");
