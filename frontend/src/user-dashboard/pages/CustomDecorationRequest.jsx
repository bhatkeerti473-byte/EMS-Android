import React, { useState } from "react";
import { Check, ArrowLeft, Send, Info, CheckCircle2, CloudUpload, ClipboardList, Search, HeadphonesIcon, XCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import EventSummaryFooter from "../styles/components/EventSummaryFooter";
import "../styles/premium-dashboard.css";
import axios from "axios";

const CustomDecorationRequest = () => {
  const navigate = useNavigate();
  const [decorTitle, setDecorTitle] = useState("");
  const [description, setDescription] = useState("");
  const [colorTheme, setColorTheme] = useState("#e11d48");
  const [flowerPreference, setFlowerPreference] = useState("mixed");
  const [budget, setBudget] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!decorTitle || !description) {
      setError("Please fill in the required fields: Decoration Name and Description.");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/decoration-requests",
        {
          decorTitle,
          description,
          colorTheme,
          flowerPreference,
          budget,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(true);
      setDecorTitle("");
      setDescription("");
      setColorTheme("#e11d48");
      setFlowerPreference("mixed");
      setBudget("");
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
              Your custom decoration request has been submitted successfully and is awaiting review. Our design team will analyze your preferences and get back to you soon.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/client/dashboard")}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate("/client/decoration")}
                className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition border border-slate-200"
              >
                Continue to Decorations
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
            <h2 style={{ color: "#0f172a", fontSize: "24px", marginBottom: "4px" }}>Request Custom Decoration</h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "0" }}>Describe your decoration theme ideas and preferences, and our design team will customize it for you.</p>
          </div>

          <div className="stepper-wrapper" style={{ margin: "20px 32px 10px" }}>
            <div className="stepper-line-bg"></div>
            <div className="step-point">
              <div className="step-circle completed"><Check size={16} /></div>
              <div className="step-label active">Select Date</div>
            </div>
            <div className="step-point">
              <div className="step-circle completed"><Check size={16} /></div>
              <div className="step-label active">Event Type</div>
            </div>
            <div className="step-point">
              <div className="step-circle completed"><Check size={16} /></div>
              <div className="step-label active">Select Venue</div>
            </div>
            <div className="step-point">
              <div className="step-circle active" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>4</div>
              <div className="step-label active" style={{color: '#ea580c', fontWeight: 600}}>Decoration Style</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">5</div>
              <div className="step-label">Guest List</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">6</div>
              <div className="step-label">Catering Options</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">7</div>
              <div className="step-label">Additional Services</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">8</div>
              <div className="step-label">Summary & Pay</div>
            </div>
          </div>

          <div className="request-container" style={{ padding: "0 32px 32px" }}>
            <div className="request-form-panel">
              <h3 className="section-heading">Describe Your Custom Theme</h3>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-start gap-3">
                  <XCircle size={20} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "16px" }}>
                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>Decoration Theme Name <span className="text-red-500" style={{ color: "#ef4444" }}>*</span></label>
                    <input 
                      type="text" 
                      placeholder="Enter style title (e.g. Royal Crystal Palace)" 
                      className="premium-input"
                      value={decorTitle}
                      onChange={(e) => { setDecorTitle(e.target.value); if(error) setError(null); }}
                      style={{ padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "14px" }}
                      required
                    />
                    <span className="input-hint" style={{ fontSize: "11px", color: "#94a3b8" }}>Give a name to your desired decoration setup.</span>
                  </div>
                  
                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px", gridRow: "span 2" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>Theme Details & Description <span className="text-red-500" style={{ color: "#ef4444" }}>*</span></label>
                    <textarea 
                      placeholder="Describe your design concepts, backdrop requirements, lighting preferences..." 
                      className="premium-textarea"
                      style={{ height: "132px", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "14px", resize: "none" }}
                      value={description}
                      onChange={(e) => { setDescription(e.target.value); if(error) setError(null); }}
                      required
                    ></textarea>
                    <span className="input-hint" style={{ fontSize: "11px", color: "#94a3b8" }}>Specify backdrop details, table centerpieces, entryway drapes etc.</span>
                  </div>
                  
                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>Primary Color Theme</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <input 
                        type="color" 
                        value={colorTheme}
                        onChange={(e) => setColorTheme(e.target.value)}
                        style={{ border: "none", width: "40px", height: "38px", cursor: "pointer", padding: 0 }}
                      />
                      <input 
                        type="text" 
                        value={colorTheme}
                        onChange={(e) => setColorTheme(e.target.value)}
                        className="premium-input"
                        style={{ flex: 1, padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "14px" }}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>Flower Preferences</label>
                    <select 
                      className="premium-select"
                      value={flowerPreference}
                      onChange={(e) => setFlowerPreference(e.target.value)}
                      style={{ padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "14px", background: "white" }}
                    >
                      <option value="real">100% Real Fresh Flowers</option>
                      <option value="artificial">Premium Artificial Flowers</option>
                      <option value="mixed">Mixed (Real & Artificial combo)</option>
                      <option value="none">No Floral Elements (Only Lights/Drapes)</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>Estimated Custom Budget Range (INR)</label>
                    <select 
                      className="premium-select"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      style={{ padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "14px", background: "white" }}
                    >
                      <option value="">Select budget range</option>
                      <option value="under30k">Under ₹30,000</option>
                      <option value="30k-50k">₹30,000 - ₹50,000</option>
                      <option value="50k-1l">₹50,000 - ₹1,00,000</option>
                      <option value="above1l">Above ₹1,00,000</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px", gridColumn: "span 2" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>Reference Moodboards / Design Drafts (Optional)</label>
                    <div className="upload-zone" style={{ border: "2px dashed #cbd5e1", borderRadius: "12px", padding: "24px", textAlign: "center", cursor: "pointer", background: "#f8fafc" }}>
                      <CloudUpload size={24} className="upload-icon" style={{ color: "#64748b", margin: "0 auto 8px" }} />
                      <div className="upload-text" style={{ fontSize: "13px", color: "#475569" }}>
                        <span className="text-blue cursor-pointer" style={{ color: "#2563eb", fontWeight: "600" }}>Click to upload</span> or drag and drop
                      </div>
                      <div className="upload-hint" style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>PNG, JPG, PDF up to 10MB (Max 3 files)</div>
                    </div>
                  </div>
                </div>
                
                <EventSummaryFooter icon={Sparkles} />

                <div className="bottom-navigation" style={{ padding: "16px 0 0", marginTop: "16px", borderTop: "1px solid #e2e8f0" }}>
                  <button type="button" className="btn-nav-back" onClick={() => navigate(-1)} disabled={loading}>
                    <ArrowLeft size={20} /> Back
                  </button>
                  <button type="submit" className="btn-nav-submit" disabled={loading} style={{ background: "#ea580c" }}>
                    {loading ? "Submitting..." : "Submit Request"} <Send size={18} style={{ marginLeft: "8px" }} />
                  </button>
                </div>
              </form>
            </div>

            <div className="request-sidebar" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="guidelines-card" style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <div className="guideline-header" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "#1e293b" }}>
                  <Info size={18} className="text-blue-500" style={{ color: "#3b82f6" }} />
                  <h4 style={{ margin: 0, fontWeight: "700", fontSize: "14px" }}>Custom Design Process</h4>
                </div>
                <ul className="guideline-list" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "12px", color: "#475569" }}>
                    <CheckCircle2 size={16} className="text-blue" style={{ color: "#3b82f6", flexShrink: 0 }} />
                    <span>Upload or describe design sketches for exact duplication.</span>
                  </li>
                  <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "12px", color: "#475569" }}>
                    <CheckCircle2 size={16} className="text-blue" style={{ color: "#3b82f6", flexShrink: 0 }} />
                    <span>Our florist and lighting technicians review feasibility details.</span>
                  </li>
                  <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "12px", color: "#475569" }}>
                    <CheckCircle2 size={16} className="text-blue" style={{ color: "#3b82f6", flexShrink: 0 }} />
                    <span>Quotations are dispatched to your client dashboard inbox within 12 hours.</span>
                  </li>
                </ul>
              </div>

              <div className="timeline-card" style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h4 style={{ margin: "0 0 16px", fontWeight: "700", fontSize: "14px", color: "#1e293b" }}>What happens next?</h4>
                <div className="timeline-vertical" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div className="timeline-item" style={{ display: "flex", gap: "12px" }}>
                    <div className="timeline-icon" style={{ background: "#e0f2fe", color: "#0ea5e9", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><ClipboardList size={14} /></div>
                    <div className="timeline-content">
                      <h5 style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: "600", color: "#334155" }}>Request Submitted</h5>
                      <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>We log your exact theme preferences.</p>
                    </div>
                  </div>
                  <div className="timeline-item" style={{ display: "flex", gap: "12px" }}>
                    <div className="timeline-icon" style={{ background: "#e0f2fe", color: "#0ea5e9", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Search size={14} /></div>
                    <div className="timeline-content">
                      <h5 style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: "600", color: "#334155" }}>Expert Review</h5>
                      <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>Our decoration heads assess material costs and labor.</p>
                    </div>
                  </div>
                  <div className="timeline-item" style={{ display: "flex", gap: "12px" }}>
                    <div className="timeline-icon" style={{ background: "#e0f2fe", color: "#0ea5e9", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Check size={14} /></div>
                    <div className="timeline-content">
                      <h5 style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: "600", color: "#334155" }}>Pricing Issued</h5>
                      <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>A custom quotation gets attached to your booking wizard.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="assistance-box" style={{ background: "linear-gradient(to right, #1e293b, #334155)", color: "white", padding: "20px", borderRadius: "12px", display: "flex", gap: "16px", alignItems: "center" }}>
                <HeadphonesIcon size={24} className="assistance-icon" style={{ color: "#38bdf8" }} />
                <div>
                  <h5 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: "600" }}>Want to talk to a designer?</h5>
                  <p style={{ margin: 0, fontSize: "12px", color: "#cbd5e1" }}>Call us at <span className="text-blue" style={{ color: "#38bdf8", fontWeight: "500" }}>+91 98765 43210</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDecorationRequest;
