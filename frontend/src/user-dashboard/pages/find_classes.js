const fs = require('fs');
const path = require('path');

const files = [
  'EventType.jsx',
  'EventTypeRequest.jsx',
  'SelectVenue.jsx',
  'HomeFunction.jsx',
  'Decoration.jsx',
  'Catering.jsx',
  'DJService.jsx',
  'TransportService.jsx'
];

const basePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'pages');

for (const file of files) {
  const filePath = path.join(basePath, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  const startIdx = content.indexOf('<div className="stepper-wrapper">');
  if (startIdx !== -1) {
      // Print the first 5 tags that are a div with a className immediately after the stepper
      const nextText = content.substring(startIdx, startIdx + 800);
      console.log(`\n\n--- ${file} ---`);
      
      const matches = nextText.match(/<div className="[^"]+"/g);
      if (matches) {
          console.log(matches.slice(0, 15).join('\n'));
      }
  }
}
