import React, { useState, useRef, useMemo } from "react";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize,
  MousePointer2,
  Trash2,
  Pencil,
  Eye,
} from "lucide-react";

// Mock Data for the Tools Sidebar
const TOOL_CATEGORIES = [
  {
    name: "Tables",
    items: [
      { id: "round_table", label: "Round Table", type: "table", seats: 10, isVip: false, color: "bg-blue-100 border-blue-300 text-blue-600", width: 60, height: 60, shape: "rounded-full" },
      { id: "rect_table", label: "Rectangle Table", type: "table", seats: 10, isVip: false, color: "bg-blue-100 border-blue-300 text-blue-600", width: 100, height: 40, shape: "rounded-md" },
      { id: "vip_table", label: "VIP Table", type: "table", seats: 10, isVip: true, color: "bg-purple-100 border-purple-300 text-purple-600", width: 120, height: 50, shape: "rounded-md" },
    ],
  },
  {
    name: "Seating",
    items: [
      { id: "chair", label: "Chair", type: "seat", seats: 1, isVip: false, color: "bg-emerald-100 border-emerald-300 text-emerald-600", width: 20, height: 20, shape: "rounded-md" },
      { id: "sofa", label: "Sofa", type: "seat", seats: 3, isVip: false, color: "bg-orange-100 border-orange-300 text-orange-600", width: 60, height: 30, shape: "rounded-md" },
      { id: "bench", label: "Bench", type: "seat", seats: 4, isVip: false, color: "bg-pink-100 border-pink-300 text-pink-600", width: 80, height: 20, shape: "rounded-md" },
    ],
  },
  {
    name: "Others",
    items: [
      { id: "stage", label: "Stage", type: "zone", seats: 0, isVip: false, color: "bg-amber-100 border-amber-300 text-amber-700", width: 240, height: 80, shape: "rounded-sm" },
      { id: "dance_floor", label: "Dance Floor", type: "zone", seats: 0, isVip: false, color: "bg-fuchsia-100 border-fuchsia-300 text-fuchsia-700 opacity-80", width: 160, height: 160, shape: "rounded-sm" },
      { id: "buffet", label: "Buffet", type: "zone", seats: 0, isVip: false, color: "bg-orange-100 border-orange-300 text-orange-700", width: 120, height: 40, shape: "rounded-sm" },
      { id: "entrance", label: "Entrance", type: "zone", seats: 0, isVip: false, color: "bg-white border-2 border-emerald-400 text-emerald-600", width: 100, height: 30, shape: "rounded-sm" },
      { id: "pillar", label: "Pillar", type: "zone", seats: 0, isVip: false, color: "bg-slate-700 border-slate-900 text-white", width: 30, height: 30, shape: "rounded-sm" },
      { id: "plants", label: "Plants", type: "zone", seats: 0, isVip: false, color: "bg-emerald-500 border-emerald-600 text-white", width: 20, height: 20, shape: "rounded-full" },
    ],
  },
];

const defaultInitialItems = [
  { id: "stage_1", label: "STAGE", type: "zone", seats: 0, isVip: false, color: "bg-amber-100 border-amber-300 text-amber-700", width: 300, height: 80, shape: "rounded-sm", x: 450, y: 40 },
  { id: "dance_floor_1", label: "Dance Floor", type: "zone", seats: 0, isVip: false, color: "bg-fuchsia-100 border-fuchsia-300 text-fuchsia-700 opacity-80", width: 200, height: 120, shape: "rounded-sm", x: 500, y: 150 },
  { id: "vip_table_1", label: "VIP Table 1", type: "table", seats: 10, isVip: true, color: "bg-purple-100 border-purple-300 text-purple-600", width: 140, height: 60, shape: "rounded-md", x: 280, y: 180 },
  { id: "vip_table_2", label: "VIP Table 2", type: "table", seats: 10, isVip: true, color: "bg-purple-100 border-purple-300 text-purple-600", width: 140, height: 60, shape: "rounded-md", x: 780, y: 180 },
  { id: "table_1", label: "Table 1", type: "table", seats: 10, isVip: false, color: "bg-blue-100 border-blue-300 text-blue-600", width: 70, height: 70, shape: "rounded-full", x: 250, y: 320 },
  { id: "table_2", label: "Table 2", type: "table", seats: 10, isVip: false, color: "bg-blue-100 border-blue-300 text-blue-600", width: 70, height: 70, shape: "rounded-full", x: 450, y: 320 },
  { id: "table_3", label: "Table 3", type: "table", seats: 10, isVip: false, color: "bg-blue-100 border-blue-300 text-blue-600", width: 70, height: 70, shape: "rounded-full", x: 680, y: 320 },
  { id: "table_4", label: "Table 4", type: "table", seats: 10, isVip: false, color: "bg-blue-100 border-blue-300 text-blue-600", width: 70, height: 70, shape: "rounded-full", x: 880, y: 320 },
  { id: "table_5", label: "Table 5", type: "table", seats: 10, isVip: false, color: "bg-blue-100 border-blue-300 text-blue-600", width: 70, height: 70, shape: "rounded-full", x: 250, y: 460 },
  { id: "table_6", label: "Table 6", type: "table", seats: 10, isVip: false, color: "bg-blue-100 border-blue-300 text-blue-600", width: 70, height: 70, shape: "rounded-full", x: 450, y: 460 },
  { id: "table_7", label: "Table 7", type: "table", seats: 10, isVip: false, color: "bg-blue-100 border-blue-300 text-blue-600", width: 70, height: 70, shape: "rounded-full", x: 680, y: 460 },
  { id: "table_8", label: "Table 8", type: "table", seats: 10, isVip: false, color: "bg-blue-100 border-blue-300 text-blue-600", width: 70, height: 70, shape: "rounded-full", x: 880, y: 460 },
  { id: "buffet_1", label: "BUFFET SECTION", type: "zone", seats: 0, isVip: false, color: "bg-orange-100 border-orange-300 text-orange-700", width: 220, height: 50, shape: "rounded-sm", x: 490, y: 640 },
];

export default function SeatingArrangements() {
  const [placedItems, setPlacedItems] = useState(defaultInitialItems);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [history, setHistory] = useState([defaultInitialItems]); // For undo/redo
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const canvasRef = useRef(null);
  const dragDataRef = useRef(null); // Reliable drag payload storage
  const maxCapacity = 500;

  const [layoutStatus, setLayoutStatus] = useState("Draft");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Load saved layout from localStorage on initial render
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("seating_layout_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.items && Array.isArray(parsed.items) && parsed.items.length > 0) {
          setPlacedItems(parsed.items);
          setHistory([parsed.items]);
        }
        if (parsed.status) {
          setLayoutStatus(parsed.status);
        }
      }
    } catch (err) {
      console.error("Failed to load seating layout from localStorage", err);
    }
  }, []);

  const handleSaveDraft = () => {
    try {
      localStorage.setItem("seating_layout_data", JSON.stringify({
        items: placedItems,
        status: "Draft",
        updatedAt: new Date().toISOString()
      }));
      setLayoutStatus("Draft");
      setSaveSuccessMsg("Draft seating layout saved successfully!");
      setTimeout(() => setSaveSuccessMsg(""), 3500);
    } catch (err) {
      console.error("Error saving draft:", err);
      alert("Failed to save draft layout.");
    }
  };

  const handlePublishLayout = () => {
    try {
      localStorage.setItem("seating_layout_data", JSON.stringify({
        items: placedItems,
        status: "Published",
        updatedAt: new Date().toISOString()
      }));
      setLayoutStatus("Published");
      setSaveSuccessMsg("Seating layout published successfully!");
      setTimeout(() => setSaveSuccessMsg(""), 3500);
    } catch (err) {
      console.error("Error publishing layout:", err);
      alert("Failed to publish layout.");
    }
  };

  const handleAddToolItem = (tool) => {
    const centerX = 500 + Math.floor(Math.random() * 100) - 50;
    const centerY = 350 + Math.floor(Math.random() * 100) - 50;

    let label = tool.label;
    if (tool.type === "table") {
      const tableCount = placedItems.filter((i) => i.type === "table").length;
      label = `Table ${tableCount + 1}`;
    }

    const newItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
      ...tool,
      x: Math.round(centerX / 10) * 10,
      y: Math.round(centerY / 10) * 10,
      label,
    };

    updateItems([...placedItems, newItem]);
    setSelectedItemId(newItem.id);
  };

  // --- Undo / Redo Logic ---
  const saveHistory = (newItems) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newItems);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setPlacedItems(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setPlacedItems(history[historyIndex + 1]);
    }
  };

  const updateItems = (newItems) => {
    setPlacedItems(newItems);
    saveHistory(newItems);
  };

  // --- Drag and Drop Handlers ---
  const handleDragStartSidebar = (e, tool) => {
    dragDataRef.current = { type: 'new', tool };
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragStartCanvas = (e, item) => {
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    const scale = zoom / 100;
    
    dragDataRef.current = {
      type: 'placed',
      id: item.id,
      offsetX: (e.clientX - rect.left) / scale,
      offsetY: (e.clientY - rect.top) / scale
    };
    
    e.dataTransfer.effectAllowed = "move";
    setSelectedItemId(item.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dragData = dragDataRef.current;
    if (!dragData) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const scale = zoom / 100;

    if (dragData.type === 'new') {
      const tool = dragData.tool;
      const x = (e.clientX - canvasRect.left) / scale - tool.width / 2;
      const y = (e.clientY - canvasRect.top) / scale - tool.height / 2;

      let label = tool.label;
      if (tool.type === "table") {
        const tableCount = placedItems.filter((i) => i.type === "table").length;
        label = `Table ${tableCount + 1}`;
      }

      const newItem = {
        id: Date.now().toString(),
        ...tool,
        x: Math.round(x / 10) * 10,
        y: Math.round(y / 10) * 10,
        label,
      };

      updateItems([...placedItems, newItem]);
      setSelectedItemId(newItem.id);
      dragDataRef.current = null;
      return;
    }

    if (dragData.type === 'placed') {
      const { id, offsetX, offsetY } = dragData;
      
      const x = (e.clientX - canvasRect.left) / scale - offsetX;
      const y = (e.clientY - canvasRect.top) / scale - offsetY;

      updateItems(
        placedItems.map((item) =>
          item.id === id
            ? { ...item, x: Math.round(x / 10) * 10, y: Math.round(y / 10) * 10 }
            : item
        )
      );
      dragDataRef.current = null;
    }
  };

  const handleDelete = () => {
    if (selectedItemId) {
      updateItems(placedItems.filter((item) => item.id !== selectedItemId));
      setSelectedItemId(null);
    }
  };

  // Listen for delete key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedItemId) {
        handleDelete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItemId, placedItems]);

  // --- Derived Statistics ---
  const stats = useMemo(() => {
    const tables = placedItems.filter((i) => i.type === "table");
    const totalTables = tables.length;
    const totalSeats = placedItems.reduce((sum, item) => sum + (item.seats || 0), 0);
    const vipSeats = placedItems.filter(i => i.isVip).reduce((sum, item) => sum + (item.seats || 0), 0);
    return { totalTables, totalSeats, vipSeats, tables };
  }, [placedItems]);

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col bg-slate-50 overflow-hidden -m-6">
      {/* Top Header */}
      <header className="flex flex-col gap-4 border-b border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between px-6 z-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Seating Arrangement</h2>
          <p className="mt-1 text-sm text-slate-500">
            Dashboard / Seating Arrangement / <span className="font-semibold text-purple-600">Wedding Ceremony - 20 Aug 2024</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
            <ArrowLeft size={16} /> Back to Events
          </button>
          <button 
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-2 rounded-xl border border-purple-200 text-purple-700 bg-purple-50 px-4 py-2 text-sm font-semibold hover:bg-purple-100 active:scale-95 transition-all cursor-pointer shadow-2xs"
          >
            <Save size={16} /> Save Draft
          </button>
          <button 
            onClick={handlePublishLayout}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <CheckCircle2 size={16} /> Publish Layout
          </button>
        </div>
      </header>

      {/* Save Success Banner */}
      {saveSuccessMsg && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 text-sm font-bold text-emerald-700 flex items-center justify-between animate-fade-in z-20">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg("")} className="text-xs text-emerald-600 hover:text-emerald-800">Dismiss</button>
        </div>
      )}

      {/* Info Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap gap-8 text-sm z-10">
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Event Name</p>
          <p className="font-semibold text-slate-900">Wedding Ceremony</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Event Date</p>
          <p className="font-semibold text-slate-900">20 Aug 2024</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Venue</p>
          <p className="font-semibold text-slate-900">Royal Palace Hall</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Hall Capacity</p>
          <p className="font-semibold text-slate-900">{maxCapacity} Guests</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Layout Name</p>
          <p className="font-semibold text-slate-900 flex items-center gap-2">Default Layout <Pencil size={14} className="text-slate-400 cursor-pointer hover:text-purple-600" /></p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar (Tools) */}
        <aside className="w-64 border-r border-slate-200 bg-white overflow-y-auto z-10">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Layout Tools</h3>
            <p className="text-xs text-slate-500 mt-1">Drag and drop to customize layout</p>
          </div>
          <div className="p-4 space-y-6">
            {TOOL_CATEGORIES.map((category) => (
              <div key={category.name}>
                <h4 className="font-semibold text-sm text-slate-900 mb-3">{category.name}</h4>
                <div className="grid grid-cols-3 gap-3">
                  {category.items.map((tool) => (
                    <div
                      key={tool.id}
                      draggable
                      onDragStart={(e) => handleDragStartSidebar(e, tool)}
                      onClick={() => handleAddToolItem(tool)}
                      className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-purple-50 cursor-pointer border border-transparent hover:border-purple-200 transition-all active:scale-95 shadow-2xs"
                      title={`Click or drag to add ${tool.label}`}
                    >
                      <div className={`w-10 h-10 border ${tool.color.split(' ')[0]} ${tool.color.split(' ')[1]} ${tool.shape} flex items-center justify-center text-sm shadow-sm`}>
                        {/* If it's a round table, visually represent chairs */}
                        {tool.id === "round_table" ? (
                           <div className="relative w-full h-full rounded-full flex items-center justify-center">
                              <div className="absolute -top-1 w-2 h-2 rounded-full bg-slate-300"></div>
                              <div className="absolute -bottom-1 w-2 h-2 rounded-full bg-slate-300"></div>
                              <div className="absolute -left-1 w-2 h-2 rounded-full bg-slate-300"></div>
                              <div className="absolute -right-1 w-2 h-2 rounded-full bg-slate-300"></div>
                           </div>
                        ) : null}
                      </div>
                      <span className="text-[10px] text-slate-600 font-bold text-center leading-tight">{tool.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <h4 className="font-semibold text-sm text-slate-900 mb-3">Actions</h4>
              <div className="grid grid-cols-3 gap-3">
                <div 
                  className={`flex flex-col items-center gap-2 p-2 rounded-xl cursor-pointer border transition-colors ${selectedItemId === null ? 'bg-purple-50 border-purple-200 text-purple-700' : 'hover:bg-slate-50 border-transparent hover:border-slate-200'}`}
                  onClick={() => setSelectedItemId(null)}
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full border border-slate-200 shadow-sm text-slate-600">
                    <MousePointer2 size={16} />
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium text-center">Select</span>
                </div>
                <div 
                  className={`flex flex-col items-center gap-2 p-2 rounded-xl cursor-pointer border transition-colors hover:bg-rose-50 border-transparent hover:border-rose-200 text-slate-600 hover:text-rose-600 ${!selectedItemId ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleDelete}
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full border border-slate-200 shadow-sm text-inherit">
                    <Trash2 size={16} />
                  </div>
                  <span className="text-[10px] text-inherit font-medium text-center">Delete</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Canvas Area */}
        <main className="flex-1 flex flex-col relative bg-slate-100 overflow-hidden">
          {/* Toolbar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md z-20">
            <button onClick={handleUndo} disabled={historyIndex === 0} className="p-1.5 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded-lg"><Undo2 size={18} /></button>
            <button onClick={handleRedo} disabled={historyIndex === history.length - 1} className="p-1.5 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded-lg"><Redo2 size={18} /></button>
            <div className="w-px h-5 bg-slate-200 mx-2"></div>
            <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg"><ZoomOut size={18} /></button>
            <span className="text-sm font-semibold text-slate-700 w-12 text-center">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg"><ZoomIn size={18} /></button>
            <div className="w-px h-5 bg-slate-200 mx-2"></div>
            <button onClick={() => setZoom(100)} className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">
              <Maximize size={16} /> Fit to View
            </button>
          </div>

          {/* Draggable Grid Canvas */}
          <div 
            className="flex-1 overflow-auto p-12 custom-scrollbar" 
            onClick={() => setSelectedItemId(null)}
          >
            <div 
              ref={canvasRef}
              className="relative bg-white shadow-xl mx-auto rounded-lg transition-transform duration-200 origin-top"
              style={{
                width: 1200,
                height: 800,
                transform: `scale(${zoom / 100})`,
                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {placedItems.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStartCanvas(e, item)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItemId(item.id);
                  }}
                  className={`absolute flex items-center justify-center border-2 cursor-move shadow-sm select-none transition-shadow ${
                    item.color
                  } ${item.shape} ${selectedItemId === item.id ? 'ring-4 ring-purple-400 ring-offset-2 z-10' : 'z-0'}`}
                  style={{
                    left: item.x,
                    top: item.y,
                    width: item.width,
                    height: item.height,
                  }}
                >
                  <span className={`font-semibold tracking-wide ${item.type === 'zone' ? 'text-lg uppercase' : 'text-xs'}`}>{item.label}</span>
                  
                  {/* Visual Chairs around round table for aesthetics */}
                  {item.id.includes("round_table") && (
                     <>
                      <div className="absolute -top-2 w-4 h-4 rounded-full bg-white border border-slate-300 shadow-sm"></div>
                      <div className="absolute -bottom-2 w-4 h-4 rounded-full bg-white border border-slate-300 shadow-sm"></div>
                      <div className="absolute -left-2 w-4 h-4 rounded-full bg-white border border-slate-300 shadow-sm"></div>
                      <div className="absolute -right-2 w-4 h-4 rounded-full bg-white border border-slate-300 shadow-sm"></div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border border-slate-300 shadow-sm"></div>
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-white border border-slate-300 shadow-sm"></div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border border-slate-300 shadow-sm"></div>
                      <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-white border border-slate-300 shadow-sm"></div>
                     </>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 z-20">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">i</span>
            Tip: Drag items from the left panel to the layout area. Click on any item to select and move it.
          </div>
        </main>

        {/* Right Sidebar (Details) */}
        <aside className="w-80 border-l border-slate-200 bg-slate-50 overflow-y-auto z-10 flex flex-col gap-4 p-4">
          {/* Details Card */}
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Layout Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Total Tables</span>
                <span className="font-semibold text-slate-900">{stats.totalTables}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Total Seats</span>
                <span className="font-semibold text-slate-900">{stats.totalSeats}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">VIP Seats</span>
                <span className="font-semibold text-slate-900">{stats.vipSeats}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Total Capacity</span>
                <span className="font-semibold"><span className={stats.totalSeats > maxCapacity ? "text-rose-600" : "text-purple-600"}>{stats.totalSeats}</span> <span className="text-slate-400">/ {maxCapacity}</span></span>
              </div>
              <div className="flex justify-between pt-1 items-center">
                <span className="text-slate-500">Status</span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                  layoutStatus === "Published" 
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                    : "bg-amber-100 text-amber-700 border border-amber-200"
                }`}>
                  {layoutStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Table List Card */}
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm flex-1 flex flex-col">
            <h3 className="font-bold text-slate-900 mb-4">Table List</h3>
            <div className="space-y-2 mb-4 overflow-y-auto flex-1 custom-scrollbar pr-2 min-h-[150px]">
              {stats.tables.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No tables added yet.</p>
              ) : (
                stats.tables.map((table, idx) => (
                  <div key={table.id} className={`flex items-center justify-between text-sm p-2 rounded-lg border border-transparent hover:bg-slate-50 hover:border-slate-200 transition-colors ${selectedItemId === table.id ? 'bg-purple-50 border-purple-200' : ''}`} onClick={() => setSelectedItemId(table.id)}>
                    <span className="font-medium text-slate-700">{table.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-xs">{table.seats} Seats</span>
                      <div className="flex gap-1">
                        <Pencil size={14} className="text-slate-400 hover:text-blue-600 cursor-pointer" />
                        <Trash2 size={14} className="text-slate-400 hover:text-rose-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); updateItems(placedItems.filter(i => i.id !== table.id)); }} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button 
              onClick={() => handleAddToolItem(TOOL_CATEGORIES[0].items[0])}
              className="w-full rounded-xl border border-purple-200 py-2.5 text-sm font-bold text-purple-600 hover:bg-purple-50 transition-colors mt-auto cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
            >
              + Add New Table
            </button>
          </div>

          {/* Legend Card */}
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 text-sm">Legend</h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></span><span className="text-slate-600">Round Table</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-md bg-purple-100 border border-purple-300"></span><span className="text-slate-600">VIP Table</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-300"></span><span className="text-slate-600">Stage</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-fuchsia-100 border border-fuchsia-300 opacity-80"></span><span className="text-slate-600">Dance Floor</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-orange-100 border border-orange-300"></span><span className="text-slate-600">Buffet</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-white border-2 border-emerald-400"></span><span className="text-slate-600">Entrance</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-slate-700"></span><span className="text-slate-600">Pillar</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span><span className="text-slate-600">Plants</span></div>
            </div>
          </div>
        </aside>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
      `}} />
    </div>
  );
}
