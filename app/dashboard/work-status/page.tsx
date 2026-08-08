"use client";

import {
  SquarePen,
  Trash2,
  Calendar,
  Filter,
  Search,
  User,
  FolderOpen,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { WorkItem } from "./types";
import { getWorks, updateWork, deleteWork } from "./storage";

type WorkStatus =
  | "Pending"
  | "Processing"
  | "Completed"
  | "Delivered";

export default function WorkStatusPage() {
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingWork, setEditingWork] = useState<WorkItem | null>(null);

const [previewReceipt, setPreviewReceipt] = useState<{
  url: string;
  type: "image" | "pdf";
} | null>(null);
    useEffect(() => {
    setWorks(getWorks());
  }, []);

  const categories = useMemo(() => {
    const values = Array.from(
      new Set(
        works.map((work) => (work.service || "Others").trim())
      )
    ).sort();

    return ["All", ...values];
  }, [works]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: works.length,
    };

    works.forEach((work) => {
      const key = (work.service || "Others").trim();

      counts[key] = (counts[key] || 0) + 1;
    });

    return counts;
  }, [works]);

  const currentUser = useMemo(() => {
    if (typeof window === "undefined") return "";

    const user = JSON.parse(
      localStorage.getItem("loggedInUser") || "{}"
    );

    return user.username || "";
  }, []);
    const handleStatusChange = (
    id: string,
    newStatus: WorkStatus
  ) => {
    const workToUpdate = works.find((w) => w.id === id);

    if (!workToUpdate) return;

    updateWork({
      ...workToUpdate,
      status: newStatus,
    });

    setWorks(getWorks());
  };

  const handleDelete = (id: string) => {
    if (!confirm("ഈ വർക്ക് ഡിലീറ്റ് ചെയ്യണമെന്നുണ്ടോ?")) return;

    deleteWork(id);
    setWorks(getWorks());
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingWork) return;

    updateWork(editingWork);
    setWorks(getWorks());
    setEditingWork(null);
  };
    const filteredWorks = useMemo(() => {
    return works.filter((work) => {
      const matchesSearch =
        (work.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (work.phone || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (work.reference || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (work.service || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "All" ||
        work.status === selectedStatus;

      const matchesCategory =
        selectedCategory === "All" ||
        (work.service || "Others") === selectedCategory;

      let matchesDate = true;

      if (selectedDate && work.date && work.date !== "N/A") {
        const parts = work.date.split("/");

        if (parts.length === 3) {
          const formatted = `${parts[2]}-${parts[1]}-${parts[0]}`;
          matchesDate = formatted.startsWith(selectedDate);
        }
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesDate
      );
    });
  }, [
    works,
    searchQuery,
    selectedStatus,
    selectedCategory,
    selectedDate,
  ]);
    const counts = useMemo(() => {
    return {
      pending: works.filter((w) => w.status === "Pending").length,
      processing: works.filter((w) => w.status === "Processing").length,
      completed: works.filter(
        (w) =>
          w.status === "Completed" ||
          w.status === "Delivered"
      ).length,
      total: works.length,
    };
  }, [works]);

  const staffCounts = useMemo(() => {
    const map: Record<string, number> = {};

    works.forEach((work: any) => {
      const staff = work.addedBy || work.staff || "Unknown";

      map[staff] = (map[staff] || 0) + 1;
    });

    return map;
  }, [works]);

  const topStaff = Object.entries(staffCounts).sort(
    (a, b) => b[1] - a[1]
  );
    return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Work Status
            </h1>
            <p className="mt-2 text-slate-500">
              Track, filter and manage all service works.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3">
            <p className="text-xs font-semibold uppercase text-emerald-700">
              Logged In Staff
            </p>
            <p className="mt-1 flex items-center gap-2 font-bold text-emerald-900">
              <User size={16} />
              {currentUser || "Admin"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
            <p className="text-sm font-medium text-yellow-700">
              Pending
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              {counts.pending}
            </h2>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="text-sm font-medium text-blue-700">
              Processing
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              {counts.processing}
            </h2>
          </div>

          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <p className="text-sm font-medium text-green-700">
              Completed
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              {counts.completed}
            </h2>
          </div>

          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
            <p className="text-sm font-medium text-violet-700">
              Total Works
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              {counts.total}
            </h2>
          </div>
        </div>
      </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Name, Phone, Reference, Service..."
              className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-slate-500" />

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-2 mb-3">
            <FolderOpen size={18} />
            <h3 className="font-semibold text-slate-700">
              Service Categories
            </h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {category} ({categoryCounts[category] || 0})
              </button>
            ))}
          </div>
        </div>
      </div>
            {/* Status Filter */}
      <div className="mt-6 flex flex-wrap gap-3">
        {[
          "All",
          "Pending",
          "Processing",
          "Completed",
          "Delivered",
        ].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              selectedStatus === status
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Works */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            Works ({filteredWorks.length})
          </h2>

          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold">
              {selectedCategory}
            </span>
          </div>
        </div>

        <div className="space-y-5">
          {filteredWorks.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center">
              <h3 className="text-lg font-semibold">
                No Works Found
              </h3>

              <p className="mt-2 text-slate-500">
                No records available for this category.
              </p>
            </div>
          )}

          {filteredWorks.map((work) => {
            const workId = work.id || work.reference;

            return (
              <div
                key={workId}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:shadow-md"
              >
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {work.service}
                      </span>

                      <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                        {work.status}
                      </span>
                    </div>

<h3 className="text-lg font-bold text-slate-800">
  👤 {work.name || "Unknown Name"}
</h3>

{work.phone && (
  <p className="text-slate-600">
    📞 {work.phone}
  </p>
)}

<p className="text-slate-600">
  📄 Application No: {work.reference || "N/A"}
</p>

{(work as any).registrationNo && (
  <p className="text-slate-600">
    🔢 Registration No: {(work as any).registrationNo}
  </p>
)}

<p className="text-slate-600">
  📅 {work.date || "N/A"}
</p>

                    <p className="text-slate-600">
                      👨‍💼 Added By :{" "}
                      <span className="font-semibold text-emerald-700">
                        {(work as any).addedBy ||
                          work.staff ||
                          "Unknown"}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 lg:items-end">
                    <select
                      value={work.status}
                      onChange={(e) =>
                        handleStatusChange(
                          workId,
                          e.target.value as WorkStatus
                        )
                      }
                      className="rounded-xl border border-amber-300 bg-amber-100 px-4 py-2 font-semibold text-amber-800 outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">
                        Processing
                      </option>
                      <option value="Completed">
                        Completed
                      </option>
                      <option value="Delivered">
                        Delivered
                      </option>
                    </select>

                    <div className="flex flex-wrap gap-2">
{(work as any).receiptUrl && (
  <button
    onClick={() =>
      setPreviewReceipt({
        url: (work as any).receiptUrl,
        type: ((work as any).receiptType || "image") as
          | "image"
          | "pdf",
      })
    }
    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
  >
    👁 Preview
  </button>
)}

<button
  onClick={() =>
    setEditingWork(work)
  }
  className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 font-medium text-white hover:bg-amber-600"
>
                        <SquarePen size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(workId)
                        }
                        className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
{previewReceipt && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-5">
    <div className="relative h-[92vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white">

      <div className="flex items-center justify-between border-b px-5 py-4">
        <h2 className="text-xl font-bold">
          Receipt Preview
        </h2>

        <div className="flex gap-2">

          <button
            onClick={() =>
              window.open(previewReceipt.url, "_blank")
            }
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Open
          </button>

          <button
            onClick={() => {
              const a = document.createElement("a");
              a.href = previewReceipt.url;
              a.download = "Receipt";
              a.click();
            }}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-white"
          >
            Download
          </button>

          <button
           onClick={() => {
  const win = window.open("", "_blank");

  if (!win) return;

  if (previewReceipt.type === "pdf") {
    win.location.href = previewReceipt.url;
  } else {
    win.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body{
              margin:0;
              display:flex;
              justify-content:center;
              align-items:center;
              background:#fff;
            }
            img{
              max-width:100%;
              max-height:100vh;
            }
          </style>
        </head>
        <body>
          <img src="${previewReceipt.url}" />
          <script>
            window.onload=()=>{
              window.print();
            }
          </script>
        </body>
      </html>
    `);

    win.document.close();
  }
}}
            className="rounded-lg bg-orange-600 px-4 py-2 text-white"
          >
            Print
          </button>

          <button
            onClick={() => setPreviewReceipt(null)}
            className="rounded-lg bg-red-600 px-4 py-2 text-white"
          >
            Close
          </button>

        </div>
      </div>

      <div className="h-[calc(92vh-72px)] overflow-auto bg-slate-100">

        {previewReceipt.type === "pdf" ? (
<iframe
  src={previewReceipt.url}
  title="Receipt Preview"
  className="h-full w-full"
/>
        ) : (
<img
  src={previewReceipt.url}
  alt="Receipt Preview"
  className="mx-auto h-full max-w-full object-contain select-none"
/>
        )}

      </div>
    </div>
  </div>
)}

{/* Edit Modal */}
      {editingWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-5 text-xl font-bold text-slate-800">
              Edit Work
            </h3>

            <form
              onSubmit={handleSaveEdit}
              className="space-y-4"
            >
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Name
                </label>

                <input
                  type="text"
                  value={editingWork.name}
                  onChange={(e) =>
                    setEditingWork({
                      ...editingWork,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Phone
                </label>

                <input
                  type="text"
                  value={editingWork.phone}
                  onChange={(e) =>
                    setEditingWork({
                      ...editingWork,
                      phone: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Reference Number
                </label>

                <input
                  type="text"
                  value={editingWork.reference}
                  onChange={(e) =>
                    setEditingWork({
                      ...editingWork,
                      reference: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Date
                </label>

                <input
                  type="text"
                  value={editingWork.date}
                  onChange={(e) =>
                    setEditingWork({
                      ...editingWork,
                      date: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingWork(null)}
                  className="rounded-xl bg-slate-200 px-5 py-2 font-medium text-slate-700 hover:bg-slate-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
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