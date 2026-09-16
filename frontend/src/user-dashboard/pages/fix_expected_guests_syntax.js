const fs = require('fs');

const file = 'c:\\Users\\ASUS\\OneDrive\\Desktop\\event-management-system\\frontend\\src\\user-dashboard\\pages\\ExpectedGuests.jsx';
let content = fs.readFileSync(file, 'utf8');

const exportIndex = content.indexOf('export default ExpectedGuests;');
if (exportIndex !== -1) {
    content = content.substring(0, exportIndex + 'export default ExpectedGuests;'.length) + '\n';
}

fs.writeFileSync(file, content, 'utf8');
console.log("Fixed duplicate end of file");
