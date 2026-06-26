import { useEffect, useState, Fragment } from "react";
import {
  getGroups,
  createGroup,
  addPlayerToGroup,
  removePlayerFromGroup,
  runGroup,
  getPlayers,
  getPlaylists,
  deleteGroup
} from "../services/api";
import "../styles/dashboard.css";
import { FiCalendar } from "react-icons/fi";

function GroupsPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [groups, setGroups] = useState([]);
  const [players, setPlayers] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  const [groupName, setGroupName] = useState("");
  const [activeGroup, setActiveGroup] = useState(null);

  /* RUN MODAL */
  const [showRunModal, setShowRunModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");

  const [loading, setLoading] = useState(true);
const [pageError, setPageError] = useState("");
const [scheduleError, setScheduleError] = useState("");  const [search, setSearch] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleData, setScheduleData] = useState({
  playlistId: "",
  startTime: "",
  endTime: "",
  repeat: "once" // once | daily | weekly
});
  /* LOAD DATA */
  useEffect(() => {
    if (!user?.userId) return;

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const [g, p, pl] = await Promise.all([
          getGroups(user.userId),
          getPlayers(user.userId),
          getPlaylists(user.userId)
        ]);

        if (!cancelled) {
          setGroups(g || []);
          setPlayers(p || []);
          setPlaylists(pl || []);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setPageError("Failed to load groups");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => (cancelled = true);
  }, [user?.userId]);

  /* CREATE GROUP */
  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;
    await createGroup(groupName, user.userId);
    setGroupName("");
    setGroups(await getGroups(user.userId));
  };

  /* DELETE GROUP */
  const handleDeleteGroup = async (group) => {
    if (!window.confirm(`Delete group "${group.name}" permanently?`)) return;
    await deleteGroup(group.id);
    alert("Group deleted");
    setGroups(await getGroups(user.userId));
  };

  /* RUN GROUP */
  const handleRunGroup = async () => {
    if (!selectedGroup || !selectedPlaylist) {
      alert("Select a playlist");
      return;
    }

    await runGroup(selectedGroup.id, selectedPlaylist);
    alert("Playlist running on group");

    setShowRunModal(false);
    setSelectedGroup(null);
    setSelectedPlaylist("");
  };
/* ================= SAVE SCHEDULE ================= */
const handleSaveSchedule = async () => {
  if (!selectedGroup || !scheduleData.playlistId || !scheduleData.startTime) {
    alert("Playlist and start time required");
    return;
  }
if (scheduleError) {   // 🔥 ADD THIS
    alert(scheduleError);
    return;
  }

  await fetch("http://localhost:5000/api/schedules", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
  userId: user.userId,
  targetType: "group",
  targetId: selectedGroup.id,
  playlistId: scheduleData.playlistId,
  startTime: scheduleData.startTime,
  endTime: scheduleData.endTime || null,
  repeatType: scheduleData.repeat
})
  });

  alert("Schedule saved");

  setShowScheduleModal(false);
    setScheduleError(""); // 🔥 ADD THIS

  setScheduleData({
    playlistId: "",
    startTime: "",
    endTime: "",
    repeat: "once"
  });
};
  /* ================= EDIT VIEW ================= */
  if (loading) return <p>Loading groups…</p>;
  if (pageError) return <p style={{ color: "red" }}>{pageError}</p>;

  if (activeGroup) {
    const filteredPlayers = players.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

    const selectedIds = activeGroup.players.map((p) => p.id);

    const selectAll = async () => {
      for (const p of filteredPlayers) {
        if (!selectedIds.includes(p.id)) {
          await addPlayerToGroup(activeGroup.id, p.id);
        }
      }
      const updated = await getGroups(user.userId);
      setGroups(updated);
      setActiveGroup(updated.find((g) => g.id === activeGroup.id));
    };

    const clearAll = async () => {
      for (const p of activeGroup.players) {
        await removePlayerFromGroup(activeGroup.id, p.id);
      }
      const updated = await getGroups(user.userId);
      setGroups(updated);
      setActiveGroup(updated.find((g) => g.id === activeGroup.id));
    };

    return (
      <div>
        <h1>Manage TVs – {activeGroup.name}</h1>

        <button onClick={() => setActiveGroup(null)}>← Back to Groups</button>

        <div style={{ margin: "15px 0" }}>
          <input
            placeholder="Search TVs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "300px", padding: "6px" }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <button onClick={selectAll}>Select All</button>
          <button style={{ marginLeft: 10 }} onClick={clearAll}>
            Clear All
          </button>
        </div>

<div className="players-table-container">
  <table className="players-table">
              <thead>
            <tr>
              <th>TV Name</th>
              <th>Status</th>
              <th>Included</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((p) => {
              const checked = activeGroup.players.some(
                (gp) => Number(gp.id) === Number(p.id)
              );

              return (
                <tr key={p.id}>
                  <td data-label="TV Name">{p.name}</td>
                  <td data-label="Status">
                    <span className={p.online ? "status-online" : "status-offline"}>
                      ● {p.online ? "Online" : "Offline"}
                    </span>
                  </td>
                  <td data-label="Included">

                    <input 
                      type="checkbox"
                      checked={checked}
                      onChange={async () => {
                        if (checked) {
                          await removePlayerFromGroup(activeGroup.id, p.id);
                        } else {
                          await addPlayerToGroup(activeGroup.id, p.id);
                        }

                        const updated = await getGroups(user.userId);
                        setGroups(updated);
                        setActiveGroup(
                          updated.find((g) => g.id === activeGroup.id)
                        );
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
</div>
      </div>
    );
  }

  /* ================= GROUP LIST ================= */
  return (
    <div>
      <h3 className="section-title">Groups</h3>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="New group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <button style={{ marginLeft: 10 }} onClick={handleCreateGroup}>
          Create Group
        </button>
      </div>

      <div className="players-table-container">
  <table className="players-table">
        <thead>
          <tr>
            <th>Group</th>
            <th>TVs</th>
            <th>Actions</th>
            <th>Manage</th>
          </tr>
        </thead>

        <tbody>
          {groups.map((g) => (
            <Fragment key={g.id}>
              <tr>
                <td data-label="Group">{g.name}</td>
                <td data-label="TVs">{g.players.length}</td>
                <td data-label="Actions">
                    <div className="action-buttons">
                  <button
                  className="btn-icon"
                    onClick={() => {
                      setSelectedGroup(g);
                        setPageError(""); // 🔥 ADD THIS

                      setShowRunModal(true);
                    }}
                  >
                    ▶ 
                  </button>
                  {/* 🕒 NEW */}
    <button
    className="btn-icon"
      onClick={() => {
        setSelectedGroup(g);
      setScheduleError(""); // 🔥 ADD THIS

        setShowScheduleModal(true);
      }}
    >
      🕒 
    </button>
    </div>
                </td>
                <td>
                  <button onClick={() => setActiveGroup(g)}>Edit</button>
                  <button
                    onClick={() => handleDeleteGroup(g)}
                    style={{ color: "red", marginLeft: 10 }}
                  >
                    🗑 
                  </button>
                </td>
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>
</div>

      {/* RUN MODAL */}
      {showRunModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Run Playlist on {selectedGroup?.name}</h2>

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
              <button className="primary" onClick={handleRunGroup}>
                ▶ Run
              </button>
            </div>
          </div>
        </div>
      )}
    {/* ================= SCHEDULE GROUP MODAL ================= */}
{showScheduleModal && (
  <div className="modal-backdrop">
    <div className="modal">
      <h2>Schedule Playlist for {selectedGroup?.name}</h2>

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
      setScheduleError("End time must be after start time");
    } else {
      setScheduleError("");
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
    setScheduleError("End time must be after start time");
  } else {
    setScheduleError("");
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
{scheduleError && (
  <div className="error-text">
    {scheduleError}
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
  setScheduleError(""); // 🔥 important
}}          
        >
          Cancel
        </button>
        <button className="primary" onClick={handleSaveSchedule}>
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}


export default GroupsPage;