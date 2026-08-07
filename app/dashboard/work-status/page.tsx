"use client";
import { SquarePen, Trash2, Calendar, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { WorkItem } from "./types";
import { getWorks, updateWork, deleteWork } from "./storage";

export default function WorkStatusPage() {
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  
  // Edit Modal States
  const [editingWork, setEditingWork] = useState<WorkItem | null>(null);

  useEffect(() => {
    setWorks(getWorks());
  }, []);
type WorkStatus =
  | "Pending"
  | "Processing"
  | "Completed"
  | "Delivered";

const handleStatusChange = (
  id: string,
  newStatus: WorkStatus
) => {
  const workToUpdate = works.find((w) => w.id === id);

  if (workToUpdate) {
    const updated = {
      ...workToUpdate,
      status: newStatus,
    };

    updateWork(updated);
    setWorks(getWorks());
  }
};

  const handleDelete = (id: string) => {
    if (confirm("ഈ വർക്ക് ഡിലീറ്റ് ചെയ്യണമെന്നുണ്ടോ?")) {
      deleteWork(id);
      setWorks(getWorks());
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWork) {
      updateWork(editingWork);
      setWorks(getWorks());
      setEditingWork(null);
    }
  };

  // Filter Logic
  const filteredWorks = works.filter((work) => {
    const matchesSearch = 
      work.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.reference?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === "All" || work.status === selectedStatus;

    let matchesDate = true;
    if (selectedDate && work.date && work.date !== "N/A") {
      // work.date format is DD/MM/YYYY
      const parts = work.date.split("/");
      if (parts.length === 3) {
        const workFormattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // YYYY-MM-DD
        matchesDate = workFormattedDate.startsWith(selectedDate);
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

// Counts for summary boxes
const counts = {
  pending: works.filter((w) => w.status === "Pending").length,
  processing: works.filter((w) => w.status === "Processing").length,
  completed: works.filter(
    (w) => w.status === "Completed" || w.status === "Delivered"
  ).length,
  returned: 0,
};

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Work Status</h1>
        <p className="mt-2 text-slate-500">View and manage all pending works.</p>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
            <p className="text-sm text-yellow-700 font-medium">Pending</p>
            <h2 className="text-3xl font-bold mt-2">{counts.pending}</h2>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <p className="text-sm text-blue-700 font-medium">Processing</p>
            <h2 className="text-3xl font-bold mt-2">{counts.processing}</h2>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <p className="text-sm text-green-700 font-medium">Completed / Delivered</p>
            <h2 className="text-3xl font-bold mt-2">{counts.completed}</h2>
          </div>
        </div>
      </div>

      {/* Search & Date Filter Bar */}
      <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Name, Phone, Reference No..."
          className="w-full md:flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Calendar size={20} className="text-slate-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 w-full"
          />
          {selectedDate && (
            <button
              onClick={() => setSelectedDate("")}
              className="text-xs text-red-600 font-semibold underline whitespace-nowrap"
            >
              Clear Date
            </button>
          )}
        </div>
      </div>

      {/* Status Filter Buttons */}
      <div className="flex flex-wrap gap-3 mt-6">
        {["All", "Pending", "Processing", "Completed", "Delivered", "Returned", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-5 py-2 rounded-full font-medium transition ${
              selectedStatus === status
                ? "bg-blue-600 text-white shadow"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-700">
          Works List ({filteredWorks.length})
        </h2>

        <div className="mt-6 space-y-5">
          {filteredWorks.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
              <h3 className="text-lg font-semibold text-slate-700">No Works Found</h3>
              <p className="mt-2 text-slate-500">വര്‍ക്കുകള്‍ ഒന്നും ലഭ്യമല്ല.</p>
            </div>
          )}

          {filteredWorks.map((work) => {
          onst workId = work.id || work.reference;
            return (
              <div
                key={workId}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 flex flex-col lg:flex-row lg:justify-between gap-4"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{work.service}</h3>
                  <p className="mt-2 text-slate-700 font-medium">👤 {work.name}</p>
                  <p className="text-slate-600">📞 {work.phone}</p>
                  <p className="text-slate-600">🔢 {work.reference}</p>
                  <p className="text-slate-600">📅 {work.date}</p>
                </div>

                <div className="flex flex-col items-start lg:items-end gap-3">
                  {/* Status Dropdown */}
                  <select
                    value={work.status}
                    onChange={(e) =>
  handleStatusChange(
    workId,
    e.target.value as
      | "Pending"
      | "Processing"
      | "Completed"
      | "Delivered"
  )
}
                    className="px-4 py-2 rounded-xl bg-amber-100 text-amber-800 font-semibold border border-amber-300 outline-none cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Returned">Returned</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setEditingWork(work)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium"
                    >
                      <SquarePen size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(workId)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Modal */}
      {editingWork && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Edit Work Details</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editingWork.name}
                  onChange={(e) => setEditingWork({ ...editingWork, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={editingWork.phone}
                  onChange={(e) => setEditingWork({ ...editingWork, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reference Number</label>
                <input
                  type="text"
                  value={editingWork.reference}
                  onChange={(e) => setEditingWork({ ...editingWork, reference: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="text"
                  value={editingWork.date}
                  onChange={(e) => setEditingWork({ ...editingWork, date: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingWork(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-medium hover:bg-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}