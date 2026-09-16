const fs = require('fs');

const file = 'c:\\Users\\ASUS\\OneDrive\\Desktop\\event-management-system\\frontend\\src\\user-dashboard\\pages\\ExpectedGuests.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace imports if needed
if (!content.includes('Calendar')) {
    content = content.replace('MapPin } from', 'MapPin, Calendar } from');
}

// Add state variables
const stateVars = `
  const [guestCount, setGuestCount] = useState(150);
  const [eventType, setEventType] = useState("Wedding");
  const [eventDate, setEventDate] = useState("");
  const [customTitle, setCustomTitle] = useState("");

  const eventImages = {
    wedding: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    reception: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    engagement: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
    birthday: "https://images.unsplash.com/photo-1530103862676-de8892ebeea0?auto=format&fit=crop&w=800&q=80",
    anniversary: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
    corporate: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    other: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80"
  };
`;

content = content.replace(/  const \[guestCount, setGuestCount\] = useState\(150\);\n  const \[venueDetails, setVenueDetails\] = useState\(null\);/s, stateVars);

// Replace useEffect
const useEffectContent = `
  useEffect(() => {
    // Load previously saved guest count
    const savedCount = localStorage.getItem("booking_guest_count");
    if (savedCount) setGuestCount(Number(savedCount));

    const savedType = localStorage.getItem("booking_event_type");
    if (savedType) setEventType(savedType);

    const savedTitle = localStorage.getItem("booking_custom_title");
    if (savedTitle) setCustomTitle(savedTitle);

    const savedDate = localStorage.getItem("booking_date");
    if (savedDate) setEventDate(savedDate);
  }, []);
`;

content = content.replace(/  useEffect\(\(\) => \{[\s\S]*?  \}, \[\]\);/s, useEffectContent.trim());

// Replace Right Sidebar
const rightSidebarRegex = /\{\/\* Right Sidebar \*\/\}.*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/s;

const rightSidebarContent = `{/* Right Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <div style={{ height: '180px', overflow: 'hidden' }}>
                  <img 
                    src={eventImages[eventType?.toLowerCase()] || eventImages.other} 
                    alt="Event Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div style={{ background: '#e0e7ff', padding: '10px', borderRadius: '12px', color: '#4f46e5' }}>
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
                        {customTitle || eventType || "Your Event"}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '13px' }}>
                        <Calendar size={14} />
                        {eventDate ? new Date(eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : "Date Not Selected"}
                      </div>
                    </div>
                  </div>

                  <h5 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0' }}>Booking Summary</h5>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Event Type</div>
                        <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '700', textTransform: 'capitalize' }}>{eventType || "Not Selected"}</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        <Users size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Expected Guests</div>
                        <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '700' }}>{guestCount} Guests</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', flexShrink: 0 }}>
                  <HeadphonesIcon size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>Need Help?</h4>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                    Our event specialists are here to assist you in choosing the perfect venue and services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpectedGuests;`;

content = content.replace(rightSidebarRegex, rightSidebarContent);

fs.writeFileSync(file, content, 'utf8');
console.log("Updated ExpectedGuests.jsx sidebar to show event details");
