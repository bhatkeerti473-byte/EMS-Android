import React from "react";
import { Check, ArrowLeft, ArrowRight, Home, MapPin, Search, AlertCircle, Calendar, Sparkles, ShieldCheck, HeartHandshake, Smile } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import "../styles/premium-dashboard.css";

const HomeFunction = () => {
  const navigate = useNavigate();

  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar title="Client Overview" />

        <div className="premium-content-scroll" style={{ backgroundColor: "#ffffff" }}>
          <div className="page-header" style={{ padding: "20px 32px 0" }}>
            <h2 style={{ color: "#0f172a", fontSize: "24px", marginBottom: "4px" }}>Function at Home</h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "0" }}>Enter your home details to help us serve you better</p>
          </div>

          <div className="stepper-wrapper">
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
              <div className="step-circle active">3</div>
              <div className="step-label active">Select Venue</div>
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


          <div className="home-function-container" style={{ padding: "0 32px 32px" }}>
            
            {/* Green Alert Banner */}
            <div className="alert-banner green-alert">
              <div className="alert-icon-bg"><Home size={20} className="text-green-700" /></div>
              <div className="alert-content">
                <h4>You have selected Function at Home</h4>
                <p>No venue booking is required. Please provide your home details and requirements.</p>
              </div>
            </div>

            <div className="form-layout-columns">
              {/* Left Column */}
              <div className="left-column">
                
                {/* Home Details Card */}
                <div className="form-card">
                  <div className="card-header-icon">
                    <div className="header-icon-orange"><Home size={18} /></div>
                    <div>
                      <h3>Home Details</h3>
                      <p>Please provide accurate details of your home location and space.</p>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name <span className="text-red">*</span></label>
                      <div className="input-with-icon">
                        <Search className="input-icon" size={16} />
                        <input type="text" placeholder="Enter full name" className="premium-input pl-10" />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Mobile Number <span className="text-red">*</span></label>
                      <div className="input-with-icon">
                        <Search className="input-icon" size={16} />
                        <input type="text" placeholder="Enter mobile number" className="premium-input pl-10" />
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label>Complete Address <span className="text-red">*</span></label>
                      <textarea 
                        placeholder="House/Flat No., Street, Area, Landmark&#10;&#10;City, State, Pincode" 
                        className="premium-textarea"
                        style={{ height: "100px" }}
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label>City <span className="text-red">*</span></label>
                      <input type="text" placeholder="Enter city" className="premium-input" />
                    </div>

                    <div className="form-group">
                      <label>Pincode <span className="text-red">*</span></label>
                      <div className="input-with-icon right">
                        <input type="text" placeholder="Enter pincode" className="premium-input pr-10" />
                        <MapPin className="input-icon-right" size={16} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>State <span className="text-red">*</span></label>
                      <select className="premium-select">
                        <option value="">Select state</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Event Area / Space Details Card */}
                <div className="form-card mt-20">
                  <div className="card-header-text">
                    <h3>Event Area / Space Details</h3>
                    <p>Tell us about the area where the function will be held.</p>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Available Area (Approx.) <span className="text-red">*</span></label>
                      <div className="input-with-icon right">
                        <input type="text" placeholder="e.g. 1500 sq.ft" className="premium-input pr-10" />
                        <Calendar className="input-icon-right" size={16} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Area Type</label>
                      <div className="radio-group row">
                        <label className="radio-label">
                          <input type="radio" name="areaType" defaultChecked />
                          <span className="radio-custom"></span> Indoor
                        </label>
                        <label className="radio-label">
                          <input type="radio" name="areaType" />
                          <span className="radio-custom"></span> Outdoor
                        </label>
                        <label className="radio-label">
                          <input type="radio" name="areaType" />
                          <span className="radio-custom"></span> Indoor + Outdoor
                        </label>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Accommodation Available</label>
                      <div className="radio-group row">
                        <label className="radio-label">
                          <input type="radio" name="accommodation" defaultChecked />
                          <span className="radio-custom"></span> Yes
                        </label>
                        <label className="radio-label">
                          <input type="radio" name="accommodation" />
                          <span className="radio-custom"></span> No
                        </label>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Parking Space Available</label>
                      <div className="radio-group row">
                        <label className="radio-label">
                          <input type="radio" name="parking" defaultChecked />
                          <span className="radio-custom"></span> Yes
                        </label>
                        <label className="radio-label">
                          <input type="radio" name="parking" />
                          <span className="radio-custom"></span> No
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Yellow Alert Banner */}
                  <div className="alert-banner yellow-alert mt-20">
                    <div className="alert-icon-yellow"><AlertCircle size={20} /></div>
                    <div className="alert-content">
                      <h4>Important Note</h4>
                      <p>Please ensure the area is safe and suitable for your event. Our team may visit the location for verification if required.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="right-column">
                
                {/* Requirements & Preferences Card */}
                <div className="form-card">
                  <div className="card-header-icon">
                    <div className="header-icon-orange"><Search size={18} /></div>
                    <div>
                      <h3>Requirements & Preferences</h3>
                      <p>Help us understand your needs better.</p>
                    </div>
                  </div>

                  <div className="form-group mt-16">
                    <label>Additional Requirements (Optional)</label>
                    <textarea 
                      placeholder="Let us know about any specific requirements, setup needs, electricity, water, etc.&#10;&#10;&#10;e.g. Power backup, separate dining area, decoration space, etc." 
                      className="premium-textarea"
                      style={{ height: "120px" }}
                    ></textarea>
                  </div>

                  <div className="feature-grid mt-20">
                    <div className="feature-box">
                      <div className="feature-icon bg-orange-light text-orange"><Home size={18} /></div>
                      <div className="feature-text">
                        <strong>No Venue Cost</strong>
                        <span>Save on venue booking</span>
                      </div>
                    </div>
                    <div className="feature-box">
                      <div className="feature-icon bg-orange-light text-orange"><Sparkles size={18} /></div>
                      <div className="feature-text">
                        <strong>Personalized Setup</strong>
                        <span>Customized for your home</span>
                      </div>
                    </div>
                    <div className="feature-box">
                      <div className="feature-icon bg-green-light text-green"><ShieldCheck size={18} /></div>
                      <div className="feature-text">
                        <strong>Complete Support</strong>
                        <span>End-to-end assistance</span>
                      </div>
                    </div>
                    <div className="feature-box">
                      <div className="feature-icon bg-green-light text-green"><HeartHandshake size={18} /></div>
                      <div className="feature-text">
                        <strong>Hassle Free</strong>
                        <span>We handle the rest</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selection Summary Card */}
                <div className="summary-card mt-20">
                  <div className="summary-header">
                    <div className="summary-icon"><Smile size={18} /></div>
                    <h3>Selection Summary</h3>
                  </div>
                  
                  <div className="summary-details">
                    <div className="summary-row">
                      <div className="summary-label"><Search size={14} /> Event Type</div>
                      <div className="summary-value">Wedding</div>
                    </div>
                    <div className="summary-row">
                      <div className="summary-label"><Home size={14} /> Function Type</div>
                      <div className="summary-value">Function at Home</div>
                    </div>
                    <div className="summary-row">
                      <div className="summary-label"><MapPin size={14} /> Venue</div>
                      <div className="summary-value">Home Function</div>
                    </div>
                  </div>

                  <div className="summary-total">
                    <div className="total-label">Total Venue Cost</div>
                    <div className="total-value text-green-600">₹0</div>
                  </div>
                </div>
              </div>

            </div>

            <div className="bottom-navigation" style={{ marginTop: "40px" }}>
              <button className="btn-nav-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} /> Back
              </button>
              <button className="btn-nav-submit" style={{ maxWidth: '350px' }} onClick={() => navigate("/client/decoration")}>
                Continue to Decoration & Catering <ArrowRight size={18} style={{ marginLeft: "8px" }} />
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeFunction;
