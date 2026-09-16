const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'pages', 'SelectVenue.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add state for selected venue type
content = content.replace(
  'const [wishlist, setWishlist] = useState(() => {',
  `const [selectedVenueType, setSelectedVenueType] = useState(null);
  const [wishlist, setWishlist] = useState(() => {`
);

// 2. Add handleSelectVenue function
content = content.replace(
  'const toggleWishlist = (venueObj) => {',
  `const handleSelectVenue = () => {
    if (!selectedVenueType) {
      alert("Please select AC Hall, Non-AC Hall, or Outdoor Venue first.");
      return;
    }
    alert("Venue selected successfully!");
  };

  const toggleWishlist = (venueObj) => {`
);

// 3. Add onClick and dynamic styling to AC Hall
content = content.replace(
  /<div className="option-card small-card">\s*<Snowflake size=\{32\} className="text-blue" \/>\s*<div className="option-content">\s*<h5>AC Hall<\/h5>/m,
  `<div 
                className="option-card small-card" 
                style={selectedVenueType === 'ac' ? { border: '2px solid #ea580c', transform: 'translateY(-2px)' } : { cursor: 'pointer' }}
                onClick={() => setSelectedVenueType('ac')}
              >
                <Snowflake size={32} className="text-blue" />
                <div className="option-content">
                  <h5>AC Hall</h5>`
);

// 4. Add onClick and dynamic styling to Non-AC Hall
content = content.replace(
  /<div className="option-card small-card">\s*<Wind size=\{32\} className="text-green" \/>\s*<div className="option-content">\s*<h5>Non-AC Hall<\/h5>/m,
  `<div 
                className="option-card small-card" 
                style={selectedVenueType === 'non-ac' ? { border: '2px solid #ea580c', transform: 'translateY(-2px)' } : { cursor: 'pointer' }}
                onClick={() => setSelectedVenueType('non-ac')}
              >
                <Wind size={32} className="text-green" />
                <div className="option-content">
                  <h5>Non-AC Hall</h5>`
);

// 5. Add onClick and dynamic styling to Outdoor Venue
content = content.replace(
  /<div className="option-card small-card">\s*<div className="icon-wrapper purple-bg">[\s\S]*?<\/div>\s*<div className="option-content">\s*<h5>Outdoor Venue<\/h5>/m,
  `<div 
                className="option-card small-card" 
                style={selectedVenueType === 'outdoor' ? { border: '2px solid #ea580c', transform: 'translateY(-2px)' } : { cursor: 'pointer' }}
                onClick={() => setSelectedVenueType('outdoor')}
              >
                <div className="icon-wrapper purple-bg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5"/><path d="M9 7c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5z"/><path d="M12 17c-2.8 0-5-2.2-5-5 0-2.8 2.2-5 5-5"/></svg>
                </div>
                <div className="option-content">
                  <h5>Outdoor Venue</h5>`
);

// 6. Bind handleSelectVenue to the Select Venue button
content = content.replace(
  /<button className="btn-solid">Select Venue<\/button>/g,
  `<button className="btn-solid" onClick={handleSelectVenue}>Select Venue</button>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated SelectVenue.jsx with venue type selection logic.");
