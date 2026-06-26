import { useEffect, useState, useCallback } from "react";
import {
  getPlayers,
  registerPlayer,
  unregisterPlayer,
  getPlaylists
} from "../services/api";
import socket from "../services/socket";
import "../styles/dashboard.css";
import { FiCalendar } from "react-icons/fi";

function PlayersPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [players, setPlayers] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showRunModal, setShowRunModal] = useState(false);

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    pairingCode: "",
    name: "",
    timezone: "Asia/Calcutta",
    group: "default",
    location: ""
  });

  const [showScheduleModal, setShowScheduleModal] = useState(false);

const [scheduleData, setScheduleData] = useState({
  playlistId: "",
  startTime: "",
  endTime: "",
  repeat: "once"
});

  /* ================= LOAD PLAYERS ================= */
  const loadPlayers = useCallback(async () => {
    if (!user) return;
    const data = await getPlayers(user.userId);
    setPlayers(data);
  }, [user]);

  /* ================= LOAD PLAYLISTS ================= */
  const loadPlaylists = useCallback(async () => {
    if (!user) return;
    const data = await getPlaylists(user.userId);
    setPlaylists(data);
  }, [user]);

 useEffect(() => {
  if (!user?.userId) return;

  loadPlayers();
  loadPlaylists();
}, [user?.userId]);
useEffect(() => {
  if (!user?.userId) return;

  const interval = setInterval(() => {
    loadPlayers();
  }, 5000); // refresh every 5 seconds

  return () => clearInterval(interval);
}, [user?.userId, loadPlayers]);

  /* ================= REGISTER PLAYER ================= */
  const handleRegister = async () => {
  // 🔍 Check if pairing code already exists & paired
  const existingPlayer = players.find(
    (p) => p.pairing_code === form.pairingCode
  );

  if (existingPlayer && existingPlayer.is_paired === 1) {
    alert("❌ Player already registered with this pairing code");
    return;
  }

  const payload = {
    ...form,
    userId: user.userId
  };

  const res = await registerPlayer(payload);
  alert(res.message);

  setShowRegisterModal(false);
  setForm({
    pairingCode: "",
    name: "",
    timezone: "Asia/Calcutta",
    group: "default",
    location: ""
  });

  loadPlayers();
};
const formatLastSeen = (lastSeen, online) => {
  if (!lastSeen) return "Never";
  if (online) return "Just now";

  const diffMs = Date.now() - new Date(lastSeen).getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 60) {
    return `${diffMin} min ago`;
  }

  const diffHr = Math.floor(diffMin / 60);
  const remMin = diffMin % 60;

  if (diffHr < 24) {
    return `${diffHr} hr${diffHr > 1 ? "s" : ""} ${remMin} min ago`;
  }

  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

  /* ================= RUN PLAYLIST ================= */
  const handleRunPlaylist = () => {
    if (!selectedPlayer || !selectedPlaylist) {
      alert("Select a playlist");
      return;
    }

    socket.emit("play-playlist", {
      pairingCode: selectedPlayer.pairing_code,
      playlistId: selectedPlaylist
    });

    alert("Playlist sent to TV");
    loadPlayers();
    setShowRunModal(false);
    setSelectedPlaylist("");
    setSelectedPlayer(null);
  };
const handleSavePlayerSchedule = async () => {
  if (!selectedPlayer || !scheduleData.playlistId || !scheduleData.startTime) {
    alert("Playlist and start time required");
    return;
  }
  if (error) {
  alert(error); // cleaner message
  return;
}
  await fetch("http://203.101.40.119:5000/api/schedules", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user.userId,
      targetType: "player",
      targetId: selectedPlayer.id,
      playlistId: scheduleData.playlistId,
      startTime: scheduleData.startTime,
      endTime: scheduleData.endTime || null,
      repeatType: scheduleData.repeat
    })
  });

  alert("Player schedule saved");

  setShowScheduleModal(false);
  setScheduleData({
    playlistId: "",
    startTime: "",
    endTime: "",
    repeat: "once"
  });
};
  /* ================= UNREGISTER ================= */
  const handleUnregister = async (id) => {
    if (!window.confirm("Unregister this player?")) return;
    const res = await unregisterPlayer(id);
    alert(res.message);
    loadPlayers();
  };

  return (
    <div>
      <div className="section-header">
        <h3 className="section-title">Registered Players</h3>
        <button onClick={() => setShowRegisterModal(true)}>
          Register a Player
        </button>
      </div>

      {/* ================= PLAYERS TABLE ================= */}
<div className="players-table-container">
  <table className="players-table">
            <thead>
          <tr>
            <th>Name</th>
            <th>Pairing Code</th>
            <th>Location</th>
            <th>Group</th>
            <th>Current Playlist</th>
            <th>Status</th>
            <th>Last Seen</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {players.length === 0 ? (
            <tr>
              <td colSpan="8" align="center">
                No players registered yet
              </td>
            </tr>
          ) : (
            players.map((p) => (
              <tr key={p.id}>
                <td data-label="Name">{p.name}</td>
<td data-label="Pairing Code">{p.pairing_code}</td>
<td data-label="Location">{p.location || "-"}</td>
<td data-label="Group">{p.group_name || "-"}</td>
<td data-label="Current Playlist">{p.current_playlist_name ? p.current_playlist_name : "—"}</td>
<td data-label="Status">
  <span
    style={{
      color: p.online ? "limegreen" : "red",
      fontWeight: "bold"
    }}
  >
    ●
  </span>
  &nbsp;
  {p.online ? "Online" : "Offline"}
</td>
<td data-label="Last Seen">{formatLastSeen(p.last_seen, p.online)}</td>
              <td data-label="Actions">
                  <div className="action-buttons">

                  <button className="btn-icon"
                    onClick={() => {
                      setSelectedPlayer(p);
                      setError(""); // 🔥 clear old error

                      setShowRunModal(true);
                    }}
                  >
                    ▶
                  </button>
                  <button className="btn-icon"
    onClick={() => {
      setSelectedPlayer(p);
      setError(""); // 🔥 clear old error

      setShowScheduleModal(true);
    }}
  >
    🕒
  </button>
                  <button className="btn-icon" onClick={() => handleUnregister(p.id)}>
                    🗑️
                  </button>
                    </div>

                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
</div>

      {/* ================= REGISTER MODAL ================= */}
      {showRegisterModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Register New Player</h2>

            <label>TV Pairing Code</label>
            <input
              value={form.pairingCode}
              onChange={(e) =>
                setForm({ ...form, pairingCode: e.target.value })
              }
            />

            <label>Player Name</label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
  <label>Location</label>
<input
  value={form.location}
  onChange={(e) =>
    setForm({ ...form, location: e.target.value })
  }
  placeholder="e.g. Reception, Floor 2, Lobby"
/>
            <div className="modal-actions">
              <button
                className="secondary"
                onClick={() => setShowRegisterModal(false)}
              >
                Cancel
              </button>
              <button className="primary" onClick={handleRegister}>
                Register
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= RUN PLAYLIST MODAL ================= */}
      {showRunModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Run Playlist on {selectedPlayer?.name}</h2>

            <select
              value={selectedPlaylist}
              onChange={(e) => setSelectedPlaylist(e.target.value)}
            >
              <option value="">Select Playlist</option>
              {playlists.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button
                className="secondary"
                onClick={() => setShowRunModal(false)}
              >
                Cancel
              </button>
              <button className="primary" onClick={handleRunPlaylist}>
                ▶️ Run
              </button>
            </div>
          </div>
        </div>
      )}
      {showScheduleModal && (
  <div className="modal-backdrop">
    <div className="modal">
      <h2>Schedule Playlist for {selectedPlayer?.name}</h2>

      <label>Playlist</label>
      <select
        value={scheduleData.playlistId}
        onChange={(e) =>
          setScheduleData({ ...scheduleData, playlistId: e.target.value })
        }
      >
        <option value="">Select Playlist</option>
        {playlists.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <label>Start Time</label>
      <div className="input-group">
      <input
        type="datetime-local"
        value={scheduleData.startTime}
        onFocus={(e) => e.target.showPicker?.()}   // 🔥 AUTO OPEN
       onChange={(e) => {
    const value = e.target.value;

    // 🔥 revalidate end time when start changes
    if (
      scheduleData.endTime &&
      new Date(scheduleData.endTime) < new Date(value)
    ) {
      setError("End time must be after start time");
    } else {
      setError("");
    }

    setScheduleData({ ...scheduleData, startTime: value });
  }}
      />
       <span
  className="input-icon"
  onClick={(e) => {
    const input = e.currentTarget.parentElement.querySelector("input");
    input?.showPicker?.(); // 🔥 opens native calendar
  }}
>
  <FiCalendar />
</span>
</div>
      <label>End Time (optional)</label>
      <div className="input-group">

      <input
        type="datetime-local"
        value={scheduleData.endTime}
        min={scheduleData.startTime || undefined} 
        onFocus={(e) => e.target.showPicker?.()}   // 🔥 AUTO OPEN
        onChange={(e) => {
  const value = e.target.value;

  if (
    scheduleData.startTime &&
    value &&
    new Date(value) < new Date(scheduleData.startTime)
  ) {
    setError("End time must be after start time");
  } else {
    setError("");
  }

  setScheduleData({ ...scheduleData, endTime: value });
}}
      />
      <span
  className="input-icon"
  onClick={(e) => {
    const input = e.currentTarget.parentElement.querySelector("input");
    input?.showPicker?.(); // 🔥 opens native calendar
  }}
>
  <FiCalendar />
</span>
</div>
{error && (
  <div className="error-text">
    {error}
  </div>
)}

      <label>Repeat</label>
      <select
        value={scheduleData.repeat}
        onChange={(e) =>
          setScheduleData({ ...scheduleData, repeat: e.target.value })
        }
      >
        <option value="once">Once</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>

      <div className="modal-actions">
        <button
          className="secondary"
          onClick={() => {
    setShowScheduleModal(false);
    setError(""); // 🔥 ADD THIS
  }}
        >
          Cancel
        </button>
        <button className="primary" onClick={handleSavePlayerSchedule}>
          💾 Save Schedule
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default PlayersPage;