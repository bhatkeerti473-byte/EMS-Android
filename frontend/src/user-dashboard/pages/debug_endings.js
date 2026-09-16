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
  if (startIdx === -1) continue;
  
  // Find the next 10 lines after the old stepper
  const oldStepperEnd = content.indexOf('          </div>\n\n', startIdx);
  if (oldStepperEnd !== -1) {
      const nextFewLines = content.substring(oldStepperEnd, oldStepperEnd + 200);
      console.log(`\n--- ${file} ---`);
      console.log(nextFewLines);
  } else {
      // Find the last step-point
      const lastStepPoint = content.lastIndexOf('<div className="step-label">Confirmation</div>');
      if (lastStepPoint !== -1) {
          const actualEnd = content.indexOf('          </div>\n\n', lastStepPoint);
          if (actualEnd !== -1) {
              const nextFewLines = content.substring(actualEnd, actualEnd + 200);
              console.log(`\n--- ${file} ---`);
              console.log(nextFewLines);
          }
      }
  }
}
