const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'pages', 'EventType.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const newEventTypes = `  const eventTypes = [
    {
      id: "wedding",
      title: "Wedding",
      description: "Celebrate your special day with beautiful memories.",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "reception",
      title: "Reception",
      description: "Host a grand reception for your loved ones.",
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "engagement",
      title: "Engagement",
      description: "Mark the beginning of your journey together.",
      image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "birthday",
      title: "Birthday Party",
      description: "Make your birthday celebration fun and memorable.",
      image: "https://images.unsplash.com/photo-1530103862676-de8892bc952f?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "anniversary",
      title: "Anniversary",
      description: "Celebrate your love and cherish every moment.",
      image: "https://images.unsplash.com/photo-1505932794465-147d1f1b2c97?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "corporate",
      title: "Corporate Event",
      description: "Organize professional events that leave a lasting impact.",
      image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "babyshower",
      title: "Baby Shower",
      description: "Celebrate the upcoming arrival of your little one.",
      image: "https://images.unsplash.com/photo-1555252117-426573fce58e?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "naming",
      title: "Naming Ceremony",
      description: "Welcome your little one with love and blessings.",
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
    }
  ];`;

const startIndex = content.indexOf('  const eventTypes = [');
const endIndex = content.indexOf('  ];', startIndex) + 4;

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newEventTypes + content.substring(endIndex);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Successfully reverted EventType data!");
} else {
  console.log("Could not find eventTypes array bounds.");
}
