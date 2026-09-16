const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'styles', 'components', 'Sidebar.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add Heart icon import
content = content.replace(
  '  Phone\n} from "lucide-react";',
  '  Phone,\n  Heart\n} from "lucide-react";'
);

// Add Wishlist menu item
content = content.replace(
  '{ label: "Additional Services", icon: Gift, path: "/client/services" },',
  '{ label: "Additional Services", icon: Gift, path: "/client/services" },\n    { label: "Wishlist", icon: Heart, path: "/client/wishlist" },'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Added Wishlist to Sidebar.");
