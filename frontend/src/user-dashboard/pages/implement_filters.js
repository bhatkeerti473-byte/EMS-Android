const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'ASUS', 'OneDrive', 'Desktop', 'event-management-system', 'frontend', 'src', 'user-dashboard', 'pages', 'SelectVenue.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add states
content = content.replace(
  'const [wishlist, setWishlist] = useState(() => {',
  `const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("All Locations");
  const [filterCapacity, setFilterCapacity] = useState("All Capacity");
  const [filterAC, setFilterAC] = useState("All");

  const [wishlist, setWishlist] = useState(() => {`
);

// 2. Update filteredVenues logic
const newFilterLogic = `const filteredVenues = useMemo(() => {
    let result = venues;
    
    // Type selected from top row
    if (selectedVenueType === 'ac') result = result.filter(v => v.ac);
    if (selectedVenueType === 'non-ac') result = result.filter(v => !v.ac);
    if (selectedVenueType === 'outdoor') result = result.filter(v => v.outdoor);

    // Search term
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(v => v.name.toLowerCase().includes(lower) || v.location.toLowerCase().includes(lower));
    }

    // Location
    if (filterLocation !== "All Locations") {
      result = result.filter(v => v.location.includes(filterLocation));
    }

    // Capacity
    if (filterCapacity !== "All Capacity") {
      result = result.filter(v => v.capacity === filterCapacity);
    }

    // AC Type
    if (filterAC !== "All") {
      result = result.filter(v => filterAC === "AC" ? v.ac : !v.ac);
    }

    return result;
  }, [selectedVenueType, searchTerm, filterLocation, filterCapacity, filterAC]);

  const uniqueLocations = ["All Locations", ...new Set(venues.map(v => v.location.split(',')[0].trim()))];
  const uniqueCapacities = ["All Capacity", ...new Set(venues.map(v => v.capacity))];

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterLocation("All Locations");
    setFilterCapacity("All Capacity");
    setFilterAC("All");
    setSelectedVenueType(null);
  };`;

content = content.replace(
  /const filteredVenues = useMemo\(\(\) => \{[\s\S]*?\}, \[selectedVenueType\]\);/,
  newFilterLogic
);

// 3. Update the filter bar JSX
const oldFilterJSX = `<div className="filter-bar">
              <div className="search-wrapper">
                <input type="text" placeholder="Search venues by name or location..." className="search-input" />
                <Search className="search-icon" size={18} />
              </div>
              <div className="filter-dropdowns">
                <div className="filter-group">
                  <label>Location</label>
                  <select><option>All Locations</option></select>
                </div>
                <div className="filter-group">
                  <label>Capacity</label>
                  <select><option>All Capacity</option></select>
                </div>
                <div className="filter-group">
                  <label>Price Range</label>
                  <select><option>All Prices</option></select>
                </div>
                <div className="filter-group">
                  <label>Venue Type</label>
                  <select><option>All Types</option></select>
                </div>
                <div className="filter-group">
                  <label>AC Type</label>
                  <select><option>All (AC/Non-AC)</option></select>
                </div>
                <button className="btn-reset">Reset</button>
              </div>
            </div>`;

const newFilterJSX = `<div className="filter-bar">
              <div className="search-wrapper">
                <input 
                  type="text" 
                  placeholder="Search venues by name or location..." 
                  className="search-input" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="search-icon" size={18} />
              </div>
              <div className="filter-dropdowns">
                <div className="filter-group">
                  <label>Location</label>
                  <select value={filterLocation} onChange={e => setFilterLocation(e.target.value)}>
                    {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Capacity</label>
                  <select value={filterCapacity} onChange={e => setFilterCapacity(e.target.value)}>
                    {uniqueCapacities.map(cap => <option key={cap} value={cap}>{cap}</option>)}
                  </select>
                </div>
                <div className="filter-group">
                  <label>AC Type</label>
                  <select value={filterAC} onChange={e => setFilterAC(e.target.value)}>
                    <option value="All">All (AC/Non-AC)</option>
                    <option value="AC">AC Hall</option>
                    <option value="Non-AC">Non-AC Hall</option>
                  </select>
                </div>
                <button className="btn-reset" onClick={handleResetFilters}>Reset</button>
              </div>
            </div>`;

content = content.replace(oldFilterJSX, newFilterJSX);

// 4. Update the Results Header count
content = content.replace(
  /<span className="results-count">\d+ Venues Found<\/span>/,
  `<span className="results-count">{filteredVenues.length} Venues Found</span>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated SelectVenue.jsx with functional filter bar.");
