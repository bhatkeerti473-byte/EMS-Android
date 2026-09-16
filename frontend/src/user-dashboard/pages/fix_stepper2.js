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
  const stepperStart = content.indexOf('<div className="stepper-wrapper">');
  if (stepperStart === -1) continue;

  const newStepperEndIdx = content.indexOf('          </div>', stepperStart);
  if (newStepperEndIdx === -1) continue;
  
  // Check if right after the new stepper there's another `step-point`
  let afterStepper = content.substring(newStepperEndIdx + 16, newStepperEndIdx + 100);
  if (afterStepper.includes('<div className="step-point">')) {
      console.log(`Found stray fragments in ${file}`);
      
      // We know the structure: the old fragments end with:
      //             <div className="step-label">Confirmation</div>
      //             </div>
      //           </div>
      // And then a blank line, and then `<div className="something">`
      
      const oldConfirmation = content.indexOf('<div className="step-label">Confirmation</div>', newStepperEndIdx + 20);
      if (oldConfirmation !== -1) {
          const oldStepperEndIdx = content.indexOf('          </div>', oldConfirmation);
          if (oldStepperEndIdx !== -1) {
              // Delete everything from newStepperEndIdx + 16 to oldStepperEndIdx + 16
              content = content.substring(0, newStepperEndIdx + 16) + content.substring(oldStepperEndIdx + 16);
              fs.writeFileSync(filePath, content, 'utf8');
              console.log(`Successfully fixed ${file}`);
          }
      }
  }
}
