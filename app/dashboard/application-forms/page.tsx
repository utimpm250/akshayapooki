"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  File,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileArchive,
  Plus,
  Edit2,
  Trash2,
  Bookmark,
  X,
  Briefcase
} from "lucide-react";

import {
  GOOGLE_DRIVE_CONFIG,
  DRIVE_ENDPOINT,
} from "@/app/lib/googledrive";
import PDFViewerModal from "./PDFViewerModal";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  iconLink?: string;
  thumbnailLink?: string;
  webViewLink: string;
  webContentLink?: string;
  isPinned?: boolean;
}

export default function ApplicationFormsPage() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  // Modal & Edit/Add States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("application/pdf");
  const [formUrl, setFormUrl] = useState("");

  const loadFiles = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        DRIVE_ENDPOINT(
          GOOGLE_DRIVE_CONFIG.folderId,
          GOOGLE_DRIVE_CONFIG.apiKey
        )
      );

      let driveFiles: DriveFile[] = [];
      if (response.ok) {
        const data = await response.json();
        driveFiles = data.files ?? [];
      }

      const localData = localStorage.getItem('managedApplicationFiles');
      if (localData) {
        const parsedLocal: DriveFile[] = JSON.parse(localData);
        
        const mergedFiles = driveFiles.map(df => {
          const found = parsedLocal.find(p => p.id === df.id);
          return found ? { ...df, ...found } : df;
        });

        const extraFiles = parsedLocal.filter(p => !driveFiles.some(df => df.id === p.id));
        
        setFiles([...extraFiles, ...mergedFiles]);
      } else {
        setFiles(driveFiles);
      }
    } catch (error) {
      console.error("Google Drive Error:", error);
      const localData = localStorage.getItem('managedApplicationFiles');
      if (localData) {
        setFiles(JSON.parse(localData));
      } else {
        setFiles([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleRefresh = () => {
    loadFiles();
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) {
      alert("Please enter form name!");
      return;
    }

    let updatedFiles: DriveFile[];

    if (editingFileId) {
      updatedFiles = files.map(f => {
        if (f.id === editingFileId) {
          return { ...f, name: formName, mimeType: formType, webViewLink: formUrl || f.webViewLink };
        }
        return f;
      });
    } else {
      const newFile: DriveFile = {
        id: Date.now().toString(),
        name: formName,
        mimeType: formType,
        size: '102400',
        modifiedTime: new Date().toISOString(),
        webViewLink: formUrl || '#',
        isPinned: false
      };
      updatedFiles = [newFile, ...files];
    }

    setFiles(updatedFiles);
    localStorage.setItem('managedApplicationFiles', JSON.stringify(updatedFiles));
    closeModal();
  };

  const openAddModal = () => {
    setEditingFileId(null);
    setFormName("");
    setFormType("application/pdf");
    setFormUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (e: React.MouseEvent, file: DriveFile) => {
    e.stopPropagation();
    setEditingFileId(file.id);
    setFormName(file.name);
    setFormType(file.mimeType);
    setFormUrl(file.webViewLink || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFileId(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this form?")) {
      const updated = files.filter(f => f.id !== id);
      setFiles(updated);
      localStorage.setItem('managedApplicationFiles', JSON.stringify(updated));
    }
  };

  const handleTogglePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = files.map(f => {
      if (f.id === id) {
        return { ...f, isPinned: !f.isPinned };
      }
      return f;
    });
    setFiles(updated);
    localStorage.setItem('managedApplicationFiles', JSON.stringify(updated));
  };

  const filteredFiles = useMemo(() => {
    const searched = files.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase())
    );
    return searched.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
  }, [files, search]);

  // ലോഗോകളുടെ സൈസ് വലുതാക്കി മനോഹരമായി സെറ്റ് ചെയ്തിരിക്കുന്നു
  const getIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) return <FileText size={38} className="text-red-500 drop-shadow-sm" />;
    if (mimeType.includes("word") || mimeType.includes("document")) return <FileText size={38} className="text-blue-600 drop-shadow-sm" />;
    if (mimeType.includes("sheet") || mimeType.includes("spreadsheet") || mimeType.includes("excel")) return <FileSpreadsheet size={38} className="text-emerald-600 drop-shadow-sm" />;
    if (mimeType.includes("image")) return <FileImage size={38} className="text-violet-500 drop-shadow-sm" />;
    return <FileArchive size={38} className="text-slate-500 drop-shadow-sm" />;
  };

  const formatSize = (size?: string) => {
    if (!size) return "--";
    const kb = Number(size) / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  return (
    <>
      <div className="relative mx-auto min-h-screen w-full max-w-[1600px] space-y-5 bg-gradient-to-br from-slate-50 via-white to-cyan-50/40 p-4 sm:p-5 lg:p-6">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/85 p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Application Forms</h1>
            <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">Browse and manage all application forms from Google Drive.</p>
          </div>

          <button
            onClick={handleRefresh}
            className="flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative rounded-2xl border border-slate-200/80 bg-white/80 p-2 shadow-sm backdrop-blur-xl">
          <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search application forms..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-xs font-semibold text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
          />
        </div>

        {/* Compact Grid Layout with Larger Attractive Icons */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs font-semibold">
              Loading files from Google Drive...
            </div>
          ) : filteredFiles.length > 0 ? (
            filteredFiles.map((file) => (
              <div
                key={file.id}
                onClick={() => {
                  setSelectedFile(file);
                  setViewerOpen(true);
                }}
                className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border bg-white/95 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)] ${
                  file.isPinned ? 'border-cyan-300 ring-2 ring-cyan-100 bg-cyan-50/30' : 'border-slate-200/90'
                }`}
              >
                <div>
                  {/* Larger Centralized/Aligned Logo & Badge */}
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-cyan-50/60 p-3.5 shadow-sm transition-all group-hover:border-cyan-100 group-hover:from-cyan-50 group-hover:to-blue-50">
                      {getIcon(file.mimeType)}
                    </div>

                    <span className="max-w-[100px] truncate rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-slate-500">
                      {file.mimeType.split("/").pop()}
                    </span>
                  </div>

                  {/* Shortened / Truncated Title */}
                  <h2 className="line-clamp-2 min-h-[34px] text-sm font-black leading-relaxed text-slate-800">
                    {file.name}
                  </h2>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-semibold text-slate-400">{formatSize(file.size)}</span>

                  {/* Actions (Pin, Edit, Delete) */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleTogglePin(e, file.id)}
                      title={file.isPinned ? "Unpin" : "Pin to Top"}
                      className={`p-1.5 rounded transition ${file.isPinned ? 'text-cyan-600 bg-cyan-50' : 'text-slate-400 hover:bg-slate-100 hover:text-cyan-600'}`}
                    >
                      <Bookmark size={13} fill={file.isPinned ? "currentColor" : "none"} />
                    </button>
                    <button
                      onClick={(e) => openEditModal(e, file)}
                      title="Edit Form Name"
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, file.id)}
                      title="Delete Form"
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full mt-10 text-center py-12 bg-white rounded-2xl border border-slate-200">
              <File size={40} className="mx-auto text-slate-300" />
              <h2 className="mt-2 text-sm font-bold text-slate-700">No files found</h2>
              <p className="mt-1 text-xs text-slate-400">Try searching with another keyword or upload a new form.</p>
            </div>
          )}
        </div>

        {/* Floating Plus Button for Uploading New Form */}
        <button
          onClick={openAddModal}
          className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-4 text-white shadow-[0_12px_30px_rgba(6,182,212,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(37,99,235,0.3)] active:scale-95"
          title="Upload New Form"
        >
          <Plus size={22} />
        </button>
      </div>

      {/* Add / Edit Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.2)] backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-sm font-black text-cyan-600">
                <Briefcase size={18} />
                <h4 className="font-bold text-slate-800">{editingFileId ? "Edit Form" : "Upload New Form"}</h4>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Form Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. License Application Form.pdf"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">File Type / Format</label>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                >
                  <option value="application/pdf">PDF Document (.pdf)</option>
                  <option value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">Word Document (.docx)</option>
                  <option value="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">Excel Spreadsheet (.xlsx)</option>
                  <option value="image/png">Image File (.png/.jpg)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">File URL / Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-2.5 text-xs font-black text-white shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  {editingFileId ? "Update Form" : "Save & Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF / Document Viewer Modal */}
      <PDFViewerModal
        open={viewerOpen}
        title={selectedFile?.name || ""}
        fileId={selectedFile?.id || ""}
        onClose={() => {
          setViewerOpen(false);
          setSelectedFile(null);
        }}
      />
    </>
  );
}