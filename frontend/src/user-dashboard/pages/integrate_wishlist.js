const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'pages', 'SelectVenue.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Update state initialization
content = content.replace(
  /const \[wishlist, setWishlist\] = useState\(\(\) => \{[\s\S]*?\}\);/m,
  `const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });`
);

// Update toggleWishlist
content = content.replace(
  /const toggleWishlist = \(venueId\) => \{[\s\S]*?localStorage\.setItem\("venueWishlist", JSON\.stringify\(newWishlist\)\);\s*return newWishlist;\s*\}\);\s*\};/m,
  `const toggleWishlist = (venueObj) => {
    setWishlist(prev => {
      const isSaved = prev.some(item => item.id === venueObj.id);
      let newWishlist;
      if (isSaved) {
        newWishlist = prev.filter(item => item.id !== venueObj.id);
      } else {
        const wishlistItem = {
          id: venueObj.id,
          title: venueObj.name,
          category: "Venue",
          location: venueObj.location,
          image: venueObj.image,
          date: "Oct 25",
          time: "Flexible",
          status: "Available",
          price: parseInt(venueObj.acCost.replace(/,/g, '')) || 0
        };
        newWishlist = [...prev, wishlistItem];
      }
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      return newWishlist;
    });
  };`
);

// Update heart button usage
content = content.replace(
  /<button\s*className="btn-wishlist"\s*onClick=\{\(\) => toggleWishlist\(venue\.id\)\}\s*>\s*<Heart\s*size=\{18\}\s*color=\{wishlist\.includes\(venue\.id\) \? "red" : "currentColor"\}\s*fill=\{wishlist\.includes\(venue\.id\) \? "red" : "none"\}\s*\/>\s*<\/button>/gm,
  `<button 
                      className="btn-wishlist"
                      onClick={() => toggleWishlist(venue)}
                    >
                      <Heart 
                        size={18} 
                        color={wishlist.some(item => item.id === venue.id) ? "red" : "currentColor"} 
                        fill={wishlist.some(item => item.id === venue.id) ? "red" : "none"} 
                      />
                    </button>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated SelectVenue to use global wishlist array of objects.");
