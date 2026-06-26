import { useEffect, useState } from "react";

function AdminPlayers() {

  const [players, setPlayers] = useState([]);

  const loadPlayers = async () => {
    try {

      const res = await fetch(
        "http://203.101.40.119:5000/api/admin/users/players",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`
          }
        }
      );

      const data = await res.json();

      setPlayers(data || []);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {

    loadPlayers();

    const interval = setInterval(loadPlayers, 5000);

    return () => clearInterval(interval);

  }, []);

  const formatLastSeen = (lastSeen, online) => {

    if (!lastSeen) return "Never";

    if (online) return "Just now";

    const diffMs =
      Date.now() - new Date(lastSeen).getTime();

    const diffMin =
      Math.floor(diffMs / 60000);

    if (diffMin < 60) {
      return `${diffMin} min ago`;
    }

    const diffHr =
      Math.floor(diffMin / 60);

    if (diffHr < 24) {
      return `${diffHr} hr ago`;
    }

    const diffDays =
      Math.floor(diffHr / 24);

    return `${diffDays} day ago`;
  };

  return (
    <div>

      <div className="section-header">
        <h3 className="section-title">
          Registered Players
        </h3>
      </div>

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
            </tr>
          </thead>

          <tbody>

            {players.length === 0 ? (

              <tr>
                <td colSpan="7" align="center">
                  No players found
                </td>
              </tr>

            ) : (

              [...players]
  .sort((a, b) => {

    if (a.online && !b.online) return -1;
    if (!a.online && b.online) return 1;

    return new Date(b.last_seen || 0) - new Date(a.last_seen || 0);
  })
  .map((p) => (

                <tr key={p.id}>

                  <td data-label="Name">{p.name}</td>

<td data-label="Pairing Code">
  {p.pairing_code}
</td>

<td data-label="Location">
  {p.location || "-"}
</td>

<td data-label="Group">
  {p.group_name || "-"}
</td>

<td data-label="Current Playlist">
  {p.current_playlist_name || "—"}
</td>

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

<td data-label="Last Seen">
  {formatLastSeen(p.last_seen, p.online)}
</td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminPlayers;