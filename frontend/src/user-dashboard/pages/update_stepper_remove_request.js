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
  'StayDateTime.jsx',
  'BookingSummary.jsx'
];

const basePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'pages');

for (const file of files) {
  const filePath = path.join(basePath, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the start and end of the stepper-wrapper
  const startIdx = content.indexOf('<div className="stepper-wrapper">');
  
  let nextDivIdx = content.indexOf('          <div className="', startIdx + 10);
  if (nextDivIdx === -1) {
    nextDivIdx = content.indexOf('          <div className=\'', startIdx + 10);
  }
  
  let endIdx = -1;
  if (nextDivIdx !== -1) {
      endIdx = content.lastIndexOf('</div>', nextDivIdx);
  } else {
      // In case it's the last thing before some other tag
      endIdx = content.indexOf('</div>\n\n', startIdx);
      if(endIdx === -1) endIdx = content.indexOf('</div>\n          </div>', startIdx); // just try something
  }
  
  // If still can't find endIdx cleanly, fallback
  if (endIdx === -1 || endIdx <= startIdx) {
      const endMatch = content.match(/<div className="stepper-wrapper">[\s\S]*?<\/div>(\s*<div)/);
      if (endMatch) {
          endIdx = startIdx + endMatch[0].length - endMatch[1].length - 6;
      }
  }

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    // Generate the new stepper based on the active step
    let activeStepNum = 1;
    if (file === 'SelectDate.jsx') activeStepNum = 1;
    if (file === 'EventType.jsx' || file === 'EventTypeRequest.jsx') activeStepNum = 2;
    if (file === 'SelectVenue.jsx' || file === 'HomeFunction.jsx') activeStepNum = 3;
    if (file === 'Decoration.jsx') activeStepNum = 4;
    if (file === 'Catering.jsx') activeStepNum = 5;
    if (['AdditionalServices.jsx', 'DJService.jsx', 'TransportService.jsx', 'GuestRooms.jsx', 'StayDateTime.jsx'].includes(file)) activeStepNum = 6;
    if (file === 'BookingSummary.jsx') activeStepNum = 7;

    const steps = [
      "Select Date",
      "Event Type",
      "Select Venue",
      "Decoration & Catering",
      "Hall Type", // Wait, screenshot has Hall Type as step 5, Additional Services as step 6. Let's make sure it matches screenshot.
      "Additional Services",
      "Booking Summary",
      "Payment",
      "Confirmation"
    ];

    let newStepper = '<div className="stepper-wrapper">\n            <div className="stepper-line-bg"></div>\n';
    
    for (let i = 0; i < steps.length; i++) {
      const stepNum = i + 1;
      const label = steps[i];
      let circleClass = 'step-circle';
      let labelClass = 'step-label';
      let circleContent = stepNum;
      
      if (stepNum < activeStepNum) {
        circleClass = 'step-circle completed';
        labelClass = 'step-label active';
        circleContent = '<Check size={16} />';
      } else if (stepNum === activeStepNum) {
        circleClass = 'step-circle active';
        labelClass = 'step-label active';
      }

      // If it's a point class in some versions, this is standardizing it.
      if(circleClass === 'step-circle' && stepNum > activeStepNum) {
          circleClass = 'step-label-point';
          circleContent = stepNum;
      }

      newStepper += `            <div className="step-point">
              <div className="${circleClass}">${circleContent}</div>
              <div className="${labelClass}">${label}</div>
            </div>\n`;
    }
    newStepper += '          </div>';
    
    content = content.substring(0, startIdx) + newStepper + content.substring(endIdx + 6);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated stepper in ${file}`);
  } else {
    console.log(`Stepper not found in ${file}`);
  }
}
