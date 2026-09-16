const fs = require('fs');
const path = require('path');

const fileEndings = {
  'SelectDate.jsx': '<div className="calendar-layout">',
  'EventType.jsx': '<div className="content-container"',
  'EventTypeRequest.jsx': '<div className="content-container"',
  'SelectVenue.jsx': '<div className="content-container"',
  'HomeFunction.jsx': '<div className="content-container"',
  'Decoration.jsx': '<div className="content-container"',
  'Catering.jsx': '<div className="content-container"',
  'AdditionalServices.jsx': '<div className="services-container"',
  'DJService.jsx': '<div className="services-container"',
  'TransportService.jsx': '<div className="services-container"',
  'GuestRooms.jsx': '<div className="guest-rooms-container"',
  'StayDateTime.jsx': '<div className="stay-datetime-container"'
};

const basePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'pages');

for (const [file, endMarker] of Object.entries(fileEndings)) {
  const filePath = path.join(basePath, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  const startIdx = content.indexOf('<div className="stepper-wrapper">');
  if (startIdx === -1) continue;
  
  const endIdx = content.indexOf(endMarker, startIdx);
  if (endIdx === -1) {
      console.log(`Could not find end marker ${endMarker} in ${file}`);
      continue;
  }
  
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
  newStepper += '          </div>\n\n          ';
  
  content = content.substring(0, startIdx) + newStepper + content.substring(endIdx);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully fixed ${file}`);
}
