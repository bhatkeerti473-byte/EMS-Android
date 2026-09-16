import React, { useState, useEffect } from "react";
import { MessageSquare, Send, Star, Ticket, Upload, X, ThumbsUp, ThumbsDown, CheckCircle } from "lucide-react";

import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import { getClientDisplayName, getCurrentClient } from "../services/clientSession";
import { getBookings, getClientReviews, submitReview, uploadReviewImages } from "../services/userApi";
import "../styles/dashboard.css";
import "../styles/premium-dashboard.css";

const Feedback = () => {
  const currentClient = getCurrentClient();
  const clientName = getClientDisplayName(currentClient);

  const [bookings, setBookings] = useState([]);
  const [eligibleBookings, setEligibleBookings] = useState([]);
  const [feedbackRecords, setFeedbackRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [formValues, setFormValues] = useState({
    bookingId: "",
    rating: 0,
    categoryRatings: { venue: 0, catering: 0, decoration: 0, staff: 0 },
    comment: "",
    tags: [],
    recommend: true,
  });
  
  const [images, setImages] = useState([]);

  const tagOptions = ["Decoration", "Catering", "Venue", "Staff", "Service", "Cleanliness", "Value"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userId = currentClient.id || currentClient._id || currentClient.userId;
      
      const [fetchedBookings, fetchedReviews] = await Promise.all([
        getBookings(userId).catch(() => []),
        getClientReviews().catch(() => ({ reviews: [] }))
      ]);

      const now = new Date();
      // Only approved/completed bookings that have passed
      const eligible = fetchedBookings.filter(b => {
        const isStatusValid = b.status === "Approved" || b.status === "Confirmed" || b.status === "Completed";
        const dateStr = b.date || b.eventDate || b.event_date;
        if (!dateStr) return false;
        const eventDate = new Date(dateStr);
        eventDate.setHours(23, 59, 59, 999);
        return isStatusValid && eventDate < now;
      });

      setBookings(fetchedBookings);
      setEligibleBookings(eligible);
      setFeedbackRecords(fetchedReviews.reviews || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryRating = (category, value) => {
    setFormValues(prev => ({
      ...prev,
      categoryRatings: { ...prev.categoryRatings, [category]: value }
    }));
  };

  const toggleTag = (tag) => {
    setFormValues(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag) 
        : [...prev.tags, tag]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: "Some images exceed 5MB limit and were skipped.", type: "error" });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formValues.bookingId) return setMessage({ text: "Please select a booking.", type: "error" });
    if (formValues.rating === 0) return setMessage({ text: "Please provide an overall rating.", type: "error" });
    if (!formValues.comment.trim()) return setMessage({ text: "Please write a comment.", type: "error" });

    setSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      let uploadedImageUrls = [];
      if (images.length > 0) {
        const uploadRes = await uploadReviewImages(images);
        uploadedImageUrls = uploadRes.imageUrls || [];
      }

      const reviewPayload = {
        bookingId: formValues.bookingId,
        rating: formValues.rating,
        categoryRatings: formValues.categoryRatings,
        comment: formValues.comment,
        tags: formValues.tags,
        recommend: formValues.recommend,
        images: uploadedImageUrls
      };

      await submitReview(reviewPayload);
      
      setMessage({ text: "Review submitted successfully!", type: "success" });
      setFormValues({
        bookingId: "", rating: 0, categoryRatings: { venue: 0, catering: 0, decoration: 0, staff: 0 },
        comment: "", tags: [], recommend: true
      });
      setImages([]);
      fetchData(); // Refresh history
      
    } catch (error) {
      setMessage({ text: error.message || "Failed to submit review.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (value, onClick) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(num => (
          <Star 
            key={num} 
            size={onClick ? 24 : 16} 
            className={`cursor-pointer transition-colors ${num <= value ? "fill-orange-400 text-orange-400" : "text-gray-300"}`}
            onClick={() => onClick && onClick(num)}
          />
        ))}
      </div>
    );
  };

  const getUnreviewedBookings = () => {
    const reviewedIds = feedbackRecords.map(r => r.booking?._id || r.booking);
    return eligibleBookings.filter(b => !reviewedIds.includes(b._id || b.id));
  };

  const unreviewedBookings = getUnreviewedBookings();

  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar />
        
        <div className="premium-content-scroll pb-16">
          <div className="welcome-banner mb-6">
            <div className="welcome-content">
              <h2>Feedback & Reviews 🌟</h2>
              <p>Share your experience and help us improve our services.</p>
            </div>
            
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-title">Total Reviews Given</div>
                <div className="kpi-value">{feedbackRecords.length}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-title">Pending Reviews</div>
                <div className="kpi-value text-orange-400">{unreviewedBookings.length}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 mx-8">
            {/* LEFT PANEL: Submit Form */}
            <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-4">Write a Review</h3>
              
              {message.text && (
                <div className={`p-4 rounded-lg mb-6 flex gap-2 items-center ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                  <MessageSquare size={16} /> {message.text}
                </div>
              )}

              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading your data...</div>
              ) : unreviewedBookings.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-100">
                  <CheckCircle className="mx-auto text-green-400 mb-2" size={32} />
                  <p className="text-gray-600">You have no eligible events waiting for a review.</p>
                  <p className="text-sm text-gray-400 mt-2">Events can be reviewed after they are completed.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Select Booking */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Event to Review</label>
                    <div className="relative">
                      <Ticket className="absolute left-3 top-3 text-gray-400" size={18} />
                      <select 
                        name="bookingId"
                        value={formValues.bookingId}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50"
                        required
                      >
                        <option value="" disabled>-- Select a completed event --</option>
                        {unreviewedBookings.map(b => (
                          <option key={b._id || b.id} value={b._id || b.id}>
                            {b.title || b.eventTitle} ({new Date(b.date || b.event_date).toLocaleDateString()})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Overall Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Overall Experience <span className="text-red-500">*</span></label>
                    {renderStars(formValues.rating, (val) => setFormValues(prev => ({...prev, rating: val})))}
                  </div>

                  {/* Category Ratings */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["venue", "catering", "decoration", "staff"].map(cat => (
                      <div key={cat} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 capitalize">{cat}</span>
                        {renderStars(formValues.categoryRatings[cat], (val) => handleCategoryRating(cat, val))}
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">What stood out?</label>
                    <div className="flex flex-wrap gap-2">
                      {tagOptions.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                            formValues.tags.includes(tag) 
                            ? "bg-orange-100 text-orange-600 border-orange-200" 
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recommend */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Would you recommend us?</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="recommend" checked={formValues.recommend === true} onChange={() => setFormValues(prev => ({...prev, recommend: true}))} />
                        <ThumbsUp size={16} className={formValues.recommend ? "text-green-500" : "text-gray-400"} /> Yes
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="recommend" checked={formValues.recommend === false} onChange={() => setFormValues(prev => ({...prev, recommend: false}))} />
                        <ThumbsDown size={16} className={!formValues.recommend ? "text-red-500" : "text-gray-400"} /> No
                      </label>
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Feedback <span className="text-red-500">*</span></label>
                    <textarea
                      name="comment"
                      value={formValues.comment}
                      onChange={handleInputChange}
                      placeholder="Tell us about your experience..."
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 min-h-[120px]"
                      required
                    ></textarea>
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Photos (Optional)</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                      <p className="text-sm text-gray-500">Click or drag images to upload</p>
                    </div>
                    
                    {images.length > 0 && (
                      <div className="flex gap-3 mt-4 flex-wrap">
                        {images.map((img, idx) => (
                          <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                            <img src={img} alt="preview" className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full btn-solid-orange py-3 rounded-lg flex items-center justify-center gap-2 text-white font-medium disabled:opacity-50"
                  >
                    {submitting ? "Submitting Review..." : <><Send size={18} /> Post Review</>}
                  </button>

                </form>
              )}
            </div>

            {/* RIGHT PANEL: History */}
            <div className="flex-1 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold mb-6">Your Review History</h3>
              
              <div className="space-y-6">
                {loading ? (
                  <p className="text-gray-500 text-center">Loading history...</p>
                ) : feedbackRecords.length === 0 ? (
                  <div className="text-center p-8 bg-white rounded-xl shadow-sm">
                    <Star className="mx-auto text-gray-300 mb-3" size={32} />
                    <p className="text-gray-500">No past reviews found.</p>
                  </div>
                ) : (
                  feedbackRecords.map((review) => (
                    <div key={review._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-800">{review.booking?.title || "Event"}</h4>
                          <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-4 leading-relaxed">"{review.comment}"</p>
                      
                      {review.tags && review.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {review.tags.map((tag, idx) => (
                            <span key={idx} className="text-[10px] uppercase tracking-wide bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{tag}</span>
                          ))}
                        </div>
                      )}

                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                          {review.images.map((img, idx) => (
                            <img key={idx} src={img} alt="review" className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0" />
                          ))}
                        </div>
                      )}

                      {review.adminResponse && review.adminResponse.comment && (
                        <div className="mt-4 bg-orange-50/50 p-4 rounded-lg border border-orange-100 relative">
                          <div className="absolute top-0 left-4 -mt-2 bg-orange-100 px-2 py-0.5 rounded text-[10px] text-orange-800 font-bold tracking-wider uppercase">Admin Reply</div>
                          <p className="text-sm text-gray-700 mt-2">{review.adminResponse.comment}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;