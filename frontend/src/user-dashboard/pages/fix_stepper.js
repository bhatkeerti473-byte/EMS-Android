const fs = require('fs');
const path = require('path');

const files = [
  'SelectDate.jsx',
  'EventType.jsx',
  'EventTypeRequest.jsx',
  'SelectVenue.jsx',
  'HomeFunction.jsx',
  'Decoration.jsx',
  'Catering.jsx',
  'AdditionalServices.jsx',
  'DJService.jsx',
  'TransportService.jsx',
  'GuestRooms.jsx',
  'StayDateTime.jsx'
];

const basePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'pages');

for (const file of files) {
  const filePath = path.join(basePath, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find where the new stepper ends:
  const newStepperEndIdx = content.indexOf('          </div>', content.indexOf('<div className="stepper-wrapper">'));
  
  // Look right after it. Is there a stray <div className="step-point"> ?
  const searchStr = '            \n            <div className="step-point">';
  const strayIdx = content.indexOf(searchStr, newStepperEndIdx);
  
  if (strayIdx !== -1 && strayIdx - newStepperEndIdx < 20) {
      // Find the end of these fragments which is the next `          </div>` that has nothing but step-points before it
      let fragmentEndIdx = content.indexOf('          </div>\n', strayIdx);
      if(fragmentEndIdx !== -1) {
          // Add length of the closing tag and newline
          content = content.substring(0, strayIdx) + content.substring(fragmentEndIdx + 17);
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Fixed stray fragments in ${file}`);
      }
  } else {
      // Check alternative pattern without newline
      const altSearchStr = '\n            <div className="step-point">';
      const altStrayIdx = content.indexOf(altSearchStr, newStepperEndIdx);
      if(altStrayIdx !== -1 && altStrayIdx - newStepperEndIdx < 20) {
          let fragmentEndIdx = content.indexOf('          </div>\n', altStrayIdx);
          if(fragmentEndIdx !== -1) {
              content = content.substring(0, altStrayIdx) + content.substring(fragmentEndIdx + 17);
              fs.writeFileSync(filePath, content, 'utf8');
              console.log(`Fixed stray fragments in ${file}`);
          }
      } else {
          console.log(`No stray fragments found in ${file}`);
      }
  }
}
