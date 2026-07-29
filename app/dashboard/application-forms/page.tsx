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
}

export default function ApplicationFormsPage() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] =
  useState<DriveFile | null>(null);

const [viewerOpen, setViewerOpen] =
  useState(false);

  const loadFiles = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        DRIVE_ENDPOINT(
          GOOGLE_DRIVE_CONFIG.folderId,
          GOOGLE_DRIVE_CONFIG.apiKey
        )
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Google Drive files");
      }

      const data = await response.json();

      setFiles(data.files ?? []);
    } catch (error) {
      console.error("Google Drive Error:", error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const filteredFiles = useMemo(() => {
    return files.filter((file) =>
      file.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [files, search]);

  const getIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) {
      return <FileText size={32} className="text-red-500" />;
    }

    if (
      mimeType.includes("word") ||
      mimeType.includes("document")
    ) {
      return <FileText size={32} className="text-blue-600" />;
    }

    if (
      mimeType.includes("sheet") ||
      mimeType.includes("spreadsheet") ||
      mimeType.includes("excel")
    ) {
      return (
        <FileSpreadsheet
          size={32}
          className="text-emerald-600"
        />
      );
    }

    if (mimeType.includes("image")) {
      return (
        <FileImage
          size={32}
          className="text-violet-500"
        />
      );
    }

    return (
      <FileArchive
        size={32}
        className="text-slate-500"
      />
    );
  };

  const formatSize = (size?: string) => {
    if (!size) return "--";

    const kb = Number(size) / 1024;

    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }

    return `${(kb / 1024).toFixed(2)} MB`;
  };

  return (
  <>
<div className="relative min-h-screen bg-slate-100 p-6">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Application Forms
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Browse all application forms from Google Drive.
          </p>
        </div>

        <button
          onClick={loadFiles}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      <div className="relative mb-8">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search application forms..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </div>
            <div
  className={`grid gap-6 ${
    viewerOpen
      ? "grid-cols-1 lg:grid-cols-2"
      : "sm:grid-cols-2 xl:grid-cols-3"
  }`}
>
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-500">
            Loading files...
          </div>
        ) : filteredFiles.length > 0 ? (
          filteredFiles.map((file) => (
            <div
              key={file.id}
onClick={() => {
  setSelectedFile(file);
  setViewerOpen(true);
}}
              className={`group cursor-pointer rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
  viewerOpen ? "max-w-md" : ""
}`}
            >
              <div className="mb-5 flex items-center justify-between">
                {getIcon(file.mimeType)}

                <span className="max-w-[180px] truncate rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">
                  {file.mimeType.split("/").pop()}
                </span>
              </div>

              <h2 className="line-clamp-2 min-h-[56px] text-lg font-semibold text-slate-800">
                {file.name}
              </h2>

              <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                <span>{formatSize(file.size)}</span>

                <span>
                  {new Date(file.modifiedTime).toLocaleDateString("en-IN")}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full mt-10 text-center">
            <File
              size={60}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-4 text-xl font-semibold text-slate-700">
              No files found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try another search keyword.
            </p>
          </div>
        )}
      </div>
    </div>

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