import React, { useState } from "react";
import { Check, ArrowLeft, ArrowRight, User, MapPin, Calendar as CalendarIcon, Users, Edit3, Download, Camera, Video, Music, Speaker, Lightbulb, Bus, BedDouble, ShieldCheck, FileText, Building, Utensils, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import "../styles/premium-dashboard.css";

const BookingSummary = () => {
  const navigate = useNavigate();
  const [pendingBookingId, setPendingBookingId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const eventTypeTitle = localStorage.getItem("booking_event_type_title") || "Wedding";
  const customTitle = localStorage.getItem("booking_custom_title") || `${eventTypeTitle} Event`;
  const eventDate = localStorage.getItem("booking_event_date") || new Date().toISOString().split('T')[0];
  const timeSlot = localStorage.getItem("booking_time_slot") || "Flexible";
  const brideName = localStorage.getItem("booking_bride_name") || "";
  const groomName = localStorage.getItem("booking_groom_name") || "";
  const celebrantName = localStorage.getItem("booking_celebrant_name") || "";
  const turningAge = localStorage.getItem("booking_turning_age") || "";
  const contactName = localStorage.getItem("booking_contact_name") || "";
  const contactPhone = localStorage.getItem("booking_contact_phone") || "";
  const specialNotes = localStorage.getItem("booking_special_notes") || "";
  const u = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const loggedInName = u.name || "Guest User";
  const loggedInEmail = u.email || "guest@example.com";
  const loggedInPhone = u.phone || contactPhone || "+91 98765 43210";
  const initials = loggedInName.substring(0, 2).toUpperCase();

  const venueNameDisplay = localStorage.getItem("booking_venue_name") || "Select Venue First";
  const venueLocationDisplay = localStorage.getItem("booking_venue_location") || "Location not provided";
  const venueImageDisplay = localStorage.getItem("booking_venue_image") || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80";

  const guestCount = Number(localStorage.getItem("booking_guest_count")) || 250;
  
  // Catering selections
  const [cateringFoodType, setCateringFoodType] = useState(localStorage.getItem("booking_food_type") || "both");
  const cateringComboName = localStorage.getItem("booking_catering_combo_name") || "Premium Combo";
  
  // Calculate catering price dynamically
  const cateringPricePerPlate = cateringFoodType === "both" ? 350 : cateringFoodType === "nonveg" ? 300 : 250;
  const cateringCost = guestCount * cateringPricePerPlate;

  const handleToggleFoodType = (type) => {
    if (cateringFoodType === "both") {
      setCateringFoodType(type === "veg" ? "nonveg" : "veg");
    } else if (cateringFoodType === type) {
      // cannot unselect the only active one
      return; 
    } else {
      setCateringFoodType("both");
    }
  };

  // Cake selections
  const cakeName = localStorage.getItem("booking_cake_name") || "None";
  const cakePrice = Number(localStorage.getItem("booking_cake_price")) || 0;
  const cakeText = localStorage.getItem("booking_cake_text") || "";
  const cakeEggless = localStorage.getItem("booking_cake_eggless") || "No";
  const cakeWeight = localStorage.getItem("booking_cake_weight") || "";

  const parseSafeNum = (val) => {
    if (!val) return 0;
    const num = parseInt(val.toString().replace(/[^0-9]/g, ""), 10);
    return isNaN(num) ? 0 : num;
  };

  const roomName = localStorage.getItem("booking_selected_room") || "";
  const roomQty = parseSafeNum(localStorage.getItem("booking_room_qty"));
  const roomNights = parseSafeNum(localStorage.getItem("booking_room_nights"));
  const roomPrice = parseSafeNum(localStorage.getItem("booking_room_price"));
  const roomTotal = roomName ? parseSafeNum(localStorage.getItem("booking_room_total")) : 0;
  const roomCheckinDate = localStorage.getItem("booking_room_checkin_date") || "";
  const roomCheckinTime = localStorage.getItem("booking_room_checkin_time") || "";

  // Dynamic values replacing fake data
  const venuePrice = parseSafeNum(localStorage.getItem("booking_venue_price"));
  const decorationTotal = parseSafeNum(localStorage.getItem("booking_decoration_total"));

  const photographyPrice = parseSafeNum(localStorage.getItem("booking_photography_price"));
  const photographyName = localStorage.getItem("booking_photography_name") || "";
  const djPrice = parseSafeNum(localStorage.getItem("booking_dj_price"));
  const djName = localStorage.getItem("booking_dj_name") || "";

  const videographyPrice = parseSafeNum(localStorage.getItem("booking_videography_price"));
  const videographyName = localStorage.getItem("booking_videography_name") || "";

  // Additional services currently not priced in localStorage workflow
  const additionalServicesCost = roomTotal + photographyPrice + djPrice + videographyPrice;
  
  const subTotal = venuePrice + decorationTotal + cateringCost + additionalServicesCost + cakePrice;
  const gst = Math.round(subTotal * 0.18);
  const serviceCharge = Math.round(subTotal * 0.05);
  const totalAmount = subTotal + gst + serviceCharge;
  const advancePay = Math.round(totalAmount * 0.30);
  const balancePay = totalAmount - advancePay;

  const handleRazorpayPayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // 1. Gather all required data
      const clientId = u.id || u._id || "client_1";
      
      let bookingId = pendingBookingId;

      if (!bookingId) {
        const bookingPayload = {
          client_id: clientId,
          phone_number: contactPhone || u.phone || "+919876543210",
          userId: clientId,
          clientName: u.name || "Client",
          clientEmail: u.email || "client@example.com",
          event_type: eventTypeTitle,
          eventTitle: customTitle,
          event_date: eventDate,
          time_slot: timeSlot,
          venue_id: localStorage.getItem("booking_venue_id") || "V-001",
          venueName: localStorage.getItem("booking_venue_name") || "Selected Venue",
          address: localStorage.getItem("booking_venue_location") || "Selected Location",
          catering_details: {
            guest_count: guestCount,
            type: cateringFoodType,
            food_type: cateringFoodType
          },
          total_cost: totalAmount,
          hallType: "Banquet Hall",
          decorationPackage: localStorage.getItem("booking_decoration_package") || "Premium Decoration",
          cateringPackage: cateringComboName,
          cakeName: cakeName,
          cakePrice: cakePrice,
          cakeText: cakeText,
          cakeEggless: cakeEggless,
          cakeWeight: cakeWeight,
        };

        // 2. Call check-and-reserve API
        const reserveRes = await fetch("http://localhost:5000/api/bookings/check-and-reserve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingPayload)
        });
        const reserveData = await reserveRes.json();

        if (!reserveData.success) {
          alert("Failed to create booking: " + (reserveData.message || "Unknown error"));
          setIsProcessing(false);
          return;
        }

        bookingId = reserveData.booking_id || reserveData.data?._id;
        setPendingBookingId(bookingId);
      }

      // 3. Call create-order to get Razorpay order_id
      const orderRes = await fetch("http://localhost:5000/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: bookingId,
          amount: advancePay,
          client_id: clientId,
          phone_number: contactPhone || u.phone || "+919876543210",
          event_type: eventTypeTitle
        })
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        alert("Failed to create payment order: " + (orderData.message || "Unknown error"));
        setIsProcessing(false);
        return;
      }

      // 4. Proceed to Razorpay
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        const options = {
          key: "rzp_test_SGkB8sZW1kNRvT",
          amount: orderData.amount, // fetched from backend order (paise)
          currency: "INR",
          name: "Event Management System",
          description: "Event Booking Advance Payment",
          image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=100&q=80",
          order_id: orderData.order_id,
          handler: async function (response) {
            try {
              // 5. Confirm payment with backend (Signature Verification)
              const verifyRes = await fetch("http://localhost:5000/api/payments/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  booking_id: bookingId,
                  client_id: clientId,
                  amount_paid: advancePay
                })
              });
              
              const verifyData = await verifyRes.json();
              
              if (verifyData.success) {
                navigate("/client/payment-success", {
                  state: {
                    paymentId: response.razorpay_payment_id,
                    orderId: bookingId,
                    amount: advancePay.toLocaleString("en-IN"),
                    advancePaidNum: advancePay,
                    totalAmountNum: totalAmount,
                    totalAmountStr: `₹ ${totalAmount.toLocaleString("en-IN")}`,
                    remainingPayNum: balancePay,
                    remainingPayStr: `₹ ${balancePay.toLocaleString("en-IN")}`,
                    eventName: customTitle,
                    eventType: eventTypeTitle,
                    venueName: localStorage.getItem("booking_venue_name") || "Selected Venue",
                    venueImg: localStorage.getItem("booking_venue_image") || "",
                    location: localStorage.getItem("booking_venue_location") || "Selected Location",
                    date: eventDate,
                    guests: `${guestCount} Guests`
                  }
                });
              } else {
                alert("Payment verification failed: " + verifyData.message);
                setIsProcessing(false);
              }
            } catch (err) {
              console.error("Payment confirmation failed:", err);
              alert("Payment successful, but failed to confirm booking status in the system.");
              setIsProcessing(false);
            }
          },
          prefill: {
            name: u.name || "Client",
            email: u.email || "client@example.com",
            contact: contactPhone || u.phone || "+919876543210"
          },
          notes: {
            address: "EMS Corporate Office",
            booking_id: bookingId
          },
          theme: {
            color: "#ea580c"
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false);
            }
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response){
          alert("Payment Failed: " + response.error.description);
          setIsProcessing(false);
        });
        rzp.open();
      };
      script.onerror = () => {
        alert("Failed to load Razorpay SDK. Please check your internet connection.");
        setIsProcessing(false);
      };
      document.body.appendChild(script);

    } catch (err) {
      console.error("Error creating booking:", err);
      alert("An error occurred while communicating with the server.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar title="Client Overview" />

        <div className="premium-content-scroll" style={{ backgroundColor: "#f8fafc" }}>
          
          {/* Header & Stepper */}
          <div className="page-header" style={{ padding: "20px 32px 0", backgroundColor: "#ffffff" }}>
            <h2 style={{ color: "#0f172a", fontSize: "24px", margin: "0 0 4px" }}>Booking Summary</h2>
            <div className="stepper-wrapper" style={{ margin: "20px 32px 10px" }}>
            <div className="stepper-line-bg"></div>
            <div className="stepper-line-active" style={{ width: "100%", background: '#ea580c' }}></div>
            <div className="step-point">
              <div className="step-circle" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>1</div>
              <div className="step-label" style={{color: '#ea580c', fontWeight: 500}}>Select Date</div>
            </div>
            <div className="step-point">
              <div className="step-circle" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>2</div>
              <div className="step-label" style={{color: '#ea580c', fontWeight: 500}}>Event Type</div>
            </div>
            <div className="step-point">
              <div className="step-circle" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>3</div>
              <div className="step-label" style={{color: '#ea580c', fontWeight: 500}}>Expected Guests</div>
            </div>
            <div className="step-point">
              <div className="step-circle" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>4</div>
              <div className="step-label" style={{color: '#ea580c', fontWeight: 500}}>Select Venue</div>
            </div>
            <div className="step-point">
              <div className="step-circle" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>5</div>
              <div className="step-label" style={{color: '#ea580c', fontWeight: 500}}>Decoration Style</div>
            </div>
            <div className="step-point">
              <div className="step-circle" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>6</div>
              <div className="step-label" style={{color: '#ea580c', fontWeight: 500}}>Catering Options</div>
            </div>
            <div className="step-point">
              <div className="step-circle" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>7</div>
              <div className="step-label" style={{color: '#ea580c', fontWeight: 500}}>Additional Services</div>
            </div>
            <div className="step-point">
              <div className="step-circle active" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>8</div>
              <div className="step-label active" style={{color: '#ea580c', fontWeight: 600}}>Booking Summary</div>
            </div>
          </div>
            
            <div className="flex justify-between items-end pb-6" style={{ marginTop: "32px", borderBottom: "1px solid #e2e8f0" }}>
              <div>
                <h3 className="font-bold text-xl text-gray-900 m-0">Booking Summary</h3>
                <p className="text-gray-500 text-sm m-0 mt-1">Please review all details before proceeding to payment</p>
              </div>
              <div className="flex gap-3">
                <button className="btn-outline flex items-center gap-2 bg-white" style={{ padding: "8px 16px", fontSize: "13px" }}>
                  <Edit3 size={16} /> Edit Booking
                </button>
                <button className="btn-outline flex items-center gap-2 bg-white" style={{ padding: "8px 16px", fontSize: "13px" }}>
                  <Download size={16} /> Download / Print
                </button>
              </div>
            </div>
          </div>

          <div className="summary-layout" style={{ padding: "32px" }}>
            
            {/* Left Column (Details) */}
            <div className="summary-left-col">
              
              {/* 1. Client Details */}
              <div className="detail-block">
                <h4 className="detail-title"><User size={18} /> 1. Client Details</h4>
                <div className="client-info-row">
                  <div className="client-avatar">{initials}</div>
                  <div className="client-personal">
                    <h5>{loggedInName}</h5>
                    <div className="text-gray-500 text-sm">{loggedInEmail}</div>
                    <div className="text-gray-500 text-sm">{loggedInPhone}</div>
                  </div>
                  <div className="client-billing">
                    <h6 className="text-gray-900 font-semibold text-sm mb-1">Billing Address</h6>
                    <div className="text-gray-500 text-sm">21, MG Road, Indiranagar</div>
                    <div className="text-gray-500 text-sm">Bangalore, Karnataka - 560038</div>
                  </div>
                </div>
              </div>

              {/* 2. Event Details */}
              <div className="detail-block">
                <h4 className="detail-title"><CalendarIcon size={18} /> 2. Event Details & Person Names</h4>
                <div className="event-info-grid">
                  <div className="info-cell">
                    <div className="info-label">Event Type</div>
                    <div className="info-val font-semibold">{eventTypeTitle}</div>
                  </div>
                  <div className="info-cell">
                    <div className="info-label">Event Name</div>
                    <div className="info-val font-semibold">{customTitle}</div>
                  </div>
                  <div className="info-cell">
                    <div className="info-label">Event Date</div>
                    <div className="info-val">{eventDate}</div>
                  </div>
                  <div className="info-cell">
                    <div className="info-label">Event Time & Slot</div>
                    <div className="info-val">{timeSlot}</div>
                  </div>
                  <div className="info-cell">
                    <div className="info-label">No. of Guests</div>
                    <div className="info-val font-semibold">{guestCount} Guests</div>
                  </div>

                  {/* Wedding Bride / Groom Names */}
                  {(brideName || groomName) && (
                    <>
                      <div className="info-cell">
                        <div className="info-label">👰 Bride (Girl) Name</div>
                        <div className="info-val font-extrabold text-pink-700">{brideName || "N/A"}</div>
                      </div>
                      <div className="info-cell">
                        <div className="info-label">🤵 Groom (Boy) Name</div>
                        <div className="info-val font-extrabold text-blue-700">{groomName || "N/A"}</div>
                      </div>
                    </>
                  )}

                  {/* Birthday Celebrant */}
                  {celebrantName && (
                    <div className="info-cell">
                      <div className="info-label">🎂 Birthday Person</div>
                      <div className="info-val font-extrabold text-purple-700">{celebrantName} {turningAge ? `(${turningAge})` : ""}</div>
                    </div>
                  )}

                  {/* Contact Person */}
                  {(contactName || contactPhone) && (
                    <div className="info-cell">
                      <div className="info-label">👤 Primary Contact</div>
                      <div className="info-val font-semibold">{contactName || "Contact"} {contactPhone ? `(${contactPhone})` : ""}</div>
                    </div>
                  )}
                </div>

                {/* Special Instructions */}
                {specialNotes && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                    <strong className="block mb-0.5">📝 Special Event Instructions & Rituals:</strong>
                    <p className="m-0 text-slate-700">{specialNotes}</p>
                  </div>
                )}
              </div>

              {/* 3. Selected Services (Interactive & Styled) */}
              <div className="detail-block" style={{ padding: "0", background: "transparent", border: "none", boxShadow: "none" }}>
                <h4 className="detail-title mb-4"><Check size={18} /> Selected Package Items</h4>
                
                <div className="flex flex-col gap-3">
                  
                  {/* Selected Venue */}
                  <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-emerald-200">
                        <img src={venueImageDisplay} alt={venueNameDisplay} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900 text-base m-0">{venueNameDisplay}</h4>
                        </div>
                        <p className="text-gray-500 text-xs m-0 flex items-center gap-1"><MapPin size={12}/> {venueLocationDisplay}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-gray-900 text-lg">{venuePrice > 0 ? `₹${venuePrice.toLocaleString()}` : "Not priced"}</span>
                    </div>
                  </div>

                  {/* Catering Interactive Block */}
                  <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                          <Utensils size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-base m-0 mb-1">Catering</h4>
                          <p className="text-gray-500 text-xs m-0">Delicious food with multiple cuisine options</p>
                        </div>
                      </div>
                      <span className="font-black text-gray-900 text-lg">₹{cateringCost.toLocaleString()}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Veg Menu Box */}
                      <div 
                        onClick={() => handleToggleFoodType("veg")}
                        className={`border rounded-xl p-4 cursor-pointer transition-all ${
                          cateringFoodType === "veg" || cateringFoodType === "both" 
                            ? "bg-white border-emerald-400 shadow-[0_0_0_1px_rgba(52,211,153,1)]" 
                            : "bg-gray-50 border-gray-200 opacity-60"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4 border-b pb-2 border-emerald-100">
                          <div className={`flex items-center gap-2 font-bold ${cateringFoodType === "veg" || cateringFoodType === "both" ? "text-emerald-700" : "text-gray-500"}`}>
                            <div className={`w-6 h-6 rounded flex items-center justify-center ${cateringFoodType === "veg" || cateringFoodType === "both" ? "bg-emerald-600 text-white" : "bg-gray-200"}`}>🍃</div>
                            Veg Menu
                          </div>
                          {(cateringFoodType === "veg" || cateringFoodType === "both") && (
                            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Selected</span>
                          )}
                        </div>
                        <ul className="text-[11px] text-gray-600 space-y-2">
                          <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Paneer Butter Masala</li>
                          <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Dal Makhani</li>
                          <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Veg Biryani</li>
                          <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Tandoori Roti / Naan</li>
                          <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Pulao</li>
                          <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Salad & Pickles</li>
                          <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Fresh Fruit Salad</li>
                          <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Dessert (Ice Cream / Gulab Jamun)</li>
                        </ul>
                      </div>

                      {/* Non-Veg Menu Box */}
                      <div 
                        onClick={() => handleToggleFoodType("nonveg")}
                        className={`border rounded-xl p-4 cursor-pointer transition-all ${
                          cateringFoodType === "nonveg" || cateringFoodType === "both" 
                            ? "bg-red-50 border-red-200 shadow-[0_0_0_1px_rgba(252,165,165,1)]" 
                            : "bg-gray-50 border-gray-200 opacity-60"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4 border-b pb-2 border-red-200">
                          <div className={`flex items-center gap-2 font-bold ${cateringFoodType === "nonveg" || cateringFoodType === "both" ? "text-red-700" : "text-gray-500"}`}>
                            <div className={`w-6 h-6 rounded flex items-center justify-center ${cateringFoodType === "nonveg" || cateringFoodType === "both" ? "bg-red-500 text-white" : "bg-gray-200"}`}>🍗</div>
                            Non-Veg Menu
                          </div>
                          {(cateringFoodType === "nonveg" || cateringFoodType === "both") && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Selected</span>
                          )}
                        </div>
                        <ul className="text-[11px] text-gray-600 space-y-2">
                          <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Chicken Dum Biryani</li>
                          <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Chicken Kebab</li>
                          <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Mutton Curry</li>
                          <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Fish Fry</li>
                          <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Tandoori Roti / Naan</li>
                          <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Salad & Pickles</li>
                          <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Fresh Fruit Salad</li>
                          <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Dessert (Ice Cream / Gulab Jamun)</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 text-[11px] text-blue-900 font-semibold italic">
                      Base Menu: <span className="text-gray-600 font-normal">Veg & Non-Veg Starters, One Sweet, White Rice, Boiled Rice, Pulao, Roti, Naan, Paratha, Papad, Salads, Veg & Non-Veg Curries, Biryani</span>
                    </div>
                  </div>
                  
                  {/* Customized Cake */}
                  {cakePrice > 0 && (
                    <div className="bg-orange-50/40 border border-orange-100 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                          🎂
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-gray-900 text-base m-0">Customized Cake</h4>
                          </div>
                          <p className="text-gray-500 text-xs m-0">{cakeName.replace(/\s*\([\d.]+\s*Kg\)/i, "")} ({Number(cakeWeight || 1.5).toFixed(1)} Kg)</p>
                          {cakeText && <p className="text-orange-600 text-[10px] m-0 mt-1 font-semibold">"{cakeText}"</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {cakeEggless === "Yes" && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Eggless</span>}
                        <span className="font-black text-gray-900 text-lg">₹{cakePrice.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* 4. Additional Services */}
              <div className="detail-block">
                <h4 className="detail-title"><Users size={18} /> 4. Additional Services</h4>
                <div className="add-services-list">
                  <div className="as-item">
                    <div className="flex items-center gap-3 w-1/3 text-gray-700 text-sm"><Camera size={16}/> Photography</div>
                    <div className="flex-1 text-gray-500 text-sm">{photographyPrice > 0 ? photographyName : "Not selected / Not priced"}</div>
                    <div className="font-bold text-gray-900 text-sm">{photographyPrice > 0 ? `₹ ${photographyPrice.toLocaleString('en-IN')}` : "--"}</div>
                  </div>
                  <div className="as-item">
                    <div className="flex items-center gap-3 w-1/3 text-gray-700 text-sm"><Video size={16}/> Videography</div>
                    <div className="flex-1 text-gray-500 text-sm">{videographyPrice > 0 ? videographyName : "Not selected / Not priced"}</div>
                    <div className="font-bold text-gray-900 text-sm">{videographyPrice > 0 ? `₹ ${videographyPrice.toLocaleString('en-IN')}` : "--"}</div>
                  </div>
                  <div className="as-item">
                    <div className="flex items-center gap-3 w-1/3 text-gray-700 text-sm"><Music size={16}/> DJ / Music System</div>
                    <div className="flex-1 text-gray-500 text-sm">{djPrice > 0 ? djName : "Not selected / Not priced"}</div>
                    <div className="font-bold text-gray-900 text-sm">{djPrice > 0 ? `₹ ${djPrice.toLocaleString('en-IN')}` : "--"}</div>
                  </div>
                  <div className="as-item">
                    <div className="flex items-center gap-3 w-1/3 text-gray-700 text-sm"><Speaker size={16}/> Sound System</div>
                    <div className="flex-1 text-gray-500 text-sm">Not selected / Not priced</div>
                    <div className="font-bold text-gray-400 text-sm">--</div>
                  </div>
                  <div className="as-item">
                    <div className="flex items-center gap-3 w-1/3 text-gray-700 text-sm"><Lightbulb size={16}/> Lighting</div>
                    <div className="flex-1 text-gray-500 text-sm">Not selected / Not priced</div>
                    <div className="font-bold text-gray-400 text-sm">--</div>
                  </div>
                  <div className="as-item">
                    <div className="flex items-center gap-3 w-1/3 text-gray-700 text-sm"><Bus size={16}/> Travel - Bus</div>
                    <div className="flex-1 text-gray-500 text-sm">Not selected / Not priced</div>
                    <div className="font-bold text-gray-400 text-sm">--</div>
                  </div>
                  <div className="as-item">
                    <div className="flex items-center gap-3 w-1/3 text-gray-700 text-sm"><BedDouble size={16}/> Guest Rooms</div>
                    <div className="flex-1 text-gray-500 text-sm">
                      {roomName ? (
                        <>
                          <div>{roomName} ({roomQty} Room{roomQty > 1 ? 's' : ''}, {roomNights} Night{roomNights > 1 ? 's' : ''})</div>
                          {roomCheckinDate && <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>Check-in: {roomCheckinDate} at {roomCheckinTime}</div>}
                        </>
                      ) : "No Rooms Selected"}
                    </div>
                    <div className="font-bold text-gray-900 text-sm">{roomTotal > 0 ? `₹ ${roomTotal.toLocaleString('en-IN')}` : 'Not priced'}</div>
                  </div>
                </div>
                <button className="btn-outline-orange w-full mt-6" style={{ background: "white" }}>View All Services Details</button>
              </div>

            </div>

            {/* Right Column (Cost & Actions) */}
            <div className="summary-right-col">
              
              {/* Budget Planner & Cost Summary */}
              <div className="cost-summary-box">
                <h4 className="detail-title"><CalendarIcon size={18} /> Budget & Cost Breakdown</h4>
                
                {/* Category Progress Bars */}
                <div className="mb-6">
                  {venuePrice > 0 && subTotal > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 font-medium">Venue</span>
                        <span className="text-gray-900 font-bold">{Math.round((venuePrice / subTotal) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(venuePrice / subTotal) * 100}%` }}></div>
                      </div>
                    </div>
                  )}
                  {cateringCost > 0 && subTotal > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 font-medium">Catering</span>
                        <span className="text-gray-900 font-bold">{Math.round((cateringCost / subTotal) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(cateringCost / subTotal) * 100}%` }}></div>
                      </div>
                    </div>
                  )}
                  {decorationTotal > 0 && subTotal > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 font-medium">Decoration</span>
                        <span className="text-gray-900 font-bold">{Math.round((decorationTotal / subTotal) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(decorationTotal / subTotal) * 100}%` }}></div>
                      </div>
                    </div>
                  )}
                  {additionalServicesCost > 0 && subTotal > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 font-medium">Rooms & Additional</span>
                        <span className="text-gray-900 font-bold">{Math.round((additionalServicesCost / subTotal) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(additionalServicesCost / subTotal) * 100}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="cost-row">
                  <span>Venue Charges</span>
                  <span className={venuePrice > 0 ? "font-semibold text-gray-900" : "font-medium text-gray-400"}>
                    {venuePrice > 0 ? `₹ ${venuePrice.toLocaleString('en-IN')}` : "Not priced"}
                  </span>
                </div>
                <div className="cost-row">
                  <span>Decoration Charges</span>
                  <span className={decorationTotal > 0 ? "font-semibold text-gray-900" : "font-medium text-gray-400"}>
                    {decorationTotal > 0 ? `₹ ${decorationTotal.toLocaleString('en-IN')}` : "Not priced"}
                  </span>
                </div>
                <div className="cost-row">
                  <span>Catering Charges</span>
                  <span className={cateringCost > 0 ? "font-semibold text-gray-900" : "font-medium text-gray-400"}>
                    {cateringCost > 0 ? `₹ ${cateringCost.toLocaleString('en-IN')}` : "Not priced"}
                  </span>
                </div>
                {cakePrice > 0 && (
                  <div className="cost-row">
                    <span>Cake Charges</span>
                    <span className="font-semibold text-gray-900">₹ {cakePrice.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="cost-row mb-4 pb-4 border-b border-gray-200">
                  <span>Additional Services</span>
                  <span className={additionalServicesCost > 0 ? "font-semibold text-gray-900" : "font-medium text-gray-400"}>
                    {additionalServicesCost > 0 ? `₹ ${additionalServicesCost.toLocaleString('en-IN')}` : "Not priced"}
                  </span>
                </div>
                
                <div className="cost-row">
                  <span>Sub Total</span>
                  <span className="font-bold text-gray-900 text-base">₹ {subTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="cost-row">
                  <span>GST (18%)</span>
                  <span className="font-bold text-gray-900 text-base">₹ {gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="cost-row mb-6 pb-6 border-b border-gray-200">
                  <span>Service Charge (5%)</span>
                  <span className="font-bold text-gray-900 text-base">₹ {serviceCharge.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="cost-row items-end">
                  <span className="text-orange-600 font-bold text-base">Estimated Total</span>
                  <span className="text-orange-600 font-bold text-2xl">₹ {totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="payment-summary-box mt-6">
                <h4 className="detail-title"><CalendarIcon size={18} /> Payment Summary</h4>
                
                <div className="cost-row items-start mb-6 pb-6 border-b border-gray-200">
                  <span className="text-gray-600 text-sm mt-1">Advance Pay (30%)</span>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 text-lg">₹ {advancePay.toLocaleString()}</div>
                    <div className="text-green-600 text-xs font-bold">(Pay Now)</div>
                  </div>
                </div>
                
                <div className="cost-row items-start">
                  <span className="text-gray-600 text-sm mt-1">Balance Amount</span>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 text-lg">₹ {balancePay.toLocaleString()}</div>
                    <div className="text-gray-500 text-xs font-medium">(Pay Before Event)</div>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="important-info-box mt-6" style={{ padding: "20px" }}>
                <h4 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2"><FileText size={16} className="text-orange-500"/> Important Notes</h4>
                <ul className="info-list" style={{ color: "#334155" }}>
                  <li>Advance payment is required to confirm your booking.</li>
                  <li>Balance payment should be cleared 3 days before the event.</li>
                  <li>Cancellation policy applies as per terms and conditions.</li>
                </ul>
              </div>

              {/* Need Changes */}
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5 mt-6 text-center">
                <h4 className="font-bold text-sm text-yellow-800 mb-2 flex items-center justify-center gap-2"><ShieldCheck size={16}/> Need Changes?</h4>
                <p className="text-xs text-gray-600 mb-4">You can edit any section before proceeding to payment.</p>
                <button className="btn-outline-orange w-full bg-white">Edit Booking</button>
              </div>

              {/* Ready to Confirm */}
              <div className="bg-green-50 border border-green-100 rounded-xl p-6 mt-6 text-center">
                <h4 className="font-bold text-base text-gray-900 mb-2">Ready to Confirm Your Booking?</h4>
                <p className="text-xs text-gray-600 mb-6">Proceed to pay the advance amount and confirm your booking.</p>
                <button 
                  className="btn-solid-orange w-full mb-4 text-base py-3 flex items-center justify-center gap-2" 
                  onClick={handleRazorpayPayment}
                  disabled={isProcessing}
                  style={{ opacity: isProcessing ? 0.7 : 1, cursor: isProcessing ? 'not-allowed' : 'pointer' }}
                >
                  {isProcessing ? "Processing..." : <>Proceed to Pay <ArrowRight size={20} /></>}
                </button>
                <div className="text-xs text-gray-700 font-semibold flex items-center justify-center gap-2"><ShieldCheck size={14}/> Secure Payment</div>
              </div>

            </div>
          </div>

          <div className="bottom-navigation" style={{ marginTop: "20px", padding: "0 32px 32px" }}>
            <button className="btn-nav-back bg-white" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} /> Back
            </button>
            <div className="text-sm text-gray-600 font-medium flex items-center gap-2"><ShieldCheck size={16}/> Your booking is safe and secure with us.</div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
