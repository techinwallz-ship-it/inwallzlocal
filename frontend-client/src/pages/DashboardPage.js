import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Monitor,
  Calendar,
  Image,
  TrendingUp,
  AlertCircle,
  Menu
} from "lucide-react";
import logo from "../assets/logo.svg";

import "../styles/dashboard.css";

import PlayersPage from "./PlayersPage";
import AssetsPage from "./AssetsPage";
import PlaylistsPage from "./PlaylistsPage";
import GroupsPage from "./GroupsPage";
import ScheduleCalendar from "./ScheduleCalendar";

import { getPlayers, getDashboardStats } from "../services/api";

function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [active, setActive] = useState("dashboard");
  const [players, setPlayers] = useState([]);
  const [stats, setStats] = useState(null);

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  // sidebar open/close
const [sidebarOpen, setSidebarOpen] = useState(
  window.innerWidth >= 768
);
  /* ================= FIX: RESET SIDEBAR ON TAB CHANGE ================= */
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
  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  /* ================= LOAD DASHBOARD STATS ================= */
  useEffect(() => {
    if (!user?.userId) return;

    getDashboardStats(user.userId)
      .then(setStats)
      .catch(console.error);
  }, [user?.userId]);

  /* ================= LOAD PLAYERS (LIVE STATUS) ================= */
  useEffect(() => {
    if (!user?.userId) return;

    const load = async () => {
      const data = await getPlayers(user.userId);
      setPlayers(data || []);
    };

    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [user?.userId]);

  /* ================= DERIVED COUNTS ================= */
  const onlineCount = players.filter(p => p.online).length;
  const offlineCount = players.filter(p => !p.online).length;
  const waitingCount = players.filter(
    p => p.online && !p.current_playlist_name
  ).length;

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className={`layout ${theme}`}>
      {/* ================= TOPBAR ================= */}
      <header className="topbar">
        <div className="topbar-left">
          <img src={logo} alt="Inwallz" className="topbar-logo" />

          <button
            className="hamburger"
            aria-label="Toggle sidebar"
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
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <span className="user-name">Logout</span>
          </div>
        </div>
      </header>
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
            className={`nav-item ${active === "dashboard" ? "active" : ""}`}
            onClick={() => setActive("dashboard")}
          >
            <TrendingUp size={18} />
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-item ${active === "players" ? "active" : ""}`}
            onClick={() => setActive("players")}
          >
            <Monitor size={18} />
            <span>Players</span>
          </button>

          <button
            className={`nav-item ${active === "assets" ? "active" : ""}`}
            onClick={() => setActive("assets")}
          >
            <Image size={18} />
            <span>Assets</span>
          </button>

          <button
            className={`nav-item ${active === "playlists" ? "active" : ""}`}
            onClick={() => setActive("playlists")}
          >
            <Calendar size={18} />
            <span>Playlists</span>
          </button>

          <button
            className={`nav-item ${active === "groups" ? "active" : ""}`}
            onClick={() => setActive("groups")}
          >
            <Users size={18} />
            <span>Groups</span>
          </button>
        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <main className={`main ${sidebarOpen ? "" : "full"}`}>
        <div className="content">
          {active === "dashboard" && (
            <>
              {!stats && <p>Loading...</p>}

              <div className="stats-grid">
                <div className="stat-card primary">
                  <div className="stat-icon">
                    <Monitor size={24} />
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Total Players</p>
                    <h3 className="stat-value">{stats?.players ?? 0}</h3>
                  </div>
                </div>

                <div className="stat-card success">
                  <div className="stat-icon">
                    <div className="status-dot online" />
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Online</p>
                    <h3 className="stat-value">{onlineCount}</h3>
                  </div>
                </div>

                <div className="stat-card warning">
                  <div className="stat-icon">
                    <AlertCircle size={24} />
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Waiting</p>
                    <h3 className="stat-value">{waitingCount}</h3>
                  </div>
                </div>

                <div className="stat-card danger">
                  <div className="stat-icon">
                    <div className="status-dot offline" />
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Offline</p>
                    <h3 className="stat-value">{offlineCount}</h3>
                  </div>
                </div>

                <div className="stat-card neutral">
                  <div className="stat-icon">
                    <Calendar size={24} />
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Playlists</p>
                    <h3 className="stat-value">{stats?.playlists ?? 0}</h3>
                  </div>
                </div>

                <div className="stat-card neutral">
                  <div className="stat-icon">
                    <Image size={24} />
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Assets</p>
                    <h3 className="stat-value">{stats?.assets ?? 0}</h3>
                  </div>
                </div>
              </div>

              <ScheduleCalendar />
            </>
          )}

          {active === "players" && <PlayersPage />}
          {active === "assets" && <AssetsPage />}
          {active === "playlists" && <PlaylistsPage />}
          {active === "groups" && <GroupsPage />}
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
    className={active === "players" ? "active" : ""}
    onClick={() => setActive("players")}
  >
    <Monitor size={22} />
  </button>

  <button
    className={active === "assets" ? "active" : ""}
    onClick={() => setActive("assets")}
  >
    <Image size={22} />
  </button>

  <button
    className={active === "playlists" ? "active" : ""}
    onClick={() => setActive("playlists")}
  >
    <Calendar size={22} />
  </button>

  <button
    className={active === "groups" ? "active" : ""}
    onClick={() => setActive("groups")}
  >
    <Users size={22} />
  </button>
</nav>
    </div>
  );
}

export default DashboardPage;