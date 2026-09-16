const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'pages', 'SelectVenue.jsx');

let content = fs.readFileSync(filePath, 'utf8');

const extraOptionsStart = content.indexOf('            {/* Extra Options Row */}');
const extraOptionsEnd = content.indexOf('            <div className="bottom-navigation"', extraOptionsStart);
const extraOptionsText = content.substring(extraOptionsStart, extraOptionsEnd);

content = content.substring(0, extraOptionsStart) + content.substring(extraOptionsEnd);

const resultsHeaderStart = content.indexOf('            {/* Results Header */}');
content = content.substring(0, resultsHeaderStart) + extraOptionsText + content.substring(resultsHeaderStart);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Moved Extra Options Row');
