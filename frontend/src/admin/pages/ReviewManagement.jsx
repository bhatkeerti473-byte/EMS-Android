import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Ticket, User, Clock, CheckCircle } from "lucide-react";

const API_BASE_URL = "http://localhost:5000";

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchReviews();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/admin`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Failed to fetch reviews");
      
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error(error);
      setMessage({ text: "Failed to load reviews.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (reviewId) => {
    if (!replyText.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/admin/respond/${reviewId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({ comment: replyText })
      });

      if (!response.ok) throw new Error("Failed to submit reply");

      setMessage({ text: "Reply posted successfully!", type: "success" });
      setReplyingTo(null);
      setReplyText("");
      fetchReviews(); // Refresh the list
    } catch (error) {
      console.error(error);
      setMessage({ text: "Failed to post reply.", type: "error" });
    }
  };

  const renderStars = (value) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(num => (
          <Star 
            key={num} 
            size={16} 
            className={`${num <= value ? "fill-orange-400 text-orange-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="admin-dashboard-container flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Client Reviews & Feedback</h1>
          </div>

          {message.text && (
            <div className={`p-4 rounded-lg mb-6 ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {message.text}
            </div>
          )}

          {loading ? (
            <div className="p-8 text-center text-gray-500 bg-white rounded-xl">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl shadow-sm">
              <MessageSquare className="mx-auto text-gray-300 mb-3" size={32} />
              <p className="text-gray-500">No client reviews found.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(review.rating)}
                        <span className="font-bold text-gray-800 ml-2">{review.rating} / 5</span>
                        {review.recommend && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold ml-2">Recommended</span>}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span className="flex items-center gap-1"><User size={14}/> {review.client?.name || "Client"}</span>
                        <span className="flex items-center gap-1"><Ticket size={14}/> {review.booking?.title || "Booking"}</span>
                        <span className="flex items-center gap-1"><Clock size={14}/> {new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 italic mb-4">"{review.comment}"</p>

                  {review.tags && review.tags.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {review.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{tag}</span>
                      ))}
                    </div>
                  )}

                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-3 mb-4">
                      {review.images.map((img, idx) => (
                        <img key={idx} src={img} alt="Client upload" className="w-20 h-20 rounded-lg object-cover border border-gray-200" />
                      ))}
                    </div>
                  )}

                  <hr className="my-4" />

                  {/* Admin Response Section */}
                  {review.adminResponse && review.adminResponse.comment ? (
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                      <div className="flex items-center gap-2 mb-2 text-orange-800 font-semibold text-sm uppercase">
                        <CheckCircle size={14} /> Admin Replied on {new Date(review.adminResponse.respondedAt).toLocaleDateString()}
                      </div>
                      <p className="text-sm text-gray-700">{review.adminResponse.comment}</p>
                    </div>
                  ) : (
                    <div>
                      {replyingTo === review._id ? (
                        <div className="mt-2">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your response to the client..."
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 mb-2"
                            rows="3"
                          ></textarea>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleReplySubmit(review._id)}
                              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600"
                            >
                              Post Reply
                            </button>
                            <button 
                              onClick={() => { setReplyingTo(null); setReplyText(""); }}
                              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setReplyingTo(review._id)}
                          className="text-orange-500 text-sm font-semibold hover:text-orange-600 flex items-center gap-1"
                        >
                          <MessageSquare size={14} /> Reply to this review
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ReviewManagement;
