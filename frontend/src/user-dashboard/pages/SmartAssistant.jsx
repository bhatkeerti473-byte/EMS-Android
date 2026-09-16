import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../styles/components/Sidebar';
import Topbar from '../styles/components/Topbar';
import { Send, Bot, User, MapPin, Users, Calendar, PlusCircle, CheckCircle, ArrowRight, AlertTriangle, List, Check, Star, MessageSquare, Eye, X, Info, Sparkles, ShieldCheck } from 'lucide-react';
import { getClientDisplayName, getCurrentClient, getClientPhoto } from '../services/clientSession';

const SmartAssistant = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { 
            sender: 'assistant', 
            text: "Hi! I'm your Smart Event Assistant. I can help you plan your event step-by-step.\n\nExample: 'Plan a birthday on 14 February for 100 guests within ₹2 lakh.'" 
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [context, setContext] = useState({});
    const [selectedItemForDetails, setSelectedItemForDetails] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (textOverride) => {
        const textToSubmit = textOverride || input;
        if (!textToSubmit.trim()) return;

        // Add user message
        const newMessages = [...messages, { sender: 'user', text: textToSubmit }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/assistant/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: textToSubmit, context })
            });

            const data = await res.json();
            
            if (data.success) {
                setContext(data.context);
                
                const assistantMsg = { 
                    sender: 'assistant', 
                    text: data.reply,
                    recommendations: data.recommendations,
                    options: data.options
                };
                
                setMessages(prev => [...prev, assistantMsg]);
            } else {
                setMessages(prev => [...prev, { sender: 'assistant', text: "Sorry, I'm having trouble processing that right now." }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { sender: 'assistant', text: "Network error connecting to the assistant." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleActionClick = (actionStr, textLabel) => {
        handleSend(actionStr.startsWith("select_") ? actionStr : textLabel);
    };

    const handleConfirmAndBook = () => {
        // Pre-fill localStorage
        localStorage.setItem("booking_event_type", context.eventType || "Event");
        localStorage.setItem("booking_event_type_title", context.eventType || "Event");
        localStorage.setItem("booking_custom_title", context.eventType ? `My ${context.eventType} Event` : "Custom Event");
        if(context.dateStr) localStorage.setItem("booking_event_date", context.dateStr);
        if(context.guests) localStorage.setItem("booking_guest_count", context.guests);
        if(context.budget) localStorage.setItem("booking_budget", context.budget);
        
        localStorage.setItem("booking_time_slot", "Flexible");

        if (context.selectedServices?.venue) {
            localStorage.setItem("booking_venue_id", context.selectedServices.venue.id);
            localStorage.setItem("booking_venue_name", context.selectedServices.venue.name);
            localStorage.setItem("booking_venue_price", context.selectedServices.venue.price);
        } else {
            localStorage.setItem("booking_venue_price", 0);
        }
        
        if (context.selectedServices?.catering) {
            localStorage.setItem("booking_catering_combo_name", context.selectedServices.catering.name);
            localStorage.setItem("booking_catering_price_per_plate", context.selectedServices.catering.price / (context.guests || 1));
            localStorage.setItem("booking_food_type", context.foodType || "veg");
        } else {
            localStorage.setItem("booking_catering_price_per_plate", 0);
        }
        
        if (context.selectedServices?.decoration) {
            localStorage.setItem("booking_decoration_package", context.selectedServices.decoration.name);
            localStorage.setItem("booking_decoration_total", context.selectedServices.decoration.price);
        } else {
            localStorage.setItem("booking_decoration_total", 0);
        }
        
        if (context.selectedServices?.cake) {
            localStorage.setItem("booking_cake_name", context.selectedServices.cake.name);
            localStorage.setItem("booking_cake_price", context.selectedServices.cake.price);
        } else {
            localStorage.setItem("booking_cake_price", 0);
        }
        
        if (context.selectedServices?.photography) {
            localStorage.setItem("booking_photography_price", context.selectedServices.photography.price);
            localStorage.setItem("booking_photography_name", context.selectedServices.photography.name);
        } else {
            localStorage.setItem("booking_photography_price", 0);
        }
        
        if (context.selectedServices?.dj) {
            localStorage.setItem("booking_dj_price", context.selectedServices.dj.price);
            localStorage.setItem("booking_dj_name", context.selectedServices.dj.name);
        } else {
            localStorage.setItem("booking_dj_price", 0);
        }

        const additionalServices = {};
        if (context.selectedServices?.photography) additionalServices.photography = true;
        if (context.selectedServices?.dj) additionalServices.dj = true;
        localStorage.setItem("booking_additional_services", JSON.stringify(additionalServices));

        navigate("/client/summary");
    };

    const handleSaveToWishlist = () => {
        try {
            const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
            const newEvent = {
                id: Date.now(),
                title: `${context.eventType || 'Event'} Plan`,
                category: context.eventType || 'Custom',
                location: context.selectedServices?.venue?.name || 'Selected Venue',
                status: 'Upcoming',
                price: context.totalCost || 0,
                date: context.dateStr || 'TBD',
                image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=700&q=80"
            };
            wishlist.push(newEvent);
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            alert("Event Plan saved to Wishlist!");
        } catch(e) {
            console.error("Error saving wishlist", e);
        }
    };

    const quickActions = [
        "Plan a birthday",
        "Make my plan cheaper",
        "Change venue",
        "Remove DJ",
        "Remove Cake"
    ];

    const formatCurrency = (val) => val ? `₹${val.toLocaleString()}` : '₹0';

    const subTotal = context.totalCost || 0;
    const gst = Math.round(subTotal * 0.18);
    const serviceCharge = Math.round(subTotal * 0.05);
    const finalTotal = subTotal + gst + serviceCharge;

    const isOverBudget = context.budget && finalTotal > context.budget;

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Topbar title="Smart Event Assistant" />
                
                <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 md:p-6 overflow-hidden gap-4">
                    
                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        
                        {/* Budget Warning Banner */}
                        {isOverBudget && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 text-sm">
                                <AlertTriangle size={20} className="shrink-0" />
                                <div>
                                    <strong className="block">Budget Warning</strong>
                                    Your selected services currently exceed your budget by {formatCurrency(finalTotal - context.budget)}.
                                </div>
                                <div className="ml-auto flex gap-2">
                                    <button onClick={() => handleSend("Make my plan cheaper")} className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded font-medium text-xs">Show Cheaper Options</button>
                                </div>
                            </div>
                        )}

                        {/* Chat Window */}
                        <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex flex-col gap-4">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.sender === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                            <Bot size={18} className="text-blue-600" />
                                        </div>
                                    )}
                                    
                                    <div className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                                            <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                                        </div>

                                        {/* Options (Buttons) */}
                                        {msg.options && msg.options.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {msg.options.map((opt, i) => {
                                                    if (opt === "Confirm & Book") {
                                                        return <button key={i} onClick={handleConfirmAndBook} className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 shadow-sm">{opt}</button>
                                                    }
                                                    if (opt === "Save to Wishlist") {
                                                        return <button key={i} onClick={handleSaveToWishlist} className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 shadow-sm">{opt}</button>
                                                    }
                                                    return (
                                                        <button 
                                                            key={i} 
                                                            onClick={() => handleActionClick(opt.toLowerCase(), opt)}
                                                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 shadow-sm transition-colors">
                                                            {opt}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        )}

                                        {/* Recommendations Cards */}
                                        {msg.recommendations && msg.recommendations.length > 0 && (
                                            <div className="mt-3 flex gap-3 overflow-x-auto pb-2 max-w-full">
                                                {msg.recommendations.map((rec, i) => (
                                                    <div key={i} className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
                                                        <div className="cursor-pointer" onClick={() => setSelectedItemForDetails(rec)}>
                                                            {rec.image && (
                                                                <div className="h-32 w-full overflow-hidden relative">
                                                                    <img src={rec.image} alt={rec.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">
                                                                        {rec.category || rec.type}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div className="p-3">
                                                                <h4 className="font-bold text-sm text-gray-900 truncate group-hover:text-orange-600 transition-colors">{rec.name}</h4>
                                                                {rec.location && <div className="flex items-center text-xs text-gray-500 mt-1"><MapPin size={12} className="mr-1 text-orange-500"/> {rec.location}</div>}
                                                                {rec.desc && <div className="text-xs text-gray-600 mt-1 line-clamp-2">{rec.desc}</div>}
                                                                
                                                                <div className="flex gap-2 mt-2 flex-wrap">
                                                                    {rec.rating && <div className="flex items-center text-xs bg-yellow-50 px-1.5 py-0.5 rounded text-yellow-700 font-medium"><Star size={12} className="mr-1 fill-yellow-400 text-yellow-400"/> {rec.rating} / 5 ({rec.reviewCount})</div>}
                                                                    {rec.capacity && <div className="flex items-center text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600"><Users size={12} className="mr-1"/> {rec.capacity}</div>}
                                                                    {rec.availability && <div className="flex items-center text-xs bg-green-50 px-1.5 py-0.5 rounded text-green-700"><CheckCircle size={12} className="mr-1"/> {rec.availability}</div>}
                                                                </div>

                                                                {rec.clientFeedback && rec.clientFeedback.length > 0 && (
                                                                    <div className="mt-2 pt-2 border-t border-gray-100">
                                                                        <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Client Feedback</div>
                                                                        <div className="text-xs text-gray-600 italic bg-gray-50 p-2 rounded border border-gray-100 truncate">
                                                                            "{rec.clientFeedback[0].comment}"
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="p-3 pt-0 mt-auto">
                                                            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-end mb-2">
                                                                <div className="text-xs text-gray-500">Price</div>
                                                                <div className="font-bold text-orange-600">₹{rec.price?.toLocaleString()}</div>
                                                            </div>
                                                            
                                                            <div className="flex gap-2">
                                                                <button 
                                                                    onClick={() => setSelectedItemForDetails(rec)}
                                                                    className="flex-1 text-xs py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer">
                                                                    <Eye size={12}/> Details
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleActionClick(rec.action, rec.name)}
                                                                    className="flex-1 text-xs py-2 bg-orange-600 text-white rounded-md font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                                                                    Select <ArrowRight size={12}/>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {msg.sender === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-1">
                                            <User size={18} className="text-orange-600" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3 justify-start">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                                        <Bot size={18} className="text-blue-600" />
                                    </div>
                                    <div className="p-3 rounded-2xl bg-gray-100 text-gray-800 rounded-tl-none flex gap-1 items-center">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar shrink-0">
                            {quickActions.map((action, i) => (
                                <button 
                                    key={i}
                                    onClick={() => handleSend(action)}
                                    className="whitespace-nowrap px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors flex items-center gap-1"
                                >
                                    <PlusCircle size={12}/>
                                    {action}
                                </button>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex gap-2 shrink-0">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type here..."
                                className="flex-1 bg-transparent border-none outline-none px-3 text-sm"
                            />
                            <button 
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isLoading}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${!input.trim() || isLoading ? 'bg-gray-100 text-gray-400' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Sidebar / Live Plan Summary */}
                    {Object.keys(context).length > 0 && (
                        <div className="hidden md:flex w-80 flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-orange-50 p-4 border-b border-orange-100">
                                <h3 className="font-bold text-orange-800 flex items-center gap-2">
                                    <List size={18} />
                                    Your Event Plan
                                </h3>
                            </div>
                            
                            <div className="p-4 flex-1 overflow-y-auto">
                                <div className="space-y-4">
                                    {/* Core Details */}
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Details</h4>
                                        <div className="text-sm text-gray-800 space-y-1">
                                            {context.eventType && <div><span className="text-gray-500">Event:</span> {context.eventType}</div>}
                                            {context.dateStr && <div><span className="text-gray-500">Date:</span> {context.dateStr}</div>}
                                            {context.guests && <div><span className="text-gray-500">Guests:</span> {context.guests}</div>}
                                            {context.budget && <div><span className="text-gray-500">Budget:</span> {formatCurrency(context.budget)}</div>}
                                        </div>
                                    </div>

                                    {/* Selected Services */}
                                    {context.selectedServices && Object.keys(context.selectedServices).length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Selected Services</h4>
                                            <div className="space-y-2">
                                                {Object.entries(context.selectedServices).map(([key, service]) => (
                                                    <div key={key} className="flex justify-between items-start text-sm">
                                                        <div className="flex items-start gap-1">
                                                            <Check size={14} className="text-green-500 mt-0.5" />
                                                            <span className="text-gray-800 capitalize">{key}: <span className="text-gray-600">{service.name}</span></span>
                                                        </div>
                                                        <div className="font-medium text-gray-900">{formatCurrency(service.price)}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Cost Breakdown Footer */}
                            <div className="p-4 bg-gray-50 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-1 text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium text-gray-800">{formatCurrency(subTotal)}</span>
                                </div>
                                <div className="flex justify-between items-center mb-1 text-xs">
                                    <span className="text-gray-400">Taxes & Fees (23%)</span>
                                    <span className="text-gray-500">{formatCurrency(gst + serviceCharge)}</span>
                                </div>
                                <div className="flex justify-between items-center mb-1 text-sm mt-2 border-t border-gray-200 pt-2">
                                    <span className="text-gray-600 font-bold">Estimated Total</span>
                                    <span className={`font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>{formatCurrency(finalTotal)}</span>
                                </div>
                                {context.budget && (
                                    <div className="flex justify-between items-center text-xs mt-1">
                                        <span className="text-gray-500">Remaining</span>
                                        <span className={isOverBudget ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
                                            {isOverBudget ? `Over by ${formatCurrency(finalTotal - context.budget)}` : formatCurrency(context.budget - finalTotal)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Details Modal View */}
            {selectedItemForDetails && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
                    <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
                        
                        {/* Hero Image & Header */}
                        <div className="relative h-56 md:h-64 bg-gray-900 overflow-hidden shrink-0">
                            <img 
                                src={selectedItemForDetails.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3"} 
                                alt={selectedItemForDetails.name}
                                className="w-full h-full object-cover opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-between p-6">
                                <div className="flex justify-between items-center">
                                    <span className="px-3 py-1 bg-orange-500/90 backdrop-blur-md text-white text-xs font-semibold rounded-full uppercase tracking-wider">
                                        {selectedItemForDetails.category || selectedItemForDetails.type || "Service Details"}
                                    </span>
                                    <button 
                                        onClick={() => setSelectedItemForDetails(null)}
                                        className="w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div>
                                    <h2 className="text-2xl md:text-3xl font-extrabold text-white">{selectedItemForDetails.name}</h2>
                                    {selectedItemForDetails.location && (
                                        <p className="text-gray-200 text-sm flex items-center mt-1">
                                            <MapPin size={14} className="mr-1 text-orange-400" /> {selectedItemForDetails.location}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            
                            {/* Badges & Price Bar */}
                            <div className="flex flex-wrap gap-3 items-center justify-between p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                                <div className="flex gap-2.5 flex-wrap">
                                    {selectedItemForDetails.rating && (
                                        <div className="flex items-center text-sm bg-yellow-100 text-yellow-800 font-semibold px-2.5 py-1 rounded-lg">
                                            <Star size={16} className="mr-1 fill-yellow-500 text-yellow-500" /> {selectedItemForDetails.rating} / 5 ({selectedItemForDetails.reviewCount || 0} reviews)
                                        </div>
                                    )}
                                    {selectedItemForDetails.capacity && (
                                        <div className="flex items-center text-sm bg-blue-50 text-blue-700 font-medium px-2.5 py-1 rounded-lg">
                                            <Users size={16} className="mr-1" /> Capacity: {selectedItemForDetails.capacity} Guests
                                        </div>
                                    )}
                                    {selectedItemForDetails.availability && (
                                        <div className="flex items-center text-sm bg-green-50 text-green-700 font-medium px-2.5 py-1 rounded-lg">
                                            <CheckCircle size={16} className="mr-1 text-green-600" /> {selectedItemForDetails.availability}
                                        </div>
                                    )}
                                </div>

                                <div className="text-right">
                                    <span className="text-xs text-gray-500 block uppercase font-medium">Total Price</span>
                                    <span className="text-2xl font-black text-orange-600">₹{selectedItemForDetails.price?.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                    <Sparkles size={16} className="text-orange-500" />
                                    Description & Overview
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {selectedItemForDetails.description || selectedItemForDetails.desc || "Experience premium service tailored specifically to your event specifications with guaranteed high quality and professional execution."}
                                </p>
                            </div>

                            {/* What's Included / Key Features */}
                            {((selectedItemForDetails.features && selectedItemForDetails.features.length > 0) || 
                              (selectedItemForDetails.facilities && selectedItemForDetails.facilities.length > 0)) && (
                                <div>
                                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                        <CheckCircle size={16} className="text-green-500" />
                                        What's Included & Key Amenities
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {(selectedItemForDetails.features || selectedItemForDetails.facilities || []).map((feat, idx) => (
                                            <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-700 font-medium">
                                                <Check size={14} className="text-green-600 shrink-0" />
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Client Reviews */}
                            {selectedItemForDetails.clientFeedback && selectedItemForDetails.clientFeedback.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Verified Client Reviews</h3>
                                    <div className="space-y-2">
                                        {selectedItemForDetails.clientFeedback.map((fb, idx) => (
                                            <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                                                <div className="flex items-center gap-1 text-yellow-600 font-bold mb-1">
                                                    <Star size={12} className="fill-yellow-400 text-yellow-400" /> {fb.rating} / 5
                                                </div>
                                                <p className="text-gray-600 italic">"{fb.comment}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Footer & Action */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
                            <div>
                                <span className="text-xs text-gray-500">Selected Option</span>
                                <h4 className="font-bold text-sm text-gray-800">{selectedItemForDetails.name}</h4>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setSelectedItemForDetails(null)}
                                    className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-200 bg-gray-100 rounded-xl transition-colors cursor-pointer"
                                >
                                    Close
                                </button>
                                <button 
                                    onClick={() => {
                                        const act = selectedItemForDetails.action;
                                        const name = selectedItemForDetails.name;
                                        setSelectedItemForDetails(null);
                                        handleActionClick(act, name);
                                    }}
                                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                                >
                                    <CheckCircle size={16} />
                                    Select & Add to Plan
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default SmartAssistant;
