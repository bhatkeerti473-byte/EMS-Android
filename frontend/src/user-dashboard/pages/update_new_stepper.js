const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\ASUS\\OneDrive\\Desktop\\event-management-system\\frontend\\src\\user-dashboard\\pages';

const steps = [
    { num: 1, label: 'Select Date', file: 'SelectDate.jsx' },
    { num: 2, label: 'Event Type', file: 'EventType.jsx' },
    { num: 3, label: 'Expected Guests', file: 'ExpectedGuests.jsx' },
    { num: 4, label: 'Select Venue', file: 'SelectVenue.jsx' },
    { num: 5, label: 'Decoration Style', file: 'Decoration.jsx' },
    { num: 6, label: 'Catering Options', file: 'Catering.jsx' },
    { num: 7, label: 'Additional Services', file: 'AdditionalServices.jsx' },
    { num: 8, label: 'Booking Summary', file: 'BookingSummary.jsx' }
];

const generateStepper = (activeNum) => {
    let html = '<div className="stepper-wrapper" style={{ margin: "20px 32px 10px" }}>\n';
    html += '            <div className="stepper-line-bg"></div>\n';
    
    // We need to calculate the width of the active line.
    // There are 8 steps, so 7 intervals.
    const intervalPercentage = 100 / 7;
    const progressWidth = (activeNum - 1) * intervalPercentage;
    
    html += `            <div className="stepper-line-active" style={{ width: "${progressWidth}%", background: '#ea580c' }}></div>\n`;
    
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const isActive = step.num === activeNum;
        const isPast = step.num < activeNum;
        
        html += '            <div className="step-point">\n';
        if (isActive) {
            html += `              <div className="step-circle active" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>${step.num}</div>\n`;
            html += `              <div className="step-label active" style={{color: '#ea580c', fontWeight: 600}}>${step.label}</div>\n`;
        } else if (isPast) {
            html += `              <div className="step-circle" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>${step.num}</div>\n`;
            html += `              <div className="step-label" style={{color: '#ea580c', fontWeight: 500}}>${step.label}</div>\n`;
        } else {
            html += `              <div className="step-label-point">${step.num}</div>\n`;
            html += `              <div className="step-label">${step.label}</div>\n`;
        }
        html += '            </div>\n';
    }
    
    html += '          </div>';
    return html;
};

steps.forEach(step => {
    const filePath = path.join(dir, step.file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find the stepper-wrapper
        const startRegex = /<div className="stepper-wrapper"[^>]*>/;
        const match = content.match(startRegex);
        
        if (match) {
            const startIndex = match.index;
            let openTags = 0;
            let endIndex = -1;
            
            // simple parser to find the closing div of stepper-wrapper
            for (let i = startIndex; i < content.length; i++) {
                if (content.substring(i, i + 4) === '<div') {
                    openTags++;
                } else if (content.substring(i, i + 5) === '</div') {
                    openTags--;
                    if (openTags === 0) {
                        endIndex = i + 6; // include closing >
                        break;
                    }
                }
            }
            
            if (endIndex !== -1) {
                const newStepper = generateStepper(step.num);
                content = content.substring(0, startIndex) + newStepper + content.substring(endIndex);
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Updated stepper in ${step.file}`);
            } else {
                console.log(`Could not find closing tag for stepper in ${step.file}`);
            }
        } else {
            console.log(`Could not find stepper in ${step.file}`);
        }
    } else {
        console.log(`File not found: ${step.file}`);
    }
});
