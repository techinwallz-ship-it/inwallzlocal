const BASE_URL = "http://203.101.40.119:5000";
const API = "http://203.101.40.119:5000/api/admin";
/* =========================
   AUTH APIs (ADD THESE)
========================= */

// SIGN UP
export const signupUser = async (username, password) => {
  const res = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  return res.json();
};

// LOGIN
export const loginUser = async (username, password) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  return res.json();
};

/* =========================
   TV PAIRING APIs (KEEP)
========================= */

export const pairDisplay = async (code) => {
  const res = await fetch(`${BASE_URL}/api/display/pair`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ code })
  });

  if (!res.ok) {
    throw new Error("Invalid code");
  }

  return res.json();
};

/* =========================
   MEDIA APIs (KEEP)
========================= */

export const uploadMedia = async (file, displayId, type) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("displayId", displayId);
  formData.append("type", type);

  const res = await fetch(`${BASE_URL}/api/media/upload`, {
    method: "POST",
    body: formData
  });

  return res.json();
};

export const getPlayers = async (userId) => {
  const res = await fetch(
    `${BASE_URL}/api/display/players?userId=${userId}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch players");
  }

  return res.json();
};

export const registerPlayer = async (data) => {
  const res = await fetch(`${BASE_URL}/api/display/register-player`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};
export const unregisterPlayer = async (id) => {
  const res = await fetch(
    `http://203.101.40.119:5000/api/display/unregister/${id}`,
    {
      method: "DELETE"
    }
  );

  return res.json();
};
// 🔹 GET ASSETS (per user)
export const getAssets = async (userId) => {
  const res = await fetch(
    `http://203.101.40.119:5000/api/assets?userId=${userId}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch assets");
  }

  return res.json();
};

// 🔹 UPLOAD ASSET
export const uploadAsset = async (
  file,
  userId,
  setProgress,
  isTemplate = false
) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("userId", userId);
  formData.append("isTemplate", isTemplate ? 1 : 0);

  const res = await fetch(
    "http://203.101.40.119:5000/api/assets/upload",
    {
      method: "POST",
      body: formData
    }
  );

  if (!res.ok) {
    throw new Error("Failed to upload asset");
  }

  return res.json();
};
export const deleteAsset = async (id) => {
  const res = await fetch(`http://203.101.40.119:5000/api/assets/${id}`, {
    method: "DELETE"
  });
  return res.json();
};

/* =========================
   PLAYLIST APIs (ADD)
========================= */

// GET PLAYLISTS BY USER
export const getPlaylists = async (userId) => {
  const res = await fetch(
    `${BASE_URL}/api/playlists?userId=${userId}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch playlists");
  }

  return res.json();
};


// CREATE PLAYLIST
export const createPlaylist = async (name, userId) => {
  const res = await fetch(`${BASE_URL}/api/playlists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, userId })
  });

  return res.json();
};

// GET ASSETS IN PLAYLIST
export const getPlaylistAssets = async (playlistId) => {
  const res = await fetch(
    `${BASE_URL}/api/playlists/${playlistId}/assets`
  );
  return res.json();
};

// ADD ASSETS TO PLAYLIST
export const addAssetsToPlaylist = async (playlistId, assetIds) => {
  const res = await fetch(
    `${BASE_URL}/api/playlists/${playlistId}/assets`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ assetIds })
    }
  );

  return res.json();
};

// REMOVE ASSET FROM PLAYLIST
export const removeAssetFromPlaylist = async (playlistId, assetId) => {
  const res = await fetch(
    `${BASE_URL}/api/playlists/${playlistId}/assets/${assetId}`,
    { method: "DELETE" }
  );
  return res.json();
};

// DELETE PLAYLIST
export const deletePlaylist = async (playlistId) => {
  const res = await fetch(
    `${BASE_URL}/api/playlists/${playlistId}`,
    { method: "DELETE" }
  );
  return res.json();
};

export const updatePlaylistAsset = async (
  playlistId,
  assetId,
  duration,
  sort_order
) => {
  const res = await fetch(
    `${BASE_URL}/api/playlists/${playlistId}/assets/${assetId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ duration, sort_order })
    }
  );
  return res.json();
};

export const savePlaylistOrder = async (playlistId, orderedIds) => {
  const res = await fetch(
    `http://203.101.40.119:5000/api/playlists/${playlistId}/order`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds })
    }
  );

  return res.json();
};

export const saveAssetDuration = (playlistId, assetId, duration) =>
  fetch(`http://203.101.40.119:5000/api/playlists/${playlistId}/assets/${assetId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ duration })
  });


export const saveTickerConfig = async (playlistId, tickerConfig) => {
  const res = await fetch(
    `http://203.101.40.119:5000/api/playlists/${playlistId}/ticker`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tickerConfig })
    }
  );
  return res.json();
};

export const savePlaylistLayout = (playlistId, layout) =>
  fetch(`${BASE_URL}/api/playlists/${playlistId}/layout`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ layout })
  }).then(res => res.json());


export const removePlayerFromGroup = (groupId, displayId) =>
  fetch(`${BASE_URL}/api/groups/${groupId}/players/${displayId}`, {
    method: "DELETE"
  });

export const addPlaylistToGroup = (groupId, playlistId) =>
  fetch(`${BASE_URL}/api/groups/${groupId}/playlists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playlistId })
  });

export const removePlaylistFromGroup = (groupId, playlistId) =>
  fetch(`${BASE_URL}/api/groups/${groupId}/playlists/${playlistId}`, {
    method: "DELETE"
  });

  export const getDashboardStats = async (userId) => {
  const res = await fetch(
    `http://203.101.40.119:5000/api/display/dashboard-stats?userId=${userId}`
  );

  if (!res.ok) {
    throw new Error("Failed to load dashboard stats");
  }

  return res.json();
};

  // GROUPS
export const getGroups = async (userId) => {
  const res = await fetch(
    `http://203.101.40.119:5000/api/groups?userId=${userId}`
  );
  return res.json();
};

export const createGroup = async (name, userId) => {
  const res = await fetch("http://203.101.40.119:5000/api/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, userId })
  });
  return res.json();
};

export const addPlayerToGroup = async (groupId, displayId) => {
  const res = await fetch(
    `http://203.101.40.119:5000/api/groups/${groupId}/players`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayId })
    }
  );
  return res.json();
};

export const runGroup = async (groupId, playlistId) => {
  return fetch(
    `http://203.101.40.119:5000/api/groups/${groupId}/run`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playlistId })
    }
  );
};
export const deleteGroup = async (groupId) => {
  const res = await fetch(
    `http://203.101.40.119:5000/api/groups/${groupId}`,
    { method: "DELETE" }
  );

  if (!res.ok) throw new Error("Failed to delete group");
  return res.json();
};



export const adminLogin = async (username, password) => {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
};

export const getPlaylistStats = async (playlistId) => {
  const res = await fetch(
    `http://203.101.40.119:5000/api/playlists/${playlistId}/stats`
  );
  return res.json();
};

/* =========================
   ADMIN DASHBOARD STATS
========================= */

export const getAdminDashboardStats = async () => {
  const res = await fetch(
    `${API}/users/dashboard`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
      }
    }
  );

  if (!res.ok) {
    throw new Error("Failed to load admin dashboard stats");
  }

  return res.json();
};

export const saveOverlayText = async (
  playlistId,
  assetId,
  overlayText
) => {
  const res = await fetch(
    `${BASE_URL}/api/playlists/${playlistId}/assets/${assetId}/overlay`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        overlay_text: overlayText
      })
    }
  );

  if (!res.ok) {
    throw new Error("Failed to save overlay text");
  }

  return res.json();
};