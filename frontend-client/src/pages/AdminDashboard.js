import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Monitor,
  TrendingUp
} from "lucide-react";

import "../styles/dashboard.css";
import AdminUsers from "./AdminUsers";
import AdminPlayers from "./AdminPlayers";
import { getAdminDashboardStats } from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("adminUser"));

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  const [sidebarOpen, setSidebarOpen] = useState(
    window.innerWidth >= 768
  );

  const [active, setActive] = useState("dashboard");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDevices: 0,
    onlineDevices: 0,
    offlineDevices: 0
  });

  /* ================= RESPONSIVE SIDEBAR ================= */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= LOAD ADMIN STATS ================= */
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
  try {
    const data = await getAdminDashboardStats();

    setStats({
      totalUsers: data.totalUsers || 0,
      totalDevices: data.totalDevices || 0,
      onlineDevices: data.onlineDevices || 0,
      offlineDevices: data.offlineDevices || 0
    });

  } catch (err) {
    console.error(err);
  }
};

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/login");
  };

  return (
    <div className={`layout ${theme}`}>
      {/* ================= TOPBAR ================= */}
      <header className="topbar">
        <div className="topbar-left">

          <h2 style={{ color: "white" }}>Admin Panel</h2>

          <button
            className="hamburger"
            onClick={() => setSidebarOpen(s => !s)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className="topbar-right">
          <button
            className="theme-toggle"
            onClick={() => {
              const t = theme === "dark" ? "light" : "dark";
              setTheme(t);
              localStorage.setItem("theme", t);
            }}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <div className="user-menu" onClick={logout}>
            <div className="user-avatar">
              {admin?.username?.[0]?.toUpperCase()}
            </div>

            <span className="user-name">Logout</span>
          </div>
        </div>
      </header>

      {/* ================= MOBILE OVERLAY ================= */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside className={`sidebar ${sidebarOpen ? "" : "closed"}`}>
        <nav className="nav-menu">

          <button
            className={`nav-item ${
              active === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActive("dashboard")}
          >
            <TrendingUp size={18} />
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-item ${
              active === "users" ? "active" : ""
            }`}
            onClick={() => setActive("users")}
          >
            <Users size={18} />
            <span>Users</span>
          </button>
          <button
  className={`nav-item ${
    active === "players" ? "active" : ""
  }`}
  onClick={() => setActive("players")}
>
  <Monitor size={18} />
  <span>Players</span>
</button>

        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <main className={`main ${sidebarOpen ? "" : "full"}`}>
        <div className="content">

          {/* ================= DASHBOARD ================= */}
          {active === "dashboard" && (
            <>
              <div className="stats-grid">

                <div className="stat-card primary">
                  <div className="stat-icon">
                    <Users size={24} />
                  </div>

                  <div className="stat-content">
                    <p className="stat-label">Total Users</p>
                    <h3 className="stat-value">
                      {stats.totalUsers}
                    </h3>
                  </div>
                </div>

                <div className="stat-card success">
                  <div className="stat-icon">
                    <Monitor size={24} />
                  </div>

                  <div className="stat-content">
                    <p className="stat-label">Total Devices</p>
                    <h3 className="stat-value">
                      {stats.totalDevices}
                    </h3>
                  </div>
                </div>

                <div className="stat-card warning">
                  <div className="stat-icon">
                    <div className="status-dot online" />
                  </div>

                  <div className="stat-content">
                    <p className="stat-label">Online Devices</p>
                    <h3 className="stat-value">
                      {stats.onlineDevices}
                    </h3>
                  </div>
                </div>

                <div className="stat-card danger">
                  <div className="stat-icon">
                    <div className="status-dot offline" />
                  </div>

                  <div className="stat-content">
                    <p className="stat-label">Offline Devices</p>
                    <h3 className="stat-value">
                      {stats.offlineDevices}
                    </h3>
                  </div>
                </div>

              </div>

              {/* EXISTING USER TABLE BELOW */}
              
            </>
          )}

          {/* USERS TAB */}
          {active === "users" && <AdminUsers />}
          {active === "players" && <AdminPlayers />}

        </div>
      </main>
      {/* ================= MOBILE BOTTOM NAV ================= */}
<nav className="bottom-nav">

  <button
    className={active === "dashboard" ? "active" : ""}
    onClick={() => setActive("dashboard")}
  >
    <TrendingUp size={22} />
  </button>

  <button
    className={active === "users" ? "active" : ""}
    onClick={() => setActive("users")}
  >
    <Users size={22} />
  </button>

  <button
    className={active === "players" ? "active" : ""}
    onClick={() => setActive("players")}
  >
    <Monitor size={22} />
  </button>

</nav>
    </div>
  );
}

export default AdminDashboard;