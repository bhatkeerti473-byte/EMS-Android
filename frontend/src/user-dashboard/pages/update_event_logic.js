const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'pages', 'EventType.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add useState import
content = content.replace('import React from "react";', 'import React, { useState } from "react";');

// Add state and handleContinue function
content = content.replace(
  '  const navigate = useNavigate();',
  `  const navigate = useNavigate();\n  const [selectedEventType, setSelectedEventType] = useState(null);\n\n  const handleContinue = () => {\n    if (!selectedEventType) {\n      alert("Please select an Event Type to continue.");\n      return;\n    }\n    navigate("/client/select-venue");\n  };`
);

// Update trending button
content = content.replace(
  /<button className="btn-solid-sm">Select<\/button>/g,
  `<button 
                        className="btn-solid-sm"
                        style={selectedEventType === event.id ? { backgroundColor: '#22c55e', borderColor: '#22c55e' } : {}}
                        onClick={() => setSelectedEventType(event.id)}
                      >
                        {selectedEventType === event.id ? "Selected" : "Select"}
                      </button>`
);

// Update all events button
content = content.replace(
  /<button className="btn-solid-xs">Select<\/button>/g,
  `<button 
                        className="btn-solid-xs"
                        style={selectedEventType === event.id ? { backgroundColor: '#22c55e', borderColor: '#22c55e' } : {}}
                        onClick={() => setSelectedEventType(event.id)}
                      >
                        {selectedEventType === event.id ? "Selected" : "Select"}
                      </button>`
);

// Update Continue button
content = content.replace(
  `onClick={() => navigate("/client/select-venue")}`,
  `onClick={handleContinue}`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated EventType.jsx with state logic.");
