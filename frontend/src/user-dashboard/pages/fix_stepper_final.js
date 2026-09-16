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
  
  // Find the start of the stepper
  const startIdx = content.indexOf('<div className="stepper-wrapper">');
  if (startIdx === -1) continue;

  // Find the end of the stepper. 
  // It's followed by `\n          <div className="...container"` or similar.
  // We can look for the next `          <div className="` that is NOT `step-`
  let endIdx = -1;
  let searchIdx = startIdx + 30;
  while (true) {
      const nextDiv = content.indexOf('          <div className="', searchIdx);
      if (nextDiv === -1) break;
      
      const classStart = nextDiv + 26;
      const classEnd = content.indexOf('"', classStart);
      const className = content.substring(classStart, classEnd);
      
      if (!className.startsWith('step-')) {
          endIdx = nextDiv;
          break;
      }
      searchIdx = nextDiv + 10;
  }
  
  if (endIdx === -1) {
      console.log(`Could not find end of stepper for ${file}`);
      continue;
  }
  
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
    "Hall Type", 
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

    if (circleClass === 'step-circle' && stepNum > activeStepNum) {
        circleClass = 'step-label-point';
        circleContent = stepNum;
    }

    newStepper += `            <div className="step-point">
              <div className="${circleClass}">${circleContent}</div>
              <div className="${labelClass}">${label}</div>
            </div>\n`;
  }
  newStepper += '          </div>\n\n';
  
  // Actually, wait! BookingSummary.jsx uses a slightly different indent for the stepper!
  if (file === 'BookingSummary.jsx') {
      // In BookingSummary, stepper-wrapper is indented 12 spaces, and the next div might be `<div className="flex justify-between`
      // I will skip BookingSummary since it's already correct.
      continue;
  }

  content = content.substring(0, startIdx) + newStepper + content.substring(endIdx);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fully fixed stepper in ${file}`);
}
