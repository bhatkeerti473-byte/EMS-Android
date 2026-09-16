import React, { useState } from "react";
import { CheckSquare, Square, ClipboardCheck, Sparkles } from "lucide-react";

export default function StaffTasks() {
  const [activeTab, setActiveTab] = useState("pending");
  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: "Check entry gate security",
      event: "Wedding Ceremony",
      status: "Pending"
    },
    {
      id: 2,
      text: "Verify entry passes",
      event: "Corporate Event",
      status: "Pending"
    },
    {
      id: 3,
      text: "Coordinate with team",
      event: "Birthday Party",
      status: "Pending"
    },
    {
      id: 4,
      text: "Equipment check",
      event: "Music Concert",
      status: "Completed"
    },
    {
      id: 5,
      text: "Perimeter check layout",
      event: "Wedding Ceremony",
      status: "Completed"
    }
  ]);

  // Handle toggle task completion state
  const handleToggleTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          const newStatus = task.status === "Pending" ? "Completed" : "Pending";
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  const pendingTasks = tasks.filter((t) => t.status === "Pending");
  const completedTasks = tasks.filter((t) => t.status === "Completed");

  const tabs = [
    { id: "pending", label: "Pending Tasks", count: pendingTasks.length },
    { id: "completed", label: "Completed Tasks", count: completedTasks.length }
  ];

  const visibleTasks = activeTab === "pending" ? pendingTasks : completedTasks;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Tabs Header */}
      <div className="flex border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-4 px-6 text-sm font-semibold border-b-2 transition-all duration-200 outline-none ${
              activeTab === tab.id
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-2 py-0.5 rounded-full transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-orange-100 text-orange-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {visibleTasks.length > 0 ? (
          visibleTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleToggleTask(task.id)}
              className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Toggle checkbox icon */}
                <button
                  type="button"
                  className="text-slate-400 group-hover:text-orange-500 transition-colors focus:outline-none shrink-0"
                  aria-label={task.status === "Pending" ? "Complete task" : "Reopen task"}
                >
                  {task.status === "Pending" ? (
                    <Square size={20} className="stroke-[1.5]" />
                  ) : (
                    <CheckSquare size={20} className="text-emerald-500 stroke-[1.5]" />
                  )}
                </button>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-bold leading-snug transition-all ${
                      task.status === "Completed"
                        ? "line-through text-slate-400 font-medium"
                        : "text-slate-800"
                    }`}
                  >
                    {task.text}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 font-semibold truncate">
                    Event: {task.event}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`text-[10px] font-bold px-3 py-1 rounded-full shrink-0 border uppercase tracking-wider ${
                  task.status === "Pending"
                    ? "bg-orange-50 text-orange-600 border-orange-200"
                    : "bg-emerald-50 text-emerald-600 border-emerald-200"
                }`}
              >
                {task.status}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 border-dashed flex flex-col items-center justify-center gap-3">
            {activeTab === "pending" ? (
              <>
                <div className="p-3 rounded-full bg-emerald-50 text-emerald-500 animate-bounce">
                  <Sparkles size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">All caught up!</p>
                  <p className="text-xs text-slate-400 mt-1">No pending tasks for today.</p>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 rounded-full bg-slate-50 text-slate-400">
                  <ClipboardCheck size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-600">No completed tasks yet</p>
                  <p className="text-xs text-slate-400 mt-1">Checkoff items from your pending list.</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
