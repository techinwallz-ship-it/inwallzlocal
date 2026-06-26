import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import LoginPage from "./pages/LoginPage";
import EnterCodePage from "./pages/EnterCodePage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import SplashScreen from "./SplashScreen";

import "./styles/client.css";

/* ================= ROLE GUARD ================= */
const RequireRole = ({ role, children }) => {
  const storedRole = localStorage.getItem("role");

  if (!storedRole) {
    return <Navigate to="/login" replace />;
  }

  if (storedRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  // 🔥 Show splash first
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // 🔥 Normal app after splash
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route → Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* App pages */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/enter-code" element={<EnterCodePage />} />
        <Route
          path="/admin"
          element={
            <RequireRole role="admin">
              <AdminDashboard />
            </RequireRole>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;