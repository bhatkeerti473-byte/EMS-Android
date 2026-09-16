import React, { useState } from "react";
import { Check, ArrowLeft, Send, Info, CheckCircle2, CloudUpload, ClipboardList, Search, HeadphonesIcon, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import "../styles/premium-dashboard.css";
import axios from "axios";

const EventTypeRequest = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventTypeName: "",
    description: "",
    expectedDate: "",
    expectedGuests: "",
    locationType: "",
    budgetRange: "",
    specialRequirements: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.eventTypeName || !formData.description || !formData.expectedDate) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/event-type-requests",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(true);
      setFormData({
        eventTypeName: "",
        description: "",
        expectedDate: "",
        expectedGuests: "",
        locationType: "",
        budgetRange: "",
        specialRequirements: "",
      });
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.response?.data?.message || "An error occurred while submitting your request.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="premium-dashboard">
        <Sidebar />
        <div className="premium-main">
          <Topbar title="Request Submitted" />
          <div className="premium-content-scroll flex flex-col items-center justify-center p-8 text-center bg-white min-h-[80vh]">
            <CheckCircle2 size={64} className="text-green-500 mb-6" />
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Request Submitted Successfully!</h2>
            <p className="text-slate-600 max-w-md mx-auto mb-8">
              Your custom event type request has been submitted successfully and is awaiting review. Our event experts will analyze your request and get back to you soon.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/client/dashboard")}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition border border-slate-200"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar title="Client Overview" />

        <div className="premium-content-scroll" style={{ backgroundColor: "#ffffff" }}>
          <div className="page-header" style={{ padding: "20px 32px 0" }}>
            <h2 style={{ color: "#0f172a", fontSize: "24px", marginBottom: "4px" }}>Send Event Type Request</h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "0" }}>Can't find your event type in the list? Tell us about it and we'll help you plan it.</p>
          </div>

          <div className="stepper-wrapper">
            <div className="stepper-line-bg"></div>
            <div className="step-point">
              <div className="step-circle completed"><Check size={16} /></div>
              <div className="step-label active">Select Date</div>
            </div>
            <div className="step-point">
              <div className="step-circle active">2</div>
              <div className="step-label active">Event Type</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">3</div>
              <div className="step-label">Select Venue</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">4</div>
              <div className="step-label">Decoration & Catering</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">5</div>
              <div className="step-label">Hall Type</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">6</div>
              <div className="step-label">Additional Services</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">7</div>
              <div className="step-label">Booking Summary</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">8</div>
              <div className="step-label">Payment</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">9</div>
              <div className="step-label">Confirmation</div>
            </div>
          </div>


          <div className="request-container">
            <div className="request-form-panel">
              <h3 className="section-heading">Tell us about your event</h3>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-start gap-3">
                  <XCircle size={20} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Event Type Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="eventTypeName"
                      value={formData.eventTypeName}
                      onChange={handleChange}
                      placeholder="Enter your event type" 
                      className="premium-input" 
                      required
                    />
                    <span className="input-hint">Example: Farewell Party, Bridal Shower, Housewarming, etc.</span>
                  </div>
                  
                  <div className="form-group" style={{ gridRow: "span 2" }}>
                    <label>Event Description <span className="text-red-500">*</span></label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your event in detail..." 
                      className="premium-textarea"
                      style={{ height: "132px" }}
                      required
                    ></textarea>
                    <span className="input-hint">Include the purpose, theme, and any special requirements.</span>
                  </div>
                  
                  <div className="form-group">
                    <label>Expected Date <span className="text-red-500">*</span></label>
                    <input 
                      type="date" 
                      name="expectedDate"
                      value={formData.expectedDate}
                      onChange={handleChange}
                      className="premium-input" 
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Expected Guests</label>
                    <input 
                      type="number" 
                      name="expectedGuests"
                      value={formData.expectedGuests}
                      onChange={handleChange}
                      placeholder="Enter approximate number of guests" 
                      className="premium-input" 
                    />
                  </div>

                  <div className="form-group">
                    <label>Preferred Location Type</label>
                    <select 
                      name="locationType"
                      value={formData.locationType}
                      onChange={handleChange}
                      className="premium-select"
                    >
                      <option value="">Select location type</option>
                      <option value="indoor">Indoor</option>
                      <option value="outdoor">Outdoor</option>
                      <option value="both">Indoor & Outdoor</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Budget Range (INR)</label>
                    <select 
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleChange}
                      className="premium-select"
                    >
                      <option value="">Select budget range</option>
                      <option value="under50k">Under ₹50,000</option>
                      <option value="50k-1l">₹50,000 - ₹1,00,000</option>
                      <option value="1l-5l">₹1,00,000 - ₹5,00,000</option>
                      <option value="above5l">Above ₹5,00,000</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label>Special Requirements (Optional)</label>
                    <textarea 
                      name="specialRequirements"
                      value={formData.specialRequirements}
                      onChange={handleChange}
                      placeholder="Any specific needs, preferences, or requests..." 
                      className="premium-textarea"
                      style={{ height: "80px" }}
                    ></textarea>
                    <span className="input-hint">e.g. Custom decorations, specific cuisine, entertainment, etc.</span>
                  </div>

                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label>Upload Reference Images (Optional)</label>
                    <div className="upload-zone">
                      <CloudUpload size={24} className="upload-icon" />
                      <div className="upload-text">
                        <span className="text-blue-500 cursor-pointer">Click to upload</span> or drag and drop
                      </div>
                      <div className="upload-hint">PNG, JPG, JPEG up to 5MB (Max 5 images)</div>
                    </div>
                  </div>
                </div>

                <div className="bottom-navigation" style={{ padding: "32px 0 0", marginTop: "24px", borderTop: "1px solid #e2e8f0" }}>
                  <button type="button" className="btn-nav-back" onClick={() => navigate(-1)} disabled={loading}>
                    <ArrowLeft size={20} /> Back
                  </button>
                  <button type="submit" className="btn-nav-submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Request"} <Send size={18} style={{ marginLeft: "8px" }} />
                  </button>
                </div>
              </form>
            </div>

            <div className="request-sidebar">
              <div className="guidelines-card">
                <div className="guideline-header">
                  <Info size={18} />
                  <h4>Request Guidelines</h4>
                </div>
                <ul className="guideline-list">
                  <li>
                    <CheckCircle2 size={16} className="text-blue-500" />
                    <span>Provide clear details about your event type to help us understand your requirements.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="text-blue-500" />
                    <span>Our event experts will review your request and get back to you within 24 hours.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="text-blue-500" />
                    <span>You'll receive personalized options tailored to your needs.</span>
                  </li>
                </ul>
              </div>

              <div className="timeline-card">
                <h4>What happens next?</h4>
                <div className="timeline-vertical">
                  <div className="timeline-item">
                    <div className="timeline-icon"><ClipboardList size={14} /></div>
                    <div className="timeline-content">
                      <h5>Request Submitted</h5>
                      <p>We receive your event type request and review the details.</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-icon"><Search size={14} /></div>
                    <div className="timeline-content">
                      <h5>Expert Review</h5>
                      <p>Our event experts analyze your request and find the best options.</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-icon"><Check size={14} /></div>
                    <div className="timeline-content">
                      <h5>Get Personalized Options</h5>
                      <p>We'll contact you with customized solutions and recommendations.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="assistance-box">
                <HeadphonesIcon size={24} className="assistance-icon" />
                <div>
                  <h5>Need immediate assistance?</h5>
                  <p>Call us at <span className="text-blue-500">+91 98765 43210</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTypeRequest;

