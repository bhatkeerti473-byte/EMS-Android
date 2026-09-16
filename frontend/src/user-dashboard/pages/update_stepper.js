const fs = require('fs');
const path = require('path');

const files = [
  'SelectDate.jsx',
  'EventType.jsx',
  'EventTypeRequest.jsx',
  'SelectVenue.jsx',
  'HomeFunction.jsx',
  'Decoration.jsx',
  'Catering.jsx'
];

const basePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'pages');

for (const file of files) {
  const filePath = path.join(basePath, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the start and end of the stepper-wrapper
  const startIdx = content.indexOf('<div className="stepper-wrapper">');
  const endStr = '</div>\n\n          <div className="';
  const endStrAlt = '</div>\n\n          <div className=\'';
  
  let nextDivIdx = content.indexOf('          <div className="', startIdx + 10);
  if (nextDivIdx === -1) {
    nextDivIdx = content.indexOf('          <div className=\'', startIdx + 10);
  }
  
  const endIdx = content.lastIndexOf('</div>', nextDivIdx);
  
  if (startIdx !== -1 && endIdx !== -1) {
    // Generate the new stepper based on the active step
    let activeStepNum = 1;
    if (file === 'SelectDate.jsx') activeStepNum = 1;
    if (file === 'EventType.jsx') activeStepNum = 2;
    if (file === 'SelectVenue.jsx') activeStepNum = 3;
    if (file === 'HomeFunction.jsx') activeStepNum = 3;
    if (file === 'Decoration.jsx') activeStepNum = 4;
    if (file === 'Catering.jsx') activeStepNum = 5;

    const steps = [
      "Select Date",
      "Event Type",
      "Select Venue",
      "Decoration",
      "Catering",
      "Additional Services",
      "Booking Request",
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
      
      // Some files use step-label-point for later steps in old versions, but step-circle is fine.
      if (stepNum < activeStepNum) {
        circleClass = 'step-circle completed';
        labelClass = 'step-label active';
        circleContent = '<Check size={16} />';
      } else if (stepNum === activeStepNum) {
        circleClass = 'step-circle active';
        labelClass = 'step-label active';
      }

      newStepper += `            
            <div className="step-point">
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
