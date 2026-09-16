const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'pages', 'SelectVenue.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Update imports
content = content.replace(
  'import React from "react";',
  'import React, { useState, useEffect } from "react";'
);

// Add wishlist state and toggle function
content = content.replace(
  '  const navigate = useNavigate();',
  `  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("venueWishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleWishlist = (venueId) => {
    setWishlist(prev => {
      const newWishlist = prev.includes(venueId) 
        ? prev.filter(id => id !== venueId)
        : [...prev, venueId];
      localStorage.setItem("venueWishlist", JSON.stringify(newWishlist));
      return newWishlist;
    });
  };`
);

// Update heart button
content = content.replace(
  /<button className="btn-wishlist">\s*<Heart size=\{18\} \/>\s*<\/button>/g,
  `<button 
                      className="btn-wishlist"
                      onClick={() => toggleWishlist(venue.id)}
                    >
                      <Heart 
                        size={18} 
                        color={wishlist.includes(venue.id) ? "red" : "currentColor"} 
                        fill={wishlist.includes(venue.id) ? "red" : "none"} 
                      />
                    </button>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated SelectVenue.jsx with wishlist logic.");
