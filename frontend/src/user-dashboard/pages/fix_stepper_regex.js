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
  
  // Calculate active step
  let activeStepNum = 1;
  if (file === 'SelectDate.jsx') activeStepNum = 1;
  if (file === 'EventType.jsx' || file === 'EventTypeRequest.jsx') activeStepNum = 2;
  if (file === 'SelectVenue.jsx' || file === 'HomeFunction.jsx') activeStepNum = 3;
  if (file === 'Decoration.jsx') activeStepNum = 4;
  if (file === 'Catering.jsx') activeStepNum = 5;
  if (['AdditionalServices.jsx', 'DJService.jsx', 'TransportService.jsx', 'GuestRooms.jsx', 'StayDateTime.jsx'].includes(file)) activeStepNum = 6;

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
  newStepper += '          </div>\n';
  
  // Regex to match the current stepper (whether empty or full)
  // It stops right before the next <div className="[not step or stepper]...
  const regex = /<div className="stepper-wrapper">[\s\S]*?(?=\n\s*<div className="(?!stepper|step)[a-zA-Z0-9-_]+)/;
  
  if (regex.test(content)) {
      content = content.replace(regex, newStepper);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Successfully fixed ${file}`);
  } else {
      console.log(`Regex did not match in ${file}`);
  }
}
