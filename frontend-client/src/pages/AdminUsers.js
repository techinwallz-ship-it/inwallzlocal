import { useEffect, useState } from "react";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
    password: "",
    deviceLimit: 1
  });

  /* ================= LOAD USERS ================= */
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        }
      });

      const data = await res.json();

      // ✅ SAFETY: always set array
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        setUsers([]);
      }

    } catch (err) {
      console.error(err);
      setError("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CREATE USER ================= */
const createUser = async () => {
  if (!form.username || !form.password) {
    alert("Username & password required");
    return;
  }

  try {
    await fetch("http://localhost:5000/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
      },
      body: JSON.stringify({
        username: form.username,
        password: form.password,
        deviceLimit: Number(form.deviceLimit) // ✅ FIX
      })
    });

    setForm({ username: "", password: "", deviceLimit: 1 });
    loadUsers();
  } catch (err) {
    console.error(err);
    alert("Failed to create user");
  }
};
  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <h2>👤 Client Users</h2>

      {/* ================= CREATE USER ================= */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <input
          type="number"
          min="1"
          value={form.deviceLimit}
          onChange={e =>
            setForm({ ...form, deviceLimit: e.target.value })
          }
        />

        <button onClick={createUser}>Create</button>
      </div>

      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ================= USERS TABLE ================= */}
      <table width="100%" border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Username</th>
            <th>Max Devices</th>
            <th>Status</th>
            <th>Actions</th>   {/* ✅ ADD THIS */}

          </tr>
        </thead>
        <tbody>
  {users.length === 0 ? (
    <tr>
      <td colSpan="4" align="center">
        No users found
      </td>
    </tr>
  ) : (
    users.map(u => (
      <tr key={u.id}>
        <td>{u.username}</td>

        {/* DEVICE LIMIT */}
        <td>
  <input
    type="number"
    min="1"
    value={u.max_devices}
    onChange={(e) => {
      const updatedUsers = users.map(user =>
        user.id === u.id
          ? { ...user, max_devices: e.target.value }
          : user
      );

      setUsers(updatedUsers);
    }}
    onBlur={async (e) => {
      try {
        await fetch(
          `http://localhost:5000/api/admin/users/${u.id}/device-limit`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`
            },
            body: JSON.stringify({
              deviceLimit: Number(e.target.value)
            })
          }
        );

        loadUsers();
      } catch (err) {
        console.error(err);
        alert("Failed to update device limit");
      }
    }}
    style={{ width: 60 }}
  />
</td>

        {/* STATUS */}
        <td>{u.is_active ? "🟢 Active" : "🔴 Disabled"}</td>

        {/* ACTIONS */}
        <td>
          <button
            onClick={async () => {
              await fetch(
                `http://localhost:5000/api/admin/users/${u.id}/toggle`,
                {
                  method: "PATCH",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                  }
                }
              );
              loadUsers();
            }}
          >
            {u.is_active ? "🔒 Lock" : "🔓 Unlock"}
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
      </table>
    </div>
  );
}

export default AdminUsers;