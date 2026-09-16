const Venue = require("../models/Venue");
const Package = require("../models/Package");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

function extractDate(text) {
  const normalized = text.toLowerCase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Relative dates
  if (/\btoday\b/i.test(normalized)) {
    return { date: new Date(today), rawStr: "today" };
  }
  if (/\btomorrow\b/i.test(normalized)) {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return { date: d, rawStr: "tomorrow" };
  }
  if (/\bday after tomorrow\b/i.test(normalized)) {
    const d = new Date(today);
    d.setDate(d.getDate() + 2);
    return { date: d, rawStr: "day after tomorrow" };
  }
  if (/\bnext week\b/i.test(normalized)) {
    const d = new Date(today);
    d.setDate(d.getDate() + 7);
    return { date: d, rawStr: "next week" };
  }
  if (/\bnext month\b/i.test(normalized)) {
    const d = new Date(today);
    d.setMonth(d.getMonth() + 1);
    return { date: d, rawStr: "next month" };
  }

  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const nextDayMatch = normalized.match(/\bnext\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday|sun|mon|tue|wed|thu|fri|sat)\b/i);
  if (nextDayMatch) {
    const targetDayStr = nextDayMatch[1].toLowerCase();
    const targetDay = dayNames.findIndex(d => d.startsWith(targetDayStr));
    if (targetDay !== -1) {
      const currentDay = today.getDay();
      let daysAhead = targetDay - currentDay;
      if (daysAhead <= 0) daysAhead += 7;
      const d = new Date(today);
      d.setDate(d.getDate() + daysAhead);
      return { date: d, rawStr: nextDayMatch[0] };
    }
  }

  const inXMatch = normalized.match(/\bin\s+(\d+)\s*(day|days|week|weeks|month|months)\b/i);
  if (inXMatch) {
    const num = parseInt(inXMatch[1], 10);
    const unit = inXMatch[2].toLowerCase();
    const d = new Date(today);
    if (unit.startsWith("day")) d.setDate(d.getDate() + num);
    else if (unit.startsWith("week")) d.setDate(d.getDate() + num * 7);
    else if (unit.startsWith("month")) d.setMonth(d.getMonth() + num);
    return { date: d, rawStr: inXMatch[0] };
  }

  // 2. Numeric date formats: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY, YYYY-MM-DD, YYYY/MM/DD
  const dmyMatch = text.match(/\b(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{2,4})\b/);
  if (dmyMatch) {
    let [raw, dayStr, monthStr, yearStr] = dmyMatch;
    let day = parseInt(dayStr, 10);
    let month = parseInt(monthStr, 10) - 1;
    let year = parseInt(yearStr, 10);
    if (year < 100) year += 2000;

    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) {
        return { date: d, rawStr: raw };
      }
    }
  }

  const ymdMatch = text.match(/\b(\d{4})[\/\.-](\d{1,2})[\/\.-](\d{1,2})\b/);
  if (ymdMatch) {
    let [raw, yearStr, monthStr, dayStr] = ymdMatch;
    let year = parseInt(yearStr, 10);
    let month = parseInt(monthStr, 10) - 1;
    let day = parseInt(dayStr, 10);

    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) {
        return { date: d, rawStr: raw };
      }
    }
  }

  // 3. Textual month date formats: e.g. "14 February 2026", "14th Feb 2026", "Feb 14 2026"
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const shortMonths = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "sept", "oct", "nov", "dec"];
  
  const textDateMatchA = text.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+([a-zA-Z]{3,9})(?:\s+(\d{4}))?\b/i);
  if (textDateMatchA) {
    const day = parseInt(textDateMatchA[1], 10);
    const monthStr = textDateMatchA[2].toLowerCase();
    let year = textDateMatchA[3] ? parseInt(textDateMatchA[3], 10) : today.getFullYear();

    let monthIdx = months.indexOf(monthStr);
    if (monthIdx === -1) {
      monthIdx = shortMonths.findIndex(sm => monthStr.startsWith(sm));
    }

    if (monthIdx !== -1 && day >= 1 && day <= 31) {
      let d = new Date(year, monthIdx, day);
      if (!textDateMatchA[3] && d < today) {
        d.setFullYear(today.getFullYear() + 1);
      }
      return { date: d, rawStr: textDateMatchA[0] };
    }
  }

  const textDateMatchB = text.match(/\b([a-zA-Z]{3,9})\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s*,?\s*(\d{4}))?\b/i);
  if (textDateMatchB) {
    const monthStr = textDateMatchB[1].toLowerCase();
    const day = parseInt(textDateMatchB[2], 10);
    let year = textDateMatchB[3] ? parseInt(textDateMatchB[3], 10) : today.getFullYear();

    let monthIdx = months.indexOf(monthStr);
    if (monthIdx === -1) {
      monthIdx = shortMonths.findIndex(sm => monthStr.startsWith(sm));
    }

    if (monthIdx !== -1 && day >= 1 && day <= 31) {
      let d = new Date(year, monthIdx, day);
      if (!textDateMatchB[3] && d < today) {
        d.setFullYear(today.getFullYear() + 1);
      }
      return { date: d, rawStr: textDateMatchB[0] };
    }
  }

  return { date: null, rawStr: null };
}

function extractGuests(text) {
  const sanitized = text
    .replace(/(\d+),([a-zA-Z])/g, '$1 $2')
    .replace(/([a-zA-Z]),(\d+)/g, '$1 $2')
    .replace(/,/g, ' ');

  const kwFirst = sanitized.match(/(?:guests?\s*count|number\s*of\s*guests?|no\.?\s*of\s*guests?|count\s*of\s*guests?|guests?|pax|people|persons?|members?|attendees?)[\s:-=]*(\d+)/i);
  if (kwFirst) {
    return parseInt(kwFirst[1], 10);
  }

  const numFirst = sanitized.match(/(\d+)\s*(?:guests?|pax|people|persons?|members?|attendees?)/i);
  if (numFirst) {
    return parseInt(numFirst[1], 10);
  }

  const forMatch = sanitized.match(/\bfor\s+(\d+)\b/i);
  if (forMatch) {
    return parseInt(forMatch[1], 10);
  }

  return null;
}

function extractLocation(text) {
  const sanitized = text.replace(/,/g, ' ');
  const locations = [
    "udupi", "bangalore", "bengaluru", "mangalore", "mangaluru", "manipal", 
    "karkala", "kundapura", "surathkal", "mumbai", "delhi", "hyderabad", 
    "chennai", "goa", "mysore", "mysuru", "pune"
  ];

  for (const loc of locations) {
    const regex = new RegExp(`\\b${loc}\\b`, 'i');
    if (regex.test(sanitized)) {
      return loc.charAt(0).toUpperCase() + loc.slice(1);
    }
  }
  return null;
}

function extractEventType(text) {
  const msg = text.toLowerCase();
  const typesMap = {
    "wedding": "Wedding",
    "marriage": "Wedding",
    "marrige": "Wedding",
    "birthday": "Birthday",
    "bithday": "Birthday",
    "engagement": "Engagement",
    "reception": "Reception",
    "conference": "Conference",
    "party": "Party",
    "anniversary": "Anniversary",
    "baby shower": "Baby Shower",
    "farewell": "Farewell"
  };

  for (const [kw, name] of Object.entries(typesMap)) {
    if (new RegExp(`\\b${kw}\\b`, 'i').test(msg)) {
      return name;
    }
  }
  return null;
}

function extractBudget(text) {
  const budgetMatch = text.match(/(?:budget.*?|within.*?|for.*?)(?:rs\.?|inr|₹)?\s*([\d,]+)\s*(lakh|lakhs|k)?/i) || 
                      text.match(/(?:rs\.?|inr|₹)\s*([\d,]+)\s*(lakh|lakhs|k)?/i) ||
                      text.match(/\bbudget\s*(?:of|is|:|=| -)?\s*(?:rs\.?|inr|₹)?\s*([\d,]+)\s*(lakh|lakhs|k)?/i);
  if (budgetMatch) {
    let num = parseInt(budgetMatch[1].replace(/,/g, ''), 10);
    if (budgetMatch[2]) {
      const unit = budgetMatch[2].toLowerCase();
      const multiplier = unit.startsWith('lakh') ? 100000 : 1000;
      num = num * multiplier;
    }
    return num;
  }
  return null;
}

function parseMessage(message, currentContext) {
  const msg = message.toLowerCase();
  let context = { ...currentContext };
  let dateError = null;
  
  // Non-event filter
  const nonEventKeywords = ["weather", "joke", "news", "programming", "code", "politics", "movie", "sports"];
  if (nonEventKeywords.some(kw => msg.includes(kw))) {
    return { isEventRelated: false, context, dateError: null };
  }

  // Extract Event Type
  const eventType = extractEventType(message);
  if (eventType) {
    context.eventType = eventType;
  }

  // Extract Guest Count
  const guests = extractGuests(message);
  if (guests) {
    context.guests = guests;
  }

  // Extract Location
  const location = extractLocation(message);
  if (location) {
    context.location = location;
  }

  // Extract Budget
  const budget = extractBudget(message);
  if (budget) {
    context.budget = budget;
  }

  // Extract & Validate Date
  const dateResult = extractDate(message);
  if (dateResult.date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(dateResult.date);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      dateError = `The date you provided (${dateResult.rawStr}) is in the past. Events can only be booked for future dates. Please provide a valid future date.`;
      delete context.dateStr;
    } else {
      context.dateStr = dateResult.rawStr;
    }
  }

  // Extract Preferences
  context.preferences = context.preferences || [];
  const prefKeywords = ["high rating", "highly rated", "good feedback", "best reviews", "4 stars", "recommend", "beautiful", "clean", "professional", "good catering", "good decoration", "good reviews"];
  prefKeywords.forEach(kw => {
    if (msg.includes(kw) && !context.preferences.includes(kw)) {
      context.preferences.push(kw);
    }
  });

  // Handle actions
  if (msg === "skip" || msg === "skip venue") {
    context.action = "skip";
  } else if (msg.startsWith("select_")) {
    context.action = msg;
  }

  return { isEventRelated: true, context, dateError };
}

exports.chat = async (req, res) => {
  try {
    const { message, context: currentContext = {} } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    let { isEventRelated, context, dateError } = parseMessage(message, currentContext);

    if (!isEventRelated) {
      return res.json({
        success: true,
        reply: "I'm your Event Planning Assistant. I can help only with event-related questions. Would you like help with a venue, catering, decoration, photography, DJ, transport, or a complete event package?",
        context: currentContext,
        recommendations: [],
        options: []
      });
    }

    // Initialize Step-by-step logic
    if (!context.currentStep) {
       context.currentStep = 'init';
       context.selectedServices = {};
       context.totalCost = 0;
    }
    
    // Handle specific intent overrides
    if (message.toLowerCase().includes("remove dj")) {
        if (context.selectedServices && context.selectedServices.dj) {
            context.totalCost -= context.selectedServices.dj.price;
            delete context.selectedServices.dj;
            return res.json({ success: true, reply: "I have removed DJ from your plan. What would you like to do next?", context, recommendations: [], options: ["Continue Planning", "Confirm & Book"] });
        }
    }
    if (message.toLowerCase().includes("remove cake")) {
        if (context.selectedServices && context.selectedServices.cake) {
            context.totalCost -= context.selectedServices.cake.price;
            delete context.selectedServices.cake;
            return res.json({ success: true, reply: "I have removed the cake from your plan. What would you like to do next?", context, recommendations: [], options: ["Continue Planning", "Confirm & Book"] });
        }
    }
    if (message.toLowerCase().includes("change venue") || message.toLowerCase().includes("find a venue") || message.toLowerCase().includes("show available venues")) {
        context.currentStep = "venue";
    }
    
    if (message.toLowerCase() === "continue planning") {
        // Just replay the current step logic
    }

    // INIT phase: Gather event details
    if (context.currentStep === 'init') {
        let missing = [];
        if (!context.eventType) missing.push("event type");
        if (!context.dateStr) missing.push("date");
        if (!context.guests) missing.push("guest count");
        if (!context.location) missing.push("location");
        
        if (dateError) {
             let reply = dateError;
             if (missing.filter(m => m !== 'date').length > 0) {
                 reply += ` I still need your ${missing.filter(m => m !== 'date').join(", ")}.`;
             }
             return res.json({
                success: true,
                reply: reply,
                context,
                recommendations: [],
                options: []
            });
        }

        if (missing.length > 0) {
             let reply = "";
             if (missing.length === 1) {
                  if (missing[0] === 'event type') reply = "What type of event are you planning?";
                  if (missing[0] === 'date') reply = "What date should I check for?";
                  if (missing[0] === 'guest count') reply = "How many guests are you expecting?";
                  if (missing[0] === 'location') reply = "Which location or city would you prefer?";
             } else if (missing.length === 4) {
                  reply = `To give you the best plan, could you tell me your event type, date, guest count, and location? (e.g., "Birthday on 14 Feb for 100 people in Udupi")`;
             } else {
                  reply = `I have noted the details you provided, but I still need your ${missing.join(", ")}. Can you provide them?`;
             }
             
             return res.json({
                success: true,
                reply: reply,
                context,
                recommendations: [],
                options: []
            });
        } else {
            context.currentStep = 'venue';
        }
    }

    if (dateError) {
        return res.json({
            success: true,
            reply: dateError,
            context,
            recommendations: [],
            options: []
        });
    }

    // Process action from previous step
    if (context.action) {
        if (context.action.startsWith("select_")) {
           const [_, type, id, name, price] = context.action.split("|");
           const parsedPrice = parseInt(price) || 0;
           context.selectedServices = context.selectedServices || {};
           
           if (type === "venue") {
               if(context.selectedServices.venue) {
                   context.totalCost -= context.selectedServices.venue.price;
               }
               context.selectedServices.venue = { id, name, price: parsedPrice };
               context.totalCost += parsedPrice;
               context.currentStep = 'catering_type';
           } else if (type === "catering") {
               if(context.selectedServices.catering) {
                   context.totalCost -= context.selectedServices.catering.price;
               }
               context.selectedServices.catering = { id, name, price: parsedPrice };
               context.totalCost += parsedPrice;
               context.currentStep = 'decoration';
           } else if (type === "decoration") {
               if(context.selectedServices.decoration) {
                   context.totalCost -= context.selectedServices.decoration.price;
               }
               context.selectedServices.decoration = { id, name, price: parsedPrice };
               context.totalCost += parsedPrice;
               context.currentStep = 'cake';
           } else if (type === "cake") {
               if(context.selectedServices.cake) {
                   context.totalCost -= context.selectedServices.cake.price;
               }
               context.selectedServices.cake = { id, name, price: parsedPrice };
               context.totalCost += parsedPrice;
               context.currentStep = 'photography';
           } else if (type === "photography") {
               if(context.selectedServices.photography) {
                   context.totalCost -= context.selectedServices.photography.price;
               }
               context.selectedServices.photography = { id, name, price: parsedPrice };
               context.totalCost += parsedPrice;
               context.currentStep = 'dj';
           } else if (type === "dj") {
               if(context.selectedServices.dj) {
                   context.totalCost -= context.selectedServices.dj.price;
               }
               context.selectedServices.dj = { id, name, price: parsedPrice };
               context.totalCost += parsedPrice;
               context.currentStep = 'summary'; // Jump to summary for brevity, since rooms/transport skip is fine
           }
        } else if (context.action === "skip") {
             if(context.currentStep === 'venue') {
                context.currentStep = 'catering_type';
             } else if(context.currentStep === 'cake_options' || context.currentStep === 'cake') {
                context.currentStep = 'photography';
             } else if (context.currentStep === 'photography_options' || context.currentStep === 'photography') {
                context.currentStep = 'dj';
             } else if (context.currentStep === 'dj_options' || context.currentStep === 'dj') {
                context.currentStep = 'summary';
             }
        }
        delete context.action;
    }
    
    // Catering type flow
    if(context.currentStep === 'catering_type' && message.toLowerCase() === 'vegetarian') {
        context.foodType = 'Vegetarian';
        context.currentStep = 'catering';
    } else if (context.currentStep === 'catering_type' && message.toLowerCase() === 'non-vegetarian') {
        context.foodType = 'Non-Vegetarian';
        context.currentStep = 'catering';
    } else if (context.currentStep === 'catering_type' && message.toLowerCase() === 'both') {
        context.foodType = 'Both';
        context.currentStep = 'catering';
    }
    
    let reply = "";
    let recommendations = [];
    let options = [];

    switch(context.currentStep) {
        case 'venue':
            reply = "I found suitable venues for your event. Please choose a venue.";
            let query = { status: "Available" };
            if (context.guests) query.capacity = { $gte: context.guests };
            const venuesList = await Venue.find(query).lean();
            
            // Calculate ratings and scores
            let scoredVenues = [];
            for (let v of venuesList) {
                // Find bookings for this venue
                const bookings = await Booking.find({ venueId: v._id.toString() }).select("_id");
                const bookingIds = bookings.map(b => b._id);
                
                // Find reviews for these bookings
                const reviews = await Review.find({ booking: { $in: bookingIds } }).sort({ rating: -1 });
                
                let rating = 0;
                let reviewCount = reviews.length;
                let clientFeedback = [];
                
                if (reviewCount > 0) {
                    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
                    rating = (sum / reviewCount).toFixed(1);
                    clientFeedback = reviews.slice(0, 3).map(r => ({
                        rating: r.rating,
                        comment: r.comment
                    }));
                }
                
                let score = 95; // Base score
                if (rating >= 4.5) score += 10;
                else if (rating >= 4.0) score += 5;
                if (reviewCount > 5) score += 5;
                
                // Boost score based on preferences
                if (context.preferences && context.preferences.length > 0) {
                   if (context.preferences.some(p => p.includes("rat") || p.includes("review") || p.includes("feedback") || p.includes("star") || p.includes("recommend"))) {
                       if (rating >= 4) score += 15;
                   }
                }
                
                scoredVenues.push({
                    type: "venue",
                    category: "Venue",
                    id: v._id,
                    name: v.name,
                    image: (v.images && v.images[0]) || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
                    images: v.images || [],
                    capacity: v.capacity,
                    price: v.price,
                    availability: "Available",
                    score: score,
                    location: v.location || v.city || "Udupi",
                    rating: rating > 0 ? rating : null,
                    reviewCount,
                    clientFeedback,
                    description: v.description || `Spacious venue located in ${v.location || 'Udupi'}, perfect for grand celebrations, weddings, and corporate events. Fully equipped to comfortably accommodate up to ${v.capacity} guests.`,
                    facilities: (v.facilities && v.facilities.length > 0) ? v.facilities : ["Air Conditioning", "Grand Stage Setup", "Ample Parking Space", "Power Backup", "Green Rooms", "Catering & Kitchen Area"],
                    action: `select_|venue|${v._id}|${v.name}|${v.price}`
                });
            }
            
            scoredVenues.sort((a, b) => b.score - a.score);
            recommendations = scoredVenues.slice(0, 3);
            
            if(recommendations.length === 0) {
                 reply = "Sorry, no venues match. Let's try skipping.";
                 options = ["Skip Venue"];
            } else if (context.preferences && context.preferences.length > 0 && recommendations[0].rating) {
                 reply = "Here are highly recommended venues based on your preferences.";
            }
            break;
        
        case 'catering_type':
            reply = "Great! Venue selected. What type of food would you like?";
            options = ["Vegetarian", "Non-Vegetarian", "Both"];
            break;

        case 'catering':
            reply = "Here are some catering options based on your choice.";
            let catBasePrice = context.foodType === 'Vegetarian' ? 400 : (context.foodType === 'Non-Vegetarian' ? 600 : 500);
            let g = context.guests || 100;
            recommendations = [
                { 
                    type: "service", 
                    category: "Catering",
                    id: "cat1", 
                    name: `Standard ${context.foodType} Catering`, 
                    price: catBasePrice * g, 
                    desc: `Delicious 3-course ${context.foodType} buffet spread customized for ${g} guests. Includes welcome drinks, main dishes, and sweet dessert.`, 
                    features: ["Welcome Drinks & Refreshments", "Main Course Buffet Spread (8 items)", "Fresh Salad & Raita Bar", "Hot Indian Breads", "Dessert Counter & Ice Creams", "Professional Buffet Setup & Staff"],
                    image: context.foodType === 'Vegetarian' ? "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80" : "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
                    action: `select_|catering|cat1|Standard ${context.foodType} Catering|${catBasePrice * g}` 
                },
                { 
                    type: "service", 
                    category: "Catering",
                    id: "cat2", 
                    name: `Premium ${context.foodType} Catering`, 
                    price: (catBasePrice + 200) * g, 
                    desc: `Luxury multi-cuisine ${context.foodType} dining experience with live chef counters, gourmet appetizers, and premium dessert station.`, 
                    features: ["Mocktail & Specialty Drinks Bar", "Live Chef Counters (Pasta / Street Food)", "Gourmet Main Course (12 items)", "Artisanal Bread Baskets", "Gourmet Dessert & Pastry Bar", "Uniformed Waitstaff & Premium Cutlery"],
                    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80",
                    action: `select_|catering|cat2|Premium ${context.foodType} Catering|${(catBasePrice + 200) * g}` 
                }
            ];
            break;
            
        case 'decoration':
            reply = "Now choose your decoration.";
            recommendations = [
                { 
                    type: "service", 
                    category: "Decoration",
                    id: "dec1", 
                    name: "Minimalist Decor", 
                    price: 15000, 
                    desc: "Sleek and elegant minimalist setup featuring warm LED ambient lighting, subtle floral touches, and a clean stage backdrop.", 
                    features: ["Elegant Stage Backdrop", "Warm LED Ambient Lighting", "Entrance Arch Decoration", "Table Centerpieces", "Flower Vases"],
                    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
                    action: `select_|decoration|dec1|Minimalist Decor|15000` 
                },
                { 
                    type: "service", 
                    category: "Decoration",
                    id: "dec2", 
                    name: "Floral Extravaganza", 
                    price: 35000, 
                    desc: "Rich fresh floral arrangements spanning the main stage, walkway, entrance arch, and a dedicated photo booth.", 
                    features: ["Fresh Flower Stage Wall", "Red Carpet Walkway Runner", "Grand Floral Entrance Arch", "Dedicated Selfie / Photo Booth", "Special Highlight Stage Spotlights"],
                    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80",
                    action: `select_|decoration|dec2|Floral Extravaganza|35000` 
                },
                { 
                    type: "service", 
                    category: "Decoration",
                    id: "dec3", 
                    name: "Modern Theme Decor", 
                    price: 50000, 
                    desc: "High-end contemporary thematic decoration with intelligent stage moving head lights, 3D structures, and custom props.", 
                    features: ["Custom Theme Stage Architecture", "Intelligent Stage Moving Heads & Wash Lights", "3D Entrance Installation", "VIP Lounge Setup", "Custom Photo Backdrop Walls"],
                    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80",
                    action: `select_|decoration|dec3|Modern Theme|50000` 
                }
            ];
            break;

        case 'cake':
            reply = "Would you like a cake?";
            options = ["Yes", "Skip"];
            if (message.toLowerCase() === "yes") {
                 context.currentStep = 'cake_options';
                 req.body.context = context;
                 return exports.chat(req, res);
            }
            break;
            
        case 'cake_options':
             reply = "Choose a cake.";
             recommendations = [
                { 
                    type: "service", 
                    category: "Cake",
                    id: "ck1", 
                    name: "2 Tier Chocolate Cake (3kg)", 
                    price: 4500, 
                    desc: "Rich Belgian chocolate layered cake with custom frosting, topper, and elegant presentation.", 
                    features: ["3kg 2-Tier Fresh Cake", "Belgian Chocolate Truffle Flavor", "Customized Cake Topper & Name Plate", "Eggless Option Available", "Delivery & On-site Setup"],
                    image: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80",
                    action: `select_|cake|ck1|2 Tier Chocolate Cake|4500` 
                },
                { 
                    type: "service", 
                    category: "Cake",
                    id: "ck2", 
                    name: "3 Tier Fondant Cake (5kg)", 
                    price: 8000, 
                    desc: "Custom grand 3-tier designer fondant cake tailored specifically to match your event colors and theme.", 
                    features: ["5kg 3-Tier Designer Cake", "Custom Fondant Theme Art & Sugar Flowers", "Multiple Flavor Options (Vanilla / Berry / Truffle)", "Sparkler Candles & Cake Knife Set Included"],
                    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80",
                    action: `select_|cake|ck2|3 Tier Fondant Cake|8000` 
                }
             ];
             options = ["Skip"];
             break;

        case 'photography':
            reply = "Would you like photography?";
            options = ["Add Photography", "Skip"];
            if (message.toLowerCase() === "add photography") {
                 context.currentStep = 'photography_options';
                 req.body.context = context;
                 return exports.chat(req, res);
            }
            break;
            
        case 'photography_options':
            reply = "Choose a photography package.";
            recommendations = [
                { 
                    type: "service", 
                    category: "Photography",
                    id: "ph1", 
                    name: "Candid Photography Package", 
                    price: 20000, 
                    desc: "Professional candid photo coverage capturing all genuine emotions, smiles, and key event highlights.", 
                    features: ["1 Senior Candid Photographer", "Full Event Coverage (up to 6 hrs)", "300+ Retouched High-Res Photos", "Online Digital Gallery Access"],
                    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80",
                    action: `select_|photography|ph1|Candid Photography|20000` 
                },
                { 
                    type: "service", 
                    category: "Photography",
                    id: "ph2", 
                    name: "Full Coverage + Drone + Video", 
                    price: 45000, 
                    desc: "Comprehensive media coverage including traditional photography, candid shots, 4K drone aerials, and a cinematic teaser video.", 
                    features: ["2 Senior Photographers + 1 Videographer", "4K Aerial Drone Coverage", "500+ Edited Photos + Premium Hardcover Album", "3-5 Min Cinematic Teaser Reel", "Full Length Edited Video"],
                    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80",
                    action: `select_|photography|ph2|Full Coverage + Drone|45000` 
                }
            ];
            options = ["Skip"];
            break;

        case 'dj':
            reply = "Would you like DJ / Sound & Lighting?";
            options = ["Add DJ", "Skip"];
            if (message.toLowerCase() === "add dj") {
                 context.currentStep = 'dj_options';
                 req.body.context = context;
                 return exports.chat(req, res);
            }
            break;
            
        case 'dj_options':
             reply = "Choose a DJ package.";
             recommendations = [
                 { 
                     type: "service", 
                     category: "DJ",
                     id: "dj1", 
                     name: "Standard DJ Setup", 
                     price: 15000, 
                     desc: "Energetic DJ performance with a high-power sound system and wireless mics to keep your guests dancing.", 
                     features: ["Professional Event DJ", "Dual High-Power JBL Speaker Setup", "Wireless Microphones", "4 Hours Continuous Music", "Custom Playlist & Song Request Support"],
                     image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
                     action: `select_|dj|dj1|Standard DJ Setup|15000` 
                 },
                 { 
                     type: "service", 
                     category: "DJ",
                     id: "dj2", 
                     name: "Premium DJ + Stage Lighting", 
                     price: 30000, 
                     desc: "Ultimate club-style concert DJ setup with moving heads, fog machine, laser effects, and concert-grade audio.", 
                     features: ["Celebrity DJ Performance", "Subwoofer & Line Array Concert Audio", "Moving Head Intelligent Lights & Lasers", "Stage Smoke / Fog Machine", "MC / Hype Host Included"],
                     image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
                     action: `select_|dj|dj2|Premium DJ + Lighting|30000` 
                 }
             ];
             options = ["Skip"];
             break;

        case 'summary':
             reply = "Your event plan is ready. Review your selections and proceed.";
             options = ["Confirm & Book", "Save to Wishlist", "Modify Plan"];
             break;
             
        default:
             reply = "I'm not sure what to do next.";
             break;
    }

    res.json({
      success: true,
      reply,
      context,
      recommendations,
      options
    });

  } catch (error) {
    console.error("Smart Assistant Error:", error);
    res.status(500).json({ success: false, message: "Server error processing request", error: error.message });
  }
};
