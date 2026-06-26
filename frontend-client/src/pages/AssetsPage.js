import { useEffect, useState } from "react";
import { uploadAsset, getAssets, deleteAsset } from "../services/api";
import "../styles/assets.css";
import { getPlaylists, addAssetsToPlaylist } from "../services/api";

export default function AssetsPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [view, setView] = useState("grid");
  const [assets, setAssets] = useState([]);
  const [selected, setSelected] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadText, setUploadText] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("new");
  const [previewAsset, setPreviewAsset] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [playlists, setPlaylists] = useState([]);
  const [toast, setToast] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [expandedRow, setExpandedRow] = useState(null); // NEW: Track expanded row

  // Theme toggle effect
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  useEffect(() => {
    if (!user?.userId) return;
    getPlaylists(user.userId).then(setPlaylists);
  }, []);

  /* ---------------- LOAD ASSETS ---------------- */
  const loadAssets = async () => {
    const data = await getAssets(user.userId);
    setAssets(data);
  };

  useEffect(() => {
    if (!files.length) {
      setPreviews([]);
      return;
    }

    const urls = files.map(file => ({
      name: file.name,
      type: file.type.startsWith("image") ? "image" : "video",
      url: URL.createObjectURL(file)
    }));

    setPreviews(urls);

    return () => {
      urls.forEach(p => URL.revokeObjectURL(p.url));
    };
  }, [files]);

  useEffect(() => {
    loadAssets();
  }, []);

  /* ---------------- TOAST ---------------- */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  };

  const handleAssignToPlaylist = async (assetId, playlistId) => {
    if (!playlistId) return;

    try {
      await addAssetsToPlaylist(playlistId, [assetId]);
      showToast("Asset assigned to playlist");
    } catch (err) {
      showToast("Already assigned or failed", "error");
    }
  };

  /* ---------------- UPLOAD ---------------- */
  const handleUpload = async () => {
    if (!files.length || uploading) return;

    try {
      setUploading(true);
      setProgress(0);

      for (let i = 0; i < files.length; i++) {
        setUploadText(`Uploading ${i + 1} of ${files.length} files...`);
        await uploadAsset(files[i], user.userId, setProgress);
      }

      setUploadText("Upload complete ✅");
      showToast("Assets uploaded successfully");

      setTimeout(() => {
        setShowUpload(false);
        setFiles([]);
        setPreviews([]);
        setProgress(0);
        setUploadText("");
      }, 800);

      loadAssets();

    } catch (err) {
      console.error(err);
      setUploadText("Upload failed ❌");
      showToast("Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (assetId) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;

    try {
      await deleteAsset(assetId);
      showToast("Asset deleted");
      setExpandedRow(null);
      loadAssets();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm("Are you sure you want to delete selected assets?")) return;

    try {
      for (let id of selected) {
        await deleteAsset(id);
      }
      showToast("Assets deleted");
      setSelected([]);
      setEditMode(false);
      loadAssets();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  /* ---------------- FILTERED LIST ---------------- */
  const visibleAssets = assets
    .filter(a =>
      a.file_name.toLowerCase().includes(search.toLowerCase())
    )
    .filter(a =>
      filter === "all" ? true : a.file_type === filter
    )
    .sort((a, b) =>
      sort === "new"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    );

  return (
    <div className="assets-page">
      {/* 🔔 TOAST */}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      {/* 🔹 TOOLBAR */}
      <div className="assets-toolbar">
        {/* SEARCH */}
        <div className="toolbar-search">
          <input
            type="search"
            placeholder="Search assets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* FILTERS */}
        <div className="toolbar-filters">
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>

          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="new">Newest</option>
            <option value="old">Oldest</option>
          </select>

          {/* ACTIONS */}
          <div className="view-toggle">
            <button
              className={view === "grid" ? "active" : ""}
              onClick={() => setView("grid")}
            >
              🔲
            </button>
            <button
              className={view === "list" ? "active" : ""}
              onClick={() => setView("list")}
            >
              📄
            </button>
          </div>

          <button className="edit-button" onClick={() => setEditMode(!editMode)}>
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        <button className="add-asset" onClick={() => setShowUpload(true)}>
          + Add Asset
        </button>
      </div>

      {/* 🔹 EMPTY STATE */}
      {!visibleAssets.length && (
        <div className="empty-state">
          <h2>No assets yet</h2>
          <button className="primary" onClick={() => setShowUpload(true)}>
            ➕ Upload your first asset
          </button>
        </div>
      )}

      {/* ================= GRID VIEW ================= */}
      {view === "grid" && visibleAssets.length > 0 && (
        <div className="assets-grid">
          {visibleAssets.map(a => (
            <div key={a.id} className="asset-card">
              {editMode && (
                <input
                  type="checkbox"
                  checked={selected.includes(a.id)}
                  onChange={() =>
                    setSelected(prev =>
                      prev.includes(a.id)
                        ? prev.filter(i => i !== a.id)
                        : [...prev, a.id]
                    )
                  }
                />
              )}

              <span className={`badge ${a.file_type}`}>
                {a.file_type.toUpperCase()}
              </span>

              {a.file_type === "image" ? (
                <img
                  src={`http://localhost:5000${a.file_path}`}
                  onClick={() => setPreviewAsset(a)}
                  style={{ cursor: "pointer" }}
                  alt={a.file_name}
                />
              ) : (
                <video
                  src={`http://localhost:5000${a.file_path}`}
                  muted
                  onClick={() => setPreviewAsset(a)}
                  style={{ cursor: "pointer" }}
                />
              )}

              <select
                className="playlist-select"
                onChange={(e) => handleAssignToPlaylist(a.id, e.target.value)}
              >
                <option value="">Assign to playlist</option>
                {playlists.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* ================= LIST VIEW ================= */}
      {view === "list" && visibleAssets.length > 0 && (
        <div className="assets-table">
          <div className="table-header">
            <span>Asset</span>
            <span>Type</span>
            <span>Date</span>
          </div>

          {visibleAssets.map(a => (
            <div
              key={a.id}
              className={`table-row ${expandedRow === a.id ? "expanded" : ""}`}
              onClick={() => setExpandedRow(expandedRow === a.id ? null : a.id)}
            >
              {/* Main Row */}
              <div className="row-main">
                <div className="asset-cell">
                  {editMode && (
                    <input
                      type="checkbox"
                      checked={selected.includes(a.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        setSelected(prev =>
                          prev.includes(a.id)
                            ? prev.filter(i => i !== a.id)
                            : [...prev, a.id]
                        );
                      }}
                    />
                  )}

                  {a.file_type === "image" ? (
                    <img
                      src={`http://localhost:5000${a.file_path}`}
                      alt={a.file_name}
                    />
                  ) : (
                    <video
                      src={`http://localhost:5000${a.file_path}`}
                      muted
                    />
                  )}
                  <span>{a.file_name}</span>
                </div>

                <span className={`badge ${a.file_type}`}>
                  {a.file_type}
                </span>

                <span>
                  {a.created_at
                    ? new Date(a.created_at).toLocaleDateString()
                    : "--"}
                </span>
              </div>

              {/* Expanded Row */}
              <div className="row-expanded" onClick={(e) => e.stopPropagation()}>
                <select
                  className="playlist-select"
                  onChange={(e) => handleAssignToPlaylist(a.id, e.target.value)}
                >
                  <option value="">Assign to playlist</option>
                  {playlists.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <button
                  className="danger"
                  onClick={() => handleDelete(a.id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 BULK ACTION */}
      {editMode && selected.length > 0 && (
        <div className="bulk-bar">
          <span>{selected.length} selected</span>
          <button className="danger" onClick={handleBulkDelete}>
            Delete
          </button>
        </div>
      )}

      {/* 🔹 UPLOAD MODAL */}
      {showUpload && (
        <div className="modal-backdrop" onClick={() => setShowUpload(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Add Assets</h2>

            <div
              className="drop-zone"
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                setFiles([...e.dataTransfer.files]);
              }}
            >
              Drag & drop files here
            </div>

            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={e => setFiles([...e.target.files])}
            />

            {/* 🔍 LOCAL PREVIEW BEFORE UPLOAD */}
            {previews.length > 0 && (
              <div className="upload-preview-grid">
                {previews.map((p, i) => (
                  <div key={i} className="upload-preview-card">
                    {p.type === "image" ? (
                      <img src={p.url} alt={p.name} />
                    ) : (
                      <video
                        src={p.url}
                        muted
                        playsInline
                        controls
                        preload="metadata"
                      />
                    )}
                    <span>{p.name}</span>
                  </div>
                ))}
              </div>
            )}

            {progress > 0 && (
              <div className="progress">
                <div style={{ width: `${progress}%` }} />
              </div>
            )}

            {uploading && (
              <div className="upload-status">
                <p>{uploadText}</p>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              className="primary"
              disabled={uploading || !files.length}
              onClick={handleUpload}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      )}

      {/* 🔍 ASSET PREVIEW MODAL */}
      {previewAsset && (
        <div
          className="modal-backdrop"
          onClick={() => setPreviewAsset(null)}
        >
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{previewAsset.file_name}</h2>

            {previewAsset.file_type === "image" ? (
              <img
                src={`http://localhost:5000${previewAsset.file_path}`}
                style={{
                  width: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  borderRadius: "8px"
                }}
                alt={previewAsset.file_name}
              />
            ) : (
              <video
                src={`http://localhost:5000${previewAsset.file_path}`}
                controls
                autoPlay
                style={{
                  width: "100%",
                  maxHeight: "70vh",
                  borderRadius: "8px"
                }}
              />
            )}

            <button
              className="primary"
              style={{ marginTop: "16px" }}
              onClick={() => setPreviewAsset(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}