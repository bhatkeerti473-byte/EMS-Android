const generateBookingConfirmationEmail = (bookingData, frontendUrl) => {
  const {
    _id,
    bookingReference,
    clientName,
    event_type,
    event_date,
    time_slot,
    booking_status,
    guests,
    createdAt,
    venueName,
    image,
    total_cost,
    advance_paid,
    remainingAmount,
    amount,
    payment_method,
    payment_id,
    paymentConfirmedAt,
    decorationPackage,
    cateringPackage,
    cakeName,
    cakePrice,
    additionalServices,
    seatingArrangement,
    location,
    address,
    catering_details
  } = bookingData;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (timeString) => {
      return timeString || '09:00 AM - 11:00 PM';
  }

  const formatCurrency = (val) => {
    return '₹ ' + (val || 0).toLocaleString('en-IN');
  };

  const pdfLink = `${frontendUrl}/bookings/${_id}/receipt`;
  const payLink = `${frontendUrl}/client/my-bookings?bookingId=${_id}`;
  const viewLink = `${frontendUrl}/client/my-bookings`; // updated to dashboard route

  const primaryColor = '#002B5B';
  const goldColor = '#D4AF37';

  const totalEventAmount = total_cost || amount || 0;
  const amountPaidVal = advance_paid || 0;
  const remAmountVal = remainingAmount || (totalEventAmount - amountPaidVal);

  // Calculate dynamic costs for breakdown
  const cakeCost = cakeName && cakeName !== 'None' ? (cakePrice || 5000) : 0;
  const photoCost = additionalServices?.photography ? 35000 : 0;
  const djCost = additionalServices?.dj ? 20000 : 0;
  const transportCost = additionalServices?.travel ? 30000 : 0;
  const cateringCost = (cateringPackage || catering_details) ? 30000 : 0;
  const decorationCost = decorationPackage ? 25000 : 0;
  
  let otherCosts = cakeCost + photoCost + djCost + transportCost + cateringCost + decorationCost;
  let venueCost = totalEventAmount - otherCosts;
  if (venueCost < 0) {
    venueCost = totalEventAmount; 
  }

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; color: #1f2937; }
      .email-container { max-width: 700px; margin: 20px auto; background-color: #ffffff; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
      
      /* Header */
      .header { background-color: ${primaryColor}; color: white; padding: 25px 30px; display: flex; align-items: center; justify-content: space-between; position: relative; }
      .header-logo-container { display: flex; align-items: center; gap: 15px; }
      .logo-circle { width: 50px; height: 50px; border-radius: 50%; border: 2px solid ${goldColor}; display: flex; align-items: center; justify-content: center; background-color: #0a192f; flex-direction: column; }
      .logo-crown { color: ${goldColor}; font-size: 16px; line-height: 1; margin-bottom: -2px; }
      .logo-text { color: ${goldColor}; font-weight: bold; font-size: 12px; text-align: center; line-height: 1; }
      .header-title-text { font-size: 16px; font-weight: 700; letter-spacing: 1px; line-height: 1.2; text-transform: uppercase; }
      .header-slogan { font-size: 12px; font-style: italic; color: #e2e8f0; text-align: right; margin-top: 5px; }
      
      /* Main Content */
      .main-body { padding: 30px; }
      .title-section { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; }
      .booking-confirmed-wrapper { display: flex; align-items: center; gap: 15px; }
      .check-icon { width: 40px; height: 40px; background-color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; }
      .main-title { color: #0f172a; font-size: 28px; font-weight: 800; margin: 0; }
      .thank-you-script { color: #1e3a8a; font-family: 'Brush Script MT', cursive; font-size: 24px; transform: rotate(-5deg); text-align: right; }
      
      .greeting { font-size: 16px; font-weight: 600; color: #1e293b; margin-bottom: 10px; }
      .intro-text { color: #475569; font-size: 14px; margin-bottom: 30px; line-height: 1.5; }

      /* Info Grid */
      .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px; }
      .info-item { display: flex; gap: 10px; align-items: flex-start; }
      .info-icon { color: #3b82f6; font-size: 20px; }
      .info-content .label { font-size: 11px; color: #64748b; text-transform: uppercase; margin-bottom: 3px; font-weight: 600; }
      .info-content .value { font-size: 14px; color: #0f172a; font-weight: 600; }

      /* Venue Section */
      .venue-box { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 30px; background-color: #f8fafc; }
      .venue-details-container { padding: 20px; display: flex; flex-direction: column; }
      .venue-name-row { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
      .venue-name { font-size: 18px; font-weight: 700; color: #1e3a8a; margin: 0; }
      .venue-location { font-size: 13px; color: #64748b; margin-bottom: 10px; display: flex; align-items: center; gap: 5px; }
      .venue-stats { display: flex; gap: 20px; font-size: 13px; color: #475569; margin-bottom: 15px; }
      .venue-desc { font-size: 13px; color: #64748b; margin-bottom: 15px; line-height: 1.4; }
      .view-venue-btn { display: inline-flex; align-items: center; justify-content: center; padding: 8px 16px; border: 1px solid #cbd5e1; border-radius: 6px; color: #3b82f6; font-size: 13px; font-weight: 600; text-decoration: none; width: 100%; box-sizing: border-box; background: white; }

      /* Section Headers */
      .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
      .section-header h3 { font-size: 16px; font-weight: 700; color: #1e3a8a; margin: 0; }

      /* Selected Services Grid */
      .services-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 30px; }
      .service-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; display: flex; gap: 12px; position: relative; }
      .service-icon { color: #f59e0b; font-size: 24px; display: flex; align-items: flex-start; }
      .service-details { flex-grow: 1; }
      .service-name { font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 3px; }
      .service-desc { font-size: 12px; color: #64748b; margin-bottom: 8px; min-height: 20px; }
      .service-price { font-size: 13px; font-weight: 700; color: #0f172a; position: absolute; right: 15px; top: 15px; }

      /* Two Column Layout */
      .split-container { display: flex; gap: 20px; margin-bottom: 30px; }
      .split-col { flex: 1; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; background: #fafafa; }
      
      /* Cost Breakdown */
      .cost-row { display: flex; justify-content: space-between; font-size: 13px; color: #475569; margin-bottom: 8px; }
      .cost-total-row { display: flex; justify-content: space-between; font-size: 15px; font-weight: 700; color: #1e3a8a; margin-top: 15px; padding-top: 15px; border-top: 1px solid #cbd5e1; }

      /* Payment Summary */
      .payment-summary .cost-row { color: #334155; font-weight: 500; }
      .amount-paid { color: #059669; }
      .amount-remaining { color: #dc2626; font-weight: 700; padding: 8px 0; border-top: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1; margin: 10px 0; }
      .pay-btn { display: block; width: 100%; padding: 10px; background-color: #2563eb; color: white; text-align: center; border-radius: 6px; font-weight: 600; text-decoration: none; margin-bottom: 15px; font-size: 14px; }
      .payment-status-box { background-color: #ecfdf5; color: #059669; padding: 10px; border-radius: 6px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; margin-bottom: 15px; }
      .payment-details-meta { font-size: 12px; color: #64748b; line-height: 1.6; }
      .payment-details-meta strong { color: #334155; font-size: 13px; }

      /* Booking History Timeline */
      .history-table { width: 100%; font-size: 12px; text-align: left; border-collapse: collapse; margin-bottom: 30px; }
      .history-table th { border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; color: #64748b; font-weight: 600; }
      .history-table td { padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #334155; }
      .history-status { color: #059669; background: #ecfdf5; padding: 2px 8px; border-radius: 4px; font-weight: 600; border: 1px solid #a7f3d0; }

      /* Timeline */
      .timeline-container { display: flex; justify-content: space-between; position: relative; margin-top: 20px; padding: 0 10px; }
      .timeline-line { position: absolute; top: 12px; left: 10%; right: 10%; height: 2px; background-color: #e2e8f0; z-index: 1; }
      .timeline-line-active { position: absolute; top: 12px; left: 10%; right: 50%; height: 2px; background-color: #10b981; z-index: 1; }
      .timeline-step { position: relative; z-index: 2; text-align: center; width: 60px; }
      .timeline-dot { width: 24px; height: 24px; border-radius: 50%; background-color: #e2e8f0; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; }
      .timeline-dot.active { background-color: #10b981; color: white; }
      .timeline-label { font-size: 10px; color: #64748b; font-weight: 600; line-height: 1.2; }

      /* Footer */
      .footer { background-color: #0f172a; color: #94a3b8; padding: 30px; font-size: 12px; display: flex; justify-content: space-between; align-items: center; }
      .footer-left { display: flex; align-items: center; gap: 15px; }
      .social-icons { display: flex; gap: 10px; }
      .social-icon { width: 24px; height: 24px; background: #334155; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; text-decoration: none; }

      .action-buttons { display: flex; justify-content: center; gap: 15px; padding: 20px; background: white; border-top: 1px solid #e2e8f0; }
      .btn-action { padding: 10px 24px; border-radius: 6px; font-weight: 600; font-size: 14px; text-decoration: none; cursor: pointer; display: flex; align-items: center; gap: 8px; }
      .btn-outline { border: 1px solid #cbd5e1; color: #475569; background: white; }
      .btn-solid { background: #2563eb; color: white; border: 1px solid #2563eb; }
      
      @media (max-width: 600px) {
        .info-grid { grid-template-columns: repeat(2, 1fr); }
        .services-grid { grid-template-columns: 1fr; }
        .split-container { flex-direction: column; }
        .title-section { flex-direction: column; align-items: flex-start; gap: 15px; }
        .thank-you-script { align-self: flex-end; }
        .footer { flex-direction: column; gap: 20px; text-align: center; }
        .footer-left { flex-direction: column; }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      
      <!-- Header -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${primaryColor}; color: white; padding: 20px 30px;">
        <tr>
          <td width="60">
            <div class="logo-circle">
              <span class="logo-crown">👑</span>
              <span class="logo-text">EMS</span>
            </div>
          </td>
          <td>
            <div class="header-title-text">EVENT<br>MANAGEMENT SYSTEM</div>
          </td>
          <td align="right" valign="middle">
            <div class="header-slogan">Making Your Special Moments<br>More Memorable <span style="color: ${goldColor}; font-size:16px;">♥</span></div>
          </td>
        </tr>
      </table>

      <div class="main-body">
        
        <!-- Title Section -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
          <tr>
            <td valign="middle">
              <div class="booking-confirmed-wrapper">
                <div class="check-icon">&#10003;</div>
                <h1 class="main-title">Booking Confirmed!</h1>
              </div>
            </td>
            <td align="right" valign="top">
              <div class="thank-you-script">Thank you<br>for choosing<br>Event! <span style="color: ${goldColor};">&#10084;</span></div>
            </td>
          </tr>
        </table>

        <div class="greeting">Hello ${clientName || 'Valued Client'},</div>
        <div class="intro-text">
          Your event booking has been successfully confirmed.<br>
          We're excited to be a part of your special day!
        </div>

        <!-- Info Grid -->
        <div class="info-grid">
          <div class="info-item">
            <div class="info-icon">💍</div>
            <div class="info-content">
              <div class="label">Event Type</div>
              <div class="value">${event_type || 'Wedding'}</div>
            </div>
          </div>
          <div class="info-item">
            <div class="info-icon">📅</div>
            <div class="info-content">
              <div class="label">Event Date</div>
              <div class="value">${formatDate(event_date)}</div>
            </div>
          </div>
          <div class="info-item">
            <div class="info-icon">🎫</div>
            <div class="info-content">
              <div class="label">Booking ID</div>
              <div class="value" style="font-size:12px; font-weight:700; word-break: break-all;">${bookingReference || _id}</div>
            </div>
          </div>
          <div class="info-item">
            <div class="info-icon">🗓️</div>
            <div class="info-content">
              <div class="label">Booking Date</div>
              <div class="value">${formatDate(createdAt)}</div>
            </div>
          </div>
          <div class="info-item">
            <div class="info-icon">⏱️</div>
            <div class="info-content">
              <div class="label">Event Time</div>
              <div class="value">${formatTime(time_slot)}</div>
            </div>
          </div>
          <div class="info-item">
            <div class="info-icon">👥</div>
            <div class="info-content">
              <div class="label">Guest Count</div>
              <div class="value">${guests || catering_details?.guest_count || 'N/A'} Guests</div>
            </div>
          </div>
        </div>

        <!-- Venue Section -->
        <div class="venue-box">
          <div class="venue-details-container">
            <div class="venue-name-row">
              <span style="font-size: 16px;">📍</span>
              <span style="font-size: 14px; font-weight: bold; color: #3b82f6;">Selected Venue</span>
            </div>
            <h3 class="venue-name" style="margin-top: 5px;">${venueName || 'Venue Not Specified'}</h3>
            <div class="venue-location">
               ${location || address || 'Location details not provided'}
            </div>
            <div class="venue-desc">
              Your venue has been successfully reserved for your special event.
            </div>
            <a href="${viewLink}" class="view-venue-btn">View Venue Details &rarr;</a>
          </div>
        </div>

        <!-- Selected Services -->
        <div class="section-header">
          <span style="font-size: 20px;">⚙️</span>
          <h3>Selected Services & Items</h3>
        </div>
        <div class="services-grid">
          ${cateringCost > 0 ? `
          <div class="service-card">
            <div class="service-icon">🍽️</div>
            <div class="service-details">
              <div class="service-name">Catering</div>
              <div class="service-desc">${cateringPackage || 'Catering Included'}</div>
              <div class="service-price">${formatCurrency(cateringCost)}</div>
            </div>
          </div>` : ''}
          ${decorationCost > 0 ? `
          <div class="service-card">
            <div class="service-icon">✨</div>
            <div class="service-details">
              <div class="service-name">Decoration</div>
              <div class="service-desc">${decorationPackage}</div>
              <div class="service-price">${formatCurrency(decorationCost)}</div>
            </div>
          </div>` : ''}
          ${cakeCost > 0 ? `
          <div class="service-card">
            <div class="service-icon">🎂</div>
            <div class="service-details">
              <div class="service-name">Cake</div>
              <div class="service-desc">${cakeName}</div>
              <div class="service-price">${formatCurrency(cakeCost)}</div>
            </div>
          </div>` : ''}
          ${photoCost > 0 ? `
          <div class="service-card">
            <div class="service-icon">📸</div>
            <div class="service-details">
              <div class="service-name">Photography</div>
              <div class="service-desc">Included in booking</div>
              <div class="service-price">${formatCurrency(photoCost)}</div>
            </div>
          </div>` : ''}
          ${djCost > 0 ? `
          <div class="service-card">
            <div class="service-icon">🎵</div>
            <div class="service-details">
              <div class="service-name">DJ / Sound</div>
              <div class="service-desc">Included in booking</div>
              <div class="service-price">${formatCurrency(djCost)}</div>
            </div>
          </div>` : ''}
          ${transportCost > 0 ? `
          <div class="service-card">
            <div class="service-icon">🚌</div>
            <div class="service-details">
              <div class="service-name">Transport</div>
              <div class="service-desc">Included in booking</div>
              <div class="service-price">${formatCurrency(transportCost)}</div>
            </div>
          </div>` : ''}
        </div>

        <!-- Split Container (Costs and Payment) -->
        <div class="split-container">
          <!-- Cost Breakdown -->
          <div class="split-col">
            <div class="section-header">
              <span style="font-size: 18px;">💰</span>
              <h3>Event Cost Breakdown</h3>
            </div>
            <p style="font-size: 12px; color: #64748b; margin-bottom: 10px;">Cost breakdown for your event services.</p>
            
            <div class="cost-row"><span>Venue Booking</span><span>${formatCurrency(venueCost)}</span></div>
            ${cateringCost > 0 ? `<div class="cost-row"><span>Catering</span><span>${formatCurrency(cateringCost)}</span></div>` : ''}
            ${decorationCost > 0 ? `<div class="cost-row"><span>Decoration</span><span>${formatCurrency(decorationCost)}</span></div>` : ''}
            ${cakeCost > 0 ? `<div class="cost-row"><span>Cake</span><span>${formatCurrency(cakeCost)}</span></div>` : ''}
            ${photoCost > 0 ? `<div class="cost-row"><span>Photography</span><span>${formatCurrency(photoCost)}</span></div>` : ''}
            ${djCost > 0 ? `<div class="cost-row"><span>DJ / Sound</span><span>${formatCurrency(djCost)}</span></div>` : ''}
            ${transportCost > 0 ? `<div class="cost-row"><span>Transport</span><span>${formatCurrency(transportCost)}</span></div>` : ''}

            <div class="cost-total-row">
              <span>Total Event Amount</span>
              <span>${formatCurrency(totalEventAmount)}</span>
            </div>
          </div>

          <!-- Payment Summary -->
          <div class="split-col">
            <div class="section-header">
              <span style="font-size: 18px;">💳</span>
              <h3>Payment Summary</h3>
            </div>
            <div class="payment-summary">
              <div class="cost-row">
                <span>Total Amount</span>
                <span>${formatCurrency(totalEventAmount)}</span>
              </div>
              <div class="cost-row amount-paid">
                <span>Amount Paid</span>
                <span>${formatCurrency(amountPaidVal)}</span>
              </div>
              <div class="cost-row amount-remaining">
                <span>Remaining Amount</span>
                <span>${formatCurrency(remAmountVal)}</span>
              </div>
              
              ${remAmountVal > 0 ? `
              <a href="${payLink}" class="pay-btn">🔒 Pay Remaining Amount</a>
              ` : ''}
              
              <div class="payment-status-box">
                <span style="font-size: 16px;">✓</span> Payment Status: Successful
              </div>
              
              <div class="payment-details-meta">
                <strong style="display:flex; align-items:center; gap:5px;"><span style="font-size: 14px;">📄</span> Payment Details</strong><br>
                Payment Method <span style="float:right;">${payment_method || 'Online'}</span><br>
                Transaction ID <span style="float:right;">${payment_id || 'N/A'}</span><br>
                Paid On <span style="float:right;">${formatDate(paymentConfirmedAt || createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking History -->
        <div class="section-header">
          <span style="font-size: 18px;">📋</span>
          <h3>Booking History</h3>
        </div>
        <table class="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment ID</th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${formatDate(paymentConfirmedAt || createdAt)}</td>
              <td>${formatCurrency(amountPaidVal)}</td>
              <td><span class="history-status">Successful</span></td>
              <td>${payment_id || 'N/A'}</td>
              <td>${payment_method || 'Online'}</td>
            </tr>
          </tbody>
        </table>

        <!-- Booking Status Timeline -->
        <div class="section-header">
          <span style="font-size: 18px;">⏱️</span>
          <h3>Booking Status</h3>
        </div>
        <div class="timeline-container">
          <div class="timeline-line"></div>
          <div class="timeline-line-active"></div>
          
          <div class="timeline-step">
            <div class="timeline-dot active">✓</div>
            <div class="timeline-label">Booking<br>Submitted</div>
          </div>
          <div class="timeline-step">
            <div class="timeline-dot active">✓</div>
            <div class="timeline-label">Payment<br>Confirmed</div>
          </div>
          <div class="timeline-step">
            <div class="timeline-dot active">✓</div>
            <div class="timeline-label">Booking<br>Confirmed</div>
          </div>
          <div class="timeline-step">
            <div class="timeline-dot">⏳</div>
            <div class="timeline-label">Event<br>Preparation</div>
          </div>
          <div class="timeline-step">
            <div class="timeline-dot">🏁</div>
            <div class="timeline-label">Event<br>Completed</div>
          </div>
        </div>

      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <a href="mailto:noreply@eventmanagement.com" class="btn-action btn-outline">↩️ Reply</a>
        <a href="${pdfLink}" class="btn-action btn-outline">📄 Save PDF</a>
        <a href="${pdfLink}" class="btn-action btn-solid">⬇️ Download</a>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-left">
          <div class="logo-circle" style="width: 30px; height: 30px; border-width: 1px;">
            <span class="logo-crown" style="font-size: 10px;">👑</span>
            <span class="logo-text" style="font-size: 8px;">EMS</span>
          </div>
          <div>
            <strong style="color: white; display: block; margin-bottom: 2px;">EVENT MANAGEMENT SYSTEM</strong>
            Thank you for choosing EMS Event Management System
          </div>
        </div>
        <div>
          You are receiving this email because an event booking was made using your account.
        </div>
        <div class="social-icons">
          <a href="#" class="social-icon">f</a>
          <a href="#" class="social-icon">in</a>
          <a href="#" class="social-icon">X</a>
        </div>
      </div>

    </div>
  </body>
  </html>
  `;
};

module.exports = { generateBookingConfirmationEmail };
