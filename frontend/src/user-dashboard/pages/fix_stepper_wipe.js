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
  
  // Find the exact broken fragment that was left behind
  // It starts with `          <div className="stepper-line-bg"></div>`
  const fragmentStart = content.indexOf('          <div className="stepper-line-bg"></div>');
  
  if (fragmentStart !== -1) {
      // Find the end of this old stepper fragment, which is `          </div>\n\n`
      // But we need to make sure we skip any `            </div>` (12 spaces)
      // Actually, we can just look for the last `Confirmation</div>\n            </div>\n          </div>`
      const confIdx = content.indexOf('<div className="step-label">Confirmation</div>', fragmentStart);
      if (confIdx !== -1) {
          const fragmentEnd = content.indexOf('          </div>\n\n', confIdx);
          if (fragmentEnd !== -1) {
              // Now we have the range!
              // But wait, there might be leading newlines before fragmentStart that we want to clean up
              let deleteStart = fragmentStart;
              while (content[deleteStart - 1] === '\n' || content[deleteStart - 1] === '\r') {
                  deleteStart--;
              }
              const deleteEnd = fragmentEnd + 18; // length of `          </div>\n\n`
              
              content = content.substring(0, deleteStart) + '\n\n' + content.substring(deleteEnd);
              fs.writeFileSync(filePath, content, 'utf8');
              console.log(`Cleaned up fragments in ${file}`);
          } else {
              console.log(`Could not find end of fragment in ${file}`);
          }
      } else {
          console.log(`Could not find Confirmation in fragment of ${file}`);
      }
  } else {
      console.log(`No fragment start found in ${file} (already clean)`);
  }
}
