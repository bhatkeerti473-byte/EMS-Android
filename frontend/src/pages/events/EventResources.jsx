import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import eventAPI from "../../services/eventApi";
import { ArrowLeft, ArrowRight, Plus, Trash2, Users, Package, CheckSquare, Square } from "lucide-react";

function EventResources() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Track multiple selected categories via checkboxes
  const [selectedTypes, setSelectedTypes] = useState(["Staff"]);

  const [newResource, setNewResource] = useState({
    name: "",
    description: "",
    quantity: 1,
    budget: 0, // Changed from cost to budget
    notes: "",
  });

  const resourceOptions = ["Staff", "Vendor", "Catering", "Venue", "Decor", "Sound & Lighting", "Other"];

  const fetchEventDetails = useCallback(async () => {
    try {
      const response = await eventAPI.getEventDetails(eventId);
      setEvent(response.data.event);
      setResources(response.data.resources || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch event details");
    }
  }, [eventId]);

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId, fetchEventDetails]);

  const toggleTypeCheckbox = (type) => {
    if (selectedTypes.includes(type)) {
      // Keep at least one selected
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter((t) => t !== type));
      }
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleAddResource = async () => {
    if (!newResource.name.trim()) {
      setError("Please enter resource details or reference name");
      return;
    }

    setLoading(true);
    try {
      // Loop through all checked resource types and save them
      const savePromises = selectedTypes.map((type) =>
        eventAPI.addEventResource({
          eventId,
          resourceType: type,
          name: newResource.name,
          description: newResource.description,
          quantity: newResource.quantity,
          cost: newResource.budget, // Keep API field contract uniform as 'cost' or update backend
          notes: newResource.notes,
        })
      );

      await Promise.all(savePromises);

      // Construct unique visual instances for the UI state list split by type
      const newEntries = selectedTypes.map((type, idx) => ({
        _id: Date.now() + idx,
        resourceType: type,
        name: newResource.name,
        description: newResource.description,
        quantity: newResource.quantity,
        cost: newResource.budget,
        notes: newResource.notes,
        status: "Available",
      }));

      setResources([...resources, ...newEntries]);

      // Reset Form fields
      setNewResource({
        name: "",
        description: "",
        quantity: 1,
        budget: 0,
        notes: "",
      });
      setSelectedTypes(["Staff"]); // Reset back to default initial checkbox selection
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add resources");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    try {
      await eventAPI.deleteEventResource(resourceId);
      setResources(resources.filter((r) => r._id !== resourceId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete resource");
    }
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      await eventAPI.updateEvent(eventId, { status: "Scheduled" });
      navigate(`/user/event-dashboard/${eventId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update event status");
    } finally {
      setLoading(false);
    }
  };

  // Compute Indian formatted Currency tracking 
  const totalBudget = resources.reduce((sum, r) => sum + (r.cost || 0), 0);

  const formatIndianCurrency = (num) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(num);
  };

  if (!event) {
    return (
      <div className="flex-1 min-h-screen bg-gray-100 flex items-center justify-center text-gray-600 font-medium">
        Loading event details...
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-100">
      {/* Top Bar Layout Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <span className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </span>
            Assign Resources & Allocations
          </h2>
          <p className="text-gray-600 text-sm mt-0.5">
            Allocate staff, catering, setups, and budget details for <span className="font-semibold text-gray-800">{event.title}</span>
          </p>
        </div>
      </div>

      <div className="p-8">
        {/* Error Notification Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Add Resource Form Box Layout */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                Resource Setup Form
              </h3>

              <div className="space-y-4">
                {/* Checkbox Section for Types */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Select Resource Categories * (Select Multiple)
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                    {resourceOptions.map((type) => {
                      const isChecked = selectedTypes.includes(type);
                      return (
                        <div
                          key={type}
                          onClick={() => toggleTypeCheckbox(type)}
                          className="flex items-center gap-2.5 cursor-pointer py-1 text-gray-700 hover:text-indigo-600 transition select-none"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-sm font-medium">{type}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1.5">Name / Vendor Info *</label>
                  <input
                    type="text"
                    value={newResource.name}
                    onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                    placeholder="e.g., Sharma Catering, Core Management Team"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1.5">Description</label>
                  <textarea
                    value={newResource.description}
                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                    placeholder="Provide specific details about roles or inclusions..."
                    rows="2"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1.5">Quantity / Units</label>
                    <input
                      type="number"
                      value={newResource.quantity}
                      onChange={(e) =>
                        setNewResource({
                          ...newResource,
                          quantity: parseInt(e.target.value) || 1,
                        })
                      }
                      min="1"
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1.5">Estimated Budget (₹)</label>
                    <input
                      type="number"
                      value={newResource.budget}
                      onChange={(e) =>
                        setNewResource({
                          ...newResource,
                          budget: parseFloat(e.target.value) || 0,
                        })
                      }
                      min="0"
                      placeholder="INR"
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1.5">Special Instructions / Notes</label>
                  <textarea
                    value={newResource.notes}
                    onChange={(e) => setNewResource({ ...newResource, notes: e.target.value })}
                    placeholder="Advance details, payment timelines, milestones..."
                    rows="2"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <button
                  onClick={handleAddResource}
                  disabled={loading}
                  className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 shadow-sm text-sm"
                >
                  {loading ? "Adding Items..." : `Add Selected (${selectedTypes.length})`}
                </button>
              </div>
            </div>
          </div>

          {/* Resources Right Column Canvas */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600" />
                Assigned Resources & Vendors ({resources.length})
              </h3>

              {resources.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No resource allocations mapped yet</p>
                  <p className="text-sm text-gray-400 mt-1">Check appropriate categories and fill out the setup details on the left.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {resources.map((resource) => (
                    <div
                      key={resource._id}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h4 className="text-gray-800 font-bold">{resource.name}</h4>
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded border border-indigo-100">
                            {resource.resourceType}
                          </span>
                        </div>
                        {resource.description && (
                          <p className="text-gray-600 text-sm mb-2">{resource.description}</p>
                        )}
                        <div className="flex gap-4 text-xs font-semibold text-gray-500 items-center">
                          <span>Qty: {resource.quantity}</span>
                          <span className="text-gray-700">Budget Allocation: {formatIndianCurrency(resource.cost)}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${resource.status === "Available"
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                              }`}
                          >
                            {resource.status}
                          </span>
                        </div>
                        {resource.notes && (
                          <p className="text-gray-400 text-xs mt-2 italic bg-white p-2 rounded border border-gray-100">
                            Notes: {resource.notes}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteResource(resource._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Indian Cost Summary Box Component */}
            {resources.length > 0 && (
              <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-lg flex justify-between items-center">
                <div>
                  <h4 className="text-gray-800 font-bold">Total Allocation Budget</h4>
                  <p className="text-gray-500 text-xs mt-1">
                    Calculated automatically in Indian Rupees (INR) across all active allocations.
                  </p>
                </div>
                <span className="text-2xl font-black text-indigo-600">{formatIndianCurrency(totalBudget)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Step Controls Navigation Row */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-8">
          <button
            onClick={() => navigate(`/user/event-details/${eventId}`)}
            className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={handleContinue}
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2 text-sm shadow-sm"
          >
            {loading ? "Processing..." : "Complete Setup & View Dashboard"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventResources;
