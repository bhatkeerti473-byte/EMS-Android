import React, { useState, useRef } from "react";
import { Download, X, Printer, Ticket, Info } from "lucide-react";
import html2pdf from "html2pdf.js";
import "./styles/Invoice.css";

export default function Invoice({ bookingData, paymentData, onClose, formData }) {
  const [downloading, setDownloading] = useState(false);
  const invoiceRef = useRef(null);

  const invoiceData = {
    invoiceNo: `BK-${new Date().getFullYear()}-${bookingData.booking_id?.substring(0, 6).toUpperCase() || '000123'}`,
    invoiceDate: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    eventDate: bookingData.event_date ? new Date(bookingData.event_date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      weekday: "short"
    }) : "TBD",
    time: bookingData.time_slot,
    clientName: bookingData.client_name || "Client Name",
    phone: bookingData.phone_number,
    eventType: bookingData.event_type,
    venue: bookingData.venue_name || "Home",
    totalCost: bookingData.total_cost,
    advancePaid: (bookingData.total_cost * 0.3).toFixed(2),
    balanceDue: (bookingData.total_cost * 0.7).toFixed(2),
  };

  const handleDownloadPDF = () => {
    setDownloading(true);
    if (!invoiceRef.current) return;
    
    const element = invoiceRef.current;
    const opt = {
      margin:       0.5,
      filename:     `Booking_Details_${invoiceData.invoiceNo}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      setDownloading(false);
    });
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=800,width=800");
    printWindow.document.write('<html><head><title>Print Booking Details</title>');
    // basic styles for printing
    printWindow.document.write(`
      <style>
        body { font-family: sans-serif; padding: 20px; color: #0f172a; }
        .doc-brand-header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px;}
        .doc-brand { display: flex; align-items: center; gap: 12px; }
        .doc-brand h3 { margin: 0; color: #9a3412; }
        .doc-brand p { margin: 0; font-size: 12px; color: #64748b; }
        .doc-meta .meta-row { display: flex; justify-content: space-between; gap: 20px; font-size: 14px; margin-bottom: 4px; }
        .doc-meta .meta-row span { color: #9a3412; font-weight: 600; }
        .doc-section { margin-bottom: 24px; }
        .doc-section-title { color: #9a3412; font-size: 14px; margin-bottom: 12px; font-weight: 600; }
        .doc-grid-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; }
        .doc-grid-row span { color: #333; }
        .doc-services-list { list-style: none; padding-left: 0; margin: 0; font-size: 14px; }
        .doc-services-list li { margin-bottom: 4px; }
        .highlight-advance { color: #ea580c; font-weight: 600; }
      </style>
    `);
    printWindow.document.write('</head><body>');
    printWindow.document.write(invoiceRef.current.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
  
  const formatMoney = (val) => `\u20B9${Number(val).toLocaleString('en-IN')}`;

  const getServicesList = () => {
    const list = [];
    if (bookingData.catering_details?.type) list.push("Catering");
    if (bookingData.staff_requirements && Object.keys(bookingData.staff_requirements).length > 0) list.push("Staff Support");
    if (formData?.home_services) list.push(...formData.home_services);
    if (formData?.home_setup_requirements) list.push(...formData.home_setup_requirements);
    
    if (list.length === 0) list.push("Venue / Base Package");
    return Array.from(new Set(list)); // unique
  };

  return (
    <div className="invoice-modal-overlay">
      <div className="invoice-modal-content">
        
        {/* Header */}
        <div className="invoice-modal-header">
          <div className="invoice-header-titles">
            <div className="icon-wrapper">
              <Download size={20} color="#ea580c" />
            </div>
            <div>
              <h2>Download Booking Details</h2>
              <p>Get a copy of your booking details.</p>
            </div>
          </div>
          <button className="invoice-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="invoice-modal-body">
          <div className="invoice-document-wrapper">
            <div className="invoice-document" ref={invoiceRef}>
              
              {/* Brand & Meta */}
              <div className="doc-brand-header">
                <div className="doc-brand">
                  <div className="doc-logo">
                    <Ticket size={24} color="#ea580c" />
                  </div>
                  <div>
                    <h3>Event Manager</h3>
                    <p>We Plan, You Celebrate!</p>
                  </div>
                </div>
                <div className="doc-meta">
                  <div className="meta-row">
                    <span>Booking ID</span>
                    <strong>{invoiceData.invoiceNo}</strong>
                  </div>
                  <div className="meta-row">
                    <span>Booking Date</span>
                    <strong>{invoiceData.invoiceDate}</strong>
                  </div>
                </div>
              </div>

              <div className="doc-section">
                <h4 className="doc-section-title">Event Details</h4>
                <div className="doc-grid">
                  <div className="doc-grid-row">
                    <span>Event Type</span>
                    <strong>{invoiceData.eventType}</strong>
                  </div>
                  <div className="doc-grid-row">
                    <span>Event Location</span>
                    <strong>{invoiceData.venue}</strong>
                  </div>
                  <div className="doc-grid-row">
                    <span>Event Date</span>
                    <strong>{invoiceData.eventDate}</strong>
                  </div>
                  <div className="doc-grid-row">
                    <span>Time</span>
                    <strong>{invoiceData.time}</strong>
                  </div>
                </div>
              </div>

              <div className="doc-section">
                <h4 className="doc-section-title">Client Details</h4>
                <div className="doc-grid">
                  <div className="doc-grid-row">
                    <span>Name</span>
                    <strong>{invoiceData.clientName}</strong>
                  </div>
                  <div className="doc-grid-row">
                    <span>Phone</span>
                    <strong>{invoiceData.phone}</strong>
                  </div>
                </div>
              </div>

              <div className="doc-section">
                <h4 className="doc-section-title">Services Selected</h4>
                <ul className="doc-services-list">
                  {getServicesList().map((srv, idx) => (
                    <li key={idx}>• {srv}</li>
                  ))}
                </ul>
              </div>

              <div className="doc-section doc-cost-section">
                <h4 className="doc-section-title">Cost Summary</h4>
                <div className="doc-grid">
                  <div className="doc-grid-row">
                    <span>Total Cost</span>
                    <strong>{formatMoney(invoiceData.totalCost)}</strong>
                  </div>
                  <div className="doc-grid-row highlight-advance">
                    <span>Advance Payment (30%)</span>
                    <strong>{formatMoney(invoiceData.advancePaid)}</strong>
                  </div>
                  <div className="doc-grid-row">
                    <span>Remaining Amount</span>
                    <strong>{formatMoney(invoiceData.balanceDue)}</strong>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="invoice-actions-footer">
          <button className="invoice-btn-outline" onClick={handleDownloadPDF} disabled={downloading}>
            <Download size={18} />
            {downloading ? "Downloading..." : "Download PDF"}
          </button>
          <button className="invoice-btn-outline" onClick={handlePrint}>
            <Printer size={18} />
            Print
          </button>
        </div>
        
        <div className="invoice-footer-note">
          <Info size={14} color="#64748b" />
          <span>This document contains your booking details and cost summary.</span>
        </div>

      </div>
    </div>
  );
}
