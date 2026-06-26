import { useEffect, useState } from "react";
import "../styles/schedule.css";

function ScheduleCalendar() {
  const user = JSON.parse(localStorage.getItem("user"));
    const [playlists, setPlaylists] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingSchedule, setEditingSchedule] = useState(null);
const [editForm, setEditForm] = useState({
  playlistId: "",
  startTime: "",
  endTime: "",
  repeatType: "once"
});
// eslint-disable-next-line
const loadPlaylists = async () => {
  if (!user?.userId) return;

  const res = await fetch(
    `http://localhost:5000/api/playlists?userId=${user.userId}`
  );
  const data = await res.json();
  setPlaylists(data || []);
};
  /* ================= LOAD SCHEDULES ================= */
  const loadSchedules = async () => {
    if (!user?.userId) return;

    setLoading(true);

    const upcomingRes = await fetch(
        `http://localhost:5000/api/schedules/upcoming?userId=${user.userId}`
      );
    const completedRes = await fetch(
      `http://localhost:5000/api/schedules/completed?userId=${user.userId}`
    );

    const upcomingData = await upcomingRes.json();
    const completedData = await completedRes.json();

    setUpcoming(upcomingData || []);
    setCompleted(completedData || []);
    setLoading(false);
  };

  /* ================= TOGGLE ================= */
  const toggleSchedule = async (id) => {
    await fetch(`http://localhost:5000/api/schedules/${id}/toggle`, {
      method: "PATCH"
    });
    loadSchedules();
  };

  /* ================= DELETE ================= */
  const deleteSchedule = async (id) => {
    if (!window.confirm("Delete schedule?")) return;

    await fetch(`http://localhost:5000/api/schedules/${id}`, {
      method: "DELETE"
    });

    loadSchedules();
  };
const sortedUpcoming = [...upcoming].sort(
  (a, b) => new Date(a.start_time) - new Date(b.start_time)
);
  /* ================= EDIT (PLACEHOLDER) ================= */
const handleEdit = (schedule) => {
  setEditingSchedule(schedule);
  setEditForm({
    playlistId: schedule.playlist_id,
    startTime: schedule.start_time.slice(0, 16),
    endTime: schedule.end_time
      ? schedule.end_time.slice(0, 16)
      : "",
    repeatType: schedule.repeat_type
  });
};
const handleUpdateSchedule = async () => {
  await fetch(
    `http://localhost:5000/api/schedules/${editingSchedule.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playlistId: editForm.playlistId,
        startTime: editForm.startTime,
        endTime: editForm.endTime || null,
        repeatType: editForm.repeatType,
        active: editingSchedule.active
      })
    }
  );

  setEditingSchedule(null);
  loadSchedules();
};
useEffect(() => {
  loadSchedules();

  const interval = setInterval(() => {
    loadSchedules();
  }, 15000); // refresh every 15 seconds

  return () => clearInterval(interval);
}, [user?.userId]);

  if (loading) return <p>Loading schedules…</p>;

  return (
    <div style={{ marginTop: 30 }}>

      {/* ================= UPCOMING ================= */}
<h3 style={{ marginTop: 20 }}>Upcoming Schedules</h3>

{sortedUpcoming.length === 0 ? (
  <div className="no-schedule-placeholder">
    No upcoming schedules
  </div>
) : (
  <div className="players-table-container">
    <table className="players-table">
      <thead>
        <tr>
          <th>Type</th>
          <th>TV / Group</th>
          <th>Playlist</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Repeat</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {sortedUpcoming.map((s) => (
          <tr key={s.id}>
            <td data-label="Type">
              {s.target_type === "group" ? "👥 Group" : "📺 Player"}
            </td>

            <td data-label="TV / Group">
              {s.target_name || "—"}
            </td>

            <td data-label="Playlist">
              {s.playlist_name || s.playlist_id}
            </td>

            <td data-label="Start Time">
              {new Date(s.start_time).toLocaleString()}
            </td>

            <td data-label="End Time">
              {s.end_time
                ? new Date(s.end_time).toLocaleString()
                : "—"}
            </td>

            <td data-label="Repeat">
  <span className={`repeat-badge repeat-${s.repeat_type}`}>
    {s.repeat_type}
  </span>
</td>

            <td data-label="Actions">
              <div className="action-buttons">
                <button
                  className="btn-icon"
                  onClick={() => deleteSchedule(s.id)}
                  title="Delete schedule"
                >
                  🗑
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
      {/* ================= COMPLETED ================= */}
<h3 style={{ marginTop: 40 }}>Completed Schedules</h3>

{completed.length === 0 ? (
  <div className="no-schedule-placeholder">
    No completed schedules
  </div>
) : (
  <div className="players-table-container">
    <table className="players-table">
      <thead>
        <tr>
          <th>Type</th>
          <th>TV / Group</th>
          <th>Playlist</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Last Run</th>
        </tr>
      </thead>

      <tbody>
        {completed.map((s) => (
          <tr key={s.id}>
            <td data-label="Type">
              {s.target_type === "group" ? "👥 Group" : "📺 Player"}
            </td>

            <td data-label="TV / Group">
              {s.target_name || "—"}
            </td>

            <td data-label="Playlist">
              {s.playlist_name || s.playlist_id}
            </td>

            <td data-label="Start Time">
              {new Date(s.start_time).toLocaleString()}
            </td>

            <td data-label="End Time">
              {s.end_time
                ? new Date(s.end_time).toLocaleString()
                : "—"}
            </td>

            <td data-label="Last Run">
              {s.last_run
                ? new Date(s.last_run).toLocaleString()
                : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
      {editingSchedule && (
  <div className="modal-backdrop">
    <div className="modal">
      <h2>Edit Schedule</h2>

      <label>Playlist</label>
<select
  value={editForm.playlistId}
  onChange={(e) =>
    setEditForm({ ...editForm, playlistId: e.target.value })
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
      <input
        type="datetime-local"
        value={editForm.startTime}
        onChange={(e) =>
          setEditForm({ ...editForm, startTime: e.target.value })
        }
      />

      <label>End Time</label>
      <input
        type="datetime-local"
        value={editForm.endTime}
        onChange={(e) =>
          setEditForm({ ...editForm, endTime: e.target.value })
        }
      />

      <label>Repeat</label>
      <select
        value={editForm.repeatType}
        onChange={(e) =>
          setEditForm({ ...editForm, repeatType: e.target.value })
        }
      >
        <option value="once">Once</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>

      <div className="modal-actions">
        <button
          className="secondary"
          onClick={() => setEditingSchedule(null)}
        >
          Cancel
        </button>
        <button
          className="primary"
          onClick={handleUpdateSchedule}
        >
          💾 Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default ScheduleCalendar;