import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Upload, FileText, Image, Film, Music, Archive, Trash2,
  Download, Search, FolderOpen, X, Eye, RefreshCw, HardDrive,
  ChevronDown, File
} from "lucide-react";

// ── Design tokens (matching Lightning Energy brand) ──────────────────────────
const AQUA = "#00EAD3";
const ASH = "#808285";
const WHITE = "#FFFFFF";
const SECTION_BG = "#080808";
const CARD_BG = "#0d0d0d";
const BORDER = "#1e1e1e";

const CATEGORIES = [
  { id: "all", label: "All Files" },
  { id: "general", label: "General" },
  { id: "datasheets", label: "Datasheets" },
  { id: "images", label: "Images" },
  { id: "proposals", label: "Proposals" },
  { id: "contracts", label: "Contracts" },
  { id: "reports", label: "Reports" },
  { id: "other", label: "Other" },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-AU", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function getFileIcon(mimeType: string, size = 20) {
  const style = { color: AQUA };
  if (mimeType.startsWith("image/")) return <Image size={size} style={style} />;
  if (mimeType.startsWith("video/")) return <Film size={size} style={style} />;
  if (mimeType.startsWith("audio/")) return <Music size={size} style={style} />;
  if (mimeType === "application/pdf") return <FileText size={size} style={style} />;
  if (mimeType.includes("zip") || mimeType.includes("tar") || mimeType.includes("gzip"))
    return <Archive size={size} style={style} />;
  return <File size={size} style={style} />;
}

function getMimeLabel(mimeType: string): string {
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType.startsWith("image/")) return mimeType.split("/")[1].toUpperCase();
  if (mimeType.startsWith("video/")) return mimeType.split("/")[1].toUpperCase();
  if (mimeType.startsWith("audio/")) return mimeType.split("/")[1].toUpperCase();
  if (mimeType.includes("zip")) return "ZIP";
  if (mimeType.includes("word")) return "DOCX";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "XLSX";
  return mimeType.split("/")[1]?.toUpperCase() ?? "FILE";
}

// ── Upload Drop Zone ──────────────────────────────────────────────────────────
function UploadZone({
  onUpload,
  uploading,
  selectedCategory,
}: {
  onUpload: (files: File[], category: string) => void;
  uploading: boolean;
  selectedCategory: string;
}) {
  const [dragging, setDragging] = useState(false);
  const [category, setCategory] = useState(selectedCategory === "all" ? "general" : selectedCategory);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const dropped = Array.from(e.dataTransfer.files);
      if (dropped.length) onUpload(dropped, category);
    },
    [onUpload, category],
  );

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length) onUpload(picked, category);
    e.target.value = "";
  };

  return (
    <div className="mb-8">
      {/* Category selector */}
      <div className="flex items-center gap-3 mb-4">
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: ASH, fontFamily: "'Urbanist', sans-serif" }}>
          Upload to category:
        </label>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none text-sm font-semibold pl-3 pr-8 py-2 rounded-lg cursor-pointer"
            style={{
              background: CARD_BG, border: `1px solid ${BORDER}`,
              color: WHITE, fontFamily: "'Urbanist', sans-serif",
            }}
          >
            {CATEGORIES.filter(c => c.id !== "all").map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: ASH }} />
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className="relative rounded-2xl flex flex-col items-center justify-center gap-4 py-12 cursor-pointer transition-all"
        style={{
          border: `2px dashed ${dragging ? AQUA : BORDER}`,
          background: dragging ? "rgba(0,234,211,0.04)" : SECTION_BG,
        }}
      >
        <input ref={inputRef} type="file" multiple className="hidden" onChange={handleFiles} />
        {uploading ? (
          <>
            <RefreshCw size={36} className="animate-spin" style={{ color: AQUA }} />
            <p className="text-sm font-semibold" style={{ color: AQUA, fontFamily: "'Urbanist', sans-serif" }}>Uploading…</p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "#111", border: `1px solid ${BORDER}` }}>
              <Upload size={24} style={{ color: AQUA }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold mb-1" style={{ color: WHITE, fontFamily: "'Urbanist', sans-serif" }}>
                Drop files here or <span style={{ color: AQUA }}>click to browse</span>
              </p>
              <p className="text-xs" style={{ color: ASH, fontFamily: "'GeneralSans', sans-serif" }}>
                PDFs, images, documents, spreadsheets — any file type supported
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── File Card ─────────────────────────────────────────────────────────────────
type FileItem = {
  id: number;
  name: string;
  originalName: string;
  fileKey: string;
  url: string;
  mimeType: string;
  size: number;
  category: string;
  uploadedAt: Date;
};

function FileCard({
  file,
  onDelete,
  onPreview,
}: {
  file: FileItem;
  onDelete: (id: number) => void;
  onPreview: (file: FileItem) => void;
}) {
  const [hover, setHover] = useState(false);
  const isImage = file.mimeType.startsWith("image/");
  const isPdf = file.mimeType === "application/pdf";
  const canPreview = isImage || isPdf;

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3 transition-all"
      style={{
        background: hover ? "#111" : CARD_BG,
        border: `1px solid ${hover ? AQUA : BORDER}`,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Icon + type badge */}
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#1a1a1a" }}>
          {getFileIcon(file.mimeType)}
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#1a1a1a", color: AQUA, fontFamily: "'GeneralSans', sans-serif" }}>
          {getMimeLabel(file.mimeType)}
        </span>
      </div>

      {/* Name */}
      <div>
        <p className="text-sm font-bold text-white leading-tight truncate" style={{ fontFamily: "'Urbanist', sans-serif" }} title={file.name}>
          {file.name}
        </p>
        <p className="text-xs mt-0.5 truncate" style={{ color: ASH, fontFamily: "'GeneralSans', sans-serif" }} title={file.originalName}>
          {file.originalName}
        </p>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between text-xs" style={{ color: ASH, fontFamily: "'GeneralSans', sans-serif" }}>
        <span>{formatBytes(file.size)}</span>
        <span className="px-2 py-0.5 rounded-full" style={{ background: "#1a1a1a", color: ASH }}>{file.category}</span>
      </div>
      <p className="text-xs" style={{ color: "#555", fontFamily: "'GeneralSans', sans-serif" }}>
        {formatDate(file.uploadedAt)}
      </p>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        {canPreview && (
          <button
            onClick={() => onPreview(file)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg transition-all"
            style={{ background: "#1a1a1a", color: WHITE, border: `1px solid ${BORDER}`, fontFamily: "'Urbanist', sans-serif" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = AQUA; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = BORDER; }}
          >
            <Eye size={13} /> Preview
          </button>
        )}
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg transition-all"
          style={{ background: "#1a1a1a", color: WHITE, border: `1px solid ${BORDER}`, fontFamily: "'Urbanist', sans-serif", textDecoration: "none" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = AQUA; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = BORDER; }}
        >
          <Download size={13} /> Open
        </a>
        <button
          onClick={() => onDelete(file.id)}
          className="w-9 h-9 flex items-center justify-center rounded-lg transition-all"
          style={{ background: "#1a1a1a", border: `1px solid ${BORDER}` }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#ef4444"; (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = BORDER; (e.currentTarget as HTMLButtonElement).style.color = ASH; }}
          title="Delete file"
        >
          <Trash2 size={14} style={{ color: "inherit" }} />
        </button>
      </div>
    </div>
  );
}

// ── Preview Modal ─────────────────────────────────────────────────────────────
function PreviewModal({ file, onClose }: { file: { name: string; url: string; mimeType: string } | null; onClose: () => void }) {
  if (!file) return null;
  const isImage = file.mimeType.startsWith("image/");
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)" }}
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
        style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <p className="text-sm font-bold text-white truncate" style={{ fontFamily: "'Urbanist', sans-serif" }}>{file.name}</p>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg transition-all" style={{ background: "#1a1a1a" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#2a2a2a"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#1a1a1a"; }}>
            <X size={15} style={{ color: ASH }} />
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center" style={{ minHeight: 300 }}>
          {isImage ? (
            <img src={file.url} alt={file.name} className="max-w-full max-h-[70vh] object-contain rounded-lg" />
          ) : (
            <iframe src={file.url} title={file.name} className="w-full rounded-lg" style={{ height: "70vh", border: "none" }} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main FileStorage Page ─────────────────────────────────────────────────────
export default function FileStorage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const utils = trpc.useUtils();

  const { data: allFiles = [], isLoading, refetch } = trpc.files.list.useQuery(
    { category: activeCategory },
    { refetchOnWindowFocus: false }
  );

  const uploadMutation = trpc.files.upload.useMutation({
    onSuccess: () => {
      utils.files.list.invalidate();
      toast.success("File uploaded successfully");
    },
    onError: (err) => toast.error(`Upload failed: ${err.message}`),
  });

  const deleteMutation = trpc.files.delete.useMutation({
    onSuccess: () => {
      utils.files.list.invalidate();
      toast.success("File deleted");
    },
    onError: (err) => toast.error(`Delete failed: ${err.message}`),
  });

  const handleUpload = async (fileList: File[], category: string) => {
    setUploading(true);
    try {
      for (const file of fileList) {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
        );
        await uploadMutation.mutateAsync({
          name: file.name,
          originalName: file.name,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
          category,
          dataBase64: base64,
        });
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Remove this file from storage?")) return;
    deleteMutation.mutate({ id });
  };

  // Filter by search
  const filtered = allFiles.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.originalName.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const totalSize = allFiles.reduce((s, f) => s + f.size, 0);
  const totalFiles = allFiles.length;

  return (
    <div className="min-h-screen" style={{ background: "#000000" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 px-6 py-4 flex items-center gap-4"
        style={{ background: "rgba(0,0,0,0.96)", borderBottom: `1px solid ${BORDER}`, backdropFilter: "blur(16px)" }}>
        <img src="/manus-storage/LightningEnergy_Logo_Icon_Aqua_d7ae55bd.png" alt="Lightning Energy Logo" className="w-10 h-10 object-contain" />
        <div>
          <h1 className="text-xl font-extrabold leading-none" style={{ color: AQUA, fontFamily: "'NextSphere', sans-serif" }}>
            Lightning Energy
          </h1>
          <p className="text-xs" style={{ color: ASH, fontFamily: "'Urbanist', sans-serif" }}>File Storage Manager</p>
        </div>
        <nav className="ml-auto flex items-center gap-2">
          <a href="/" className="text-xs font-semibold px-4 py-2 rounded-full transition-all"
            style={{ color: WHITE, fontFamily: "'Urbanist', sans-serif", background: "#111", border: `1px solid ${BORDER}` }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = AQUA; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = BORDER; }}>
            Battery Systems
          </a>
          <a href="/files" className="text-xs font-semibold px-4 py-2 rounded-full"
            style={{ color: "#000", fontFamily: "'Urbanist', sans-serif", background: AQUA }}>
            File Storage
          </a>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* Page title */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-1 h-8 rounded-full" style={{ background: AQUA }} />
            <h2 className="text-3xl font-extrabold uppercase tracking-wider" style={{ fontFamily: "'NextSphere', sans-serif", color: AQUA }}>
              File Storage
            </h2>
          </div>
          <p className="text-sm ml-5" style={{ color: ASH, fontFamily: "'GeneralSans', sans-serif" }}>
            Upload, organise, and access all Lightning Energy files — datasheets, proposals, contracts, images, and more.
          </p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: <FolderOpen size={16} style={{ color: AQUA }} />, label: "Total Files", value: String(totalFiles) },
            { icon: <HardDrive size={16} style={{ color: AQUA }} />, label: "Total Size", value: formatBytes(totalSize) },
            { icon: <FileText size={16} style={{ color: AQUA }} />, label: "Categories", value: String(CATEGORIES.length - 1) },
            { icon: <Upload size={16} style={{ color: AQUA }} />, label: "Last Upload", value: allFiles[0] ? formatDate(allFiles[0].uploadedAt).split(",")[0] : "—" },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#1a1a1a" }}>{icon}</div>
              <div>
                <p className="text-xs" style={{ color: ASH, fontFamily: "'GeneralSans', sans-serif" }}>{label}</p>
                <p className="text-sm font-bold" style={{ color: WHITE, fontFamily: "'GeneralSans', sans-serif" }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Upload zone */}
        <div className="rounded-2xl p-6 mb-8" style={{ background: SECTION_BG, border: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-3 mb-5">
            <Upload size={18} style={{ color: AQUA }} />
            <h3 className="text-lg font-extrabold" style={{ color: WHITE, fontFamily: "'NextSphere', sans-serif" }}>Upload Files</h3>
          </div>
          <UploadZone onUpload={handleUpload} uploading={uploading} selectedCategory={activeCategory} />
        </div>

        {/* File library */}
        <div className="rounded-2xl p-6" style={{ background: SECTION_BG, border: `1px solid ${BORDER}` }}>
          {/* Library header */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <FolderOpen size={18} style={{ color: AQUA }} />
              <h3 className="text-lg font-extrabold" style={{ color: WHITE, fontFamily: "'NextSphere', sans-serif" }}>File Library</h3>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "#1a1a1a", color: AQUA, fontFamily: "'GeneralSans', sans-serif" }}>
                {filtered.length}
              </span>
            </div>
            {/* Search */}
            <div className="relative md:ml-auto">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: ASH }} />
              <input
                type="text"
                placeholder="Search files…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm rounded-lg w-full md:w-64"
                style={{
                  background: CARD_BG, border: `1px solid ${BORDER}`,
                  color: WHITE, fontFamily: "'GeneralSans', sans-serif",
                  outline: "none",
                }}
                onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = AQUA; }}
                onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = BORDER; }}
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X size={13} style={{ color: ASH }} />
                </button>
              )}
            </div>
            <button onClick={() => refetch()} className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg transition-all"
              style={{ background: CARD_BG, border: `1px solid ${BORDER}`, color: ASH, fontFamily: "'Urbanist', sans-serif" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = AQUA; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = BORDER; }}>
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className="le-tab"
                style={activeCategory === c.id ? {
                  background: AQUA, color: "#000", borderColor: AQUA,
                  fontFamily: "'Urbanist', sans-serif", fontWeight: 700,
                } : {
                  background: "transparent", color: ASH, borderColor: BORDER,
                  fontFamily: "'Urbanist', sans-serif",
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* File grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw size={28} className="animate-spin" style={{ color: AQUA }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "#111", border: `1px solid ${BORDER}` }}>
                <FolderOpen size={28} style={{ color: ASH }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: ASH, fontFamily: "'Urbanist', sans-serif" }}>
                {search ? "No files match your search" : "No files in this category yet"}
              </p>
              <p className="text-xs" style={{ color: "#444", fontFamily: "'GeneralSans', sans-serif" }}>
                Use the upload zone above to add files
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onDelete={handleDelete}
                  onPreview={(f) => setPreviewFile(f)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 text-center mt-16" style={{ borderTop: `1px solid ${BORDER}`, background: "#000" }}>
        <p className="text-xs" style={{ color: "#333", fontFamily: "'GeneralSans', sans-serif" }}>
          COPYRIGHT Lightning Energy — Architect George Fotopoulos
        </p>
      </footer>

      {/* Preview modal */}
      <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  );
}
