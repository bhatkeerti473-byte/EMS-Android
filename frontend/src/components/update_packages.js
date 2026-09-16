const fs = require('fs');

const file = 'c:\\Users\\ASUS\\OneDrive\\Desktop\\event-management-system\\frontend\\src\\components\\FeaturedOfferPackages.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Modify getPackagePriceInfo
let getPackagePriceInfoReplacement = `const getPackagePriceInfo = (pkg, enabledServices, cateringType = "both", customGuests = null) => {
  let originalPrice = 0;
  let breakdown = [];
  
  const baseGuests = parseInt(pkg.guests) || 1;
  const guestsMultiplier = customGuests ? (customGuests / baseGuests) : 1;
  
  pkg.includedServices.forEach(service => {
    if (enabledServices.has(service)) {
      let cost = pkg.serviceCosts[service] || 0;
      
      if (isCateringService(service)) {
        cost = cost * guestsMultiplier;
        const isDefaultVegOnly = service.toLowerCase().includes("veg menu");
        if (cateringType === "veg") {
          cost = isDefaultVegOnly ? cost : Math.round(cost * 0.75);
        } else if (cateringType === "nonveg") {
          cost = isDefaultVegOnly ? Math.round(cost * 1.2) : Math.round(cost * 0.90);
        } else if (cateringType === "both") {
          cost = isDefaultVegOnly ? Math.round(cost * 1.3) : cost;
        }
        
        const nameSuffix = cateringType === "both" ? " (Veg & Non-Veg)" : (cateringType === "veg" ? " (Veg Only)" : " (Non-Veg Only)");
        breakdown.push({ item: service, displayItem: \`\${service}\${nameSuffix}\`, costStr: \`₹\${cost.toLocaleString()}\`, costNum: cost });
      } else {
        breakdown.push({ item: service, displayItem: service, costStr: \`₹\${cost.toLocaleString()}\`, costNum: cost });
      }
      originalPrice += cost;
    }
  });`;

content = content.replace(/const getPackagePriceInfo = \(pkg, enabledServices, cateringType = "both"\) => \{[\s\S]*?originalPrice \+= cost;\s*\}\s*\}\);/s, getPackagePriceInfoReplacement);

// 2. Modify toggleService
content = content.replace(
  /const priceInfo = getPackagePriceInfo\(pkgOrigin, new Set\(nextList\), catPref\);/g,
  'const priceInfo = getPackagePriceInfo(pkgOrigin, new Set(nextList), catPref, bookingPkg?.customGuests || null);'
);

content = content.replace(
  /const priceInfo = getPackagePriceInfo\(pkgOrigin, new Set\(active\), pref\);/g,
  'const priceInfo = getPackagePriceInfo(pkgOrigin, new Set(active), pref, bookingPkg?.customGuests || null);'
);

// 3. Modify handleStartBooking
let handleStartBookingReplacement = `const handleStartBooking = (pkg) => {
    const active = pkg.includedServices;
    const catPref = "both";
    const baseG = parseInt(pkg.guests) || 100;
    const priceInfo = getPackagePriceInfo(pkg, new Set(active), catPref, baseG);
    
    setBookingPkg({
      ...pkg,
      customGuests: baseG,
      price: priceInfo.finalPrice,
      priceStr: priceInfo.priceStr,
      originalPrice: priceInfo.originalPriceStr,
      priceBreakdown: priceInfo.breakdown
    });`;

content = content.replace(/const handleStartBooking = \(pkg\) => \{\s*setBookingPkg\(pkg\);/s, handleStartBookingReplacement);

// 4. Create updateGuests function inside FeaturedOfferPackages
let updateGuestsReplacement = `const handleStartBooking = (pkg)`;
let updateGuestsFunc = `
  const handleUpdateGuests = (newGuests) => {
    if (!bookingPkg || newGuests < 10) return;
    const active = enabledServices[bookingPkg.id] || bookingPkg.includedServices;
    const catPref = getCateringPreference(bookingPkg.id);
    const pkgOrigin = featuredPackagesData.find(p => p.id === bookingPkg.id);
    const priceInfo = getPackagePriceInfo(pkgOrigin, new Set(active), catPref, newGuests);
    
    setBookingPkg(prev => ({
      ...prev,
      customGuests: newGuests,
      price: priceInfo.finalPrice,
      priceStr: priceInfo.priceStr,
      originalPrice: priceInfo.originalPriceStr,
      priceBreakdown: priceInfo.breakdown
    }));
  };
  
  const handleStartBooking = (pkg)`;

content = content.replace(updateGuestsReplacement, updateGuestsFunc);

// 5. Update Modal UI
// Find the Capacity block: <div>🗓️ <strong>Capacity:</strong> {bookingPkg.guests}</div>
// We will replace it with a dynamic counter.
let capacityReplacement = `<div>👥 <strong>Capacity:</strong> 
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginLeft: '8px', background: 'white', padding: '2px 8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                          <button onClick={() => handleUpdateGuests((bookingPkg.customGuests || parseInt(bookingPkg.guests)) - 10)} style={{ border: 'none', background: '#f1f5f9', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                          <span style={{ fontWeight: '700', color: '#2563eb' }}>{bookingPkg.customGuests || parseInt(bookingPkg.guests)} Guests</span>
                          <button onClick={() => handleUpdateGuests((bookingPkg.customGuests || parseInt(bookingPkg.guests)) + 10)} style={{ border: 'none', background: '#f1f5f9', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                        </div>
                      </div>`;
content = content.replace(/<div>👥 <strong>Capacity:<\/strong> \{bookingPkg\.guests\}<\/div>/s, capacityReplacement);

// 6. Update Services Grid to show price Breakdown
// Locate: <span style={{ textDecoration: active ? "none" : "line-through", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{service}</span>
let spanRegex = /<span style=\{\{\s*textDecoration: active \? "none" : "line-through",\s*overflow: "hidden",\s*textOverflow: "ellipsis",\s*whiteSpace: "nowrap"\s*\}\}>\{service\}<\/span>/s;
let spanReplacement = `<span style={{
                                    textDecoration: active ? "none" : "line-through",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    alignItems: "center"
                                  }}>
                                    <span>{service}</span>
                                    {active && bookingPkg.priceBreakdown && (
                                      <span style={{ fontSize: "10px", fontWeight: "800", color: "#2563eb", background: "white", padding: "1px 6px", borderRadius: "4px", marginLeft: "4px" }}>
                                        {bookingPkg.priceBreakdown.find(b => b.item === service)?.costStr || ""}
                                      </span>
                                    )}
                                  </span>`;
content = content.replace(spanRegex, spanReplacement);

fs.writeFileSync(file, content, 'utf8');
console.log("Updated FeaturedOfferPackages.jsx with Guest Selector and Price Breakdown");
