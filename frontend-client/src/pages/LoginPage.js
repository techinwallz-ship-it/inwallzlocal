import { useState } from "react";
import { loginUser } from "../services/api";
import { adminLogin } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const adminRes = await adminLogin(username, password);

      // ✅ ADMIN SUCCESS
      localStorage.setItem("adminToken", adminRes.token);
      localStorage.setItem("adminUser", JSON.stringify(adminRes.admin));
      localStorage.setItem("role", "admin");

      navigate("/admin");
      return; // ⛔ stop here if admin succeeds
    } catch (err) {
      // silently fail → try client
    }

    /* ================= TRY CLIENT LOGIN ================= */
    try {
      const userRes = await loginUser(username, password);

      if (userRes?.userId) {
        localStorage.setItem("token", userRes.token);
        localStorage.setItem("user", JSON.stringify(userRes));
        localStorage.setItem("role", "client");

        navigate("/dashboard");
        return;
      }

      setError("Invalid credentials");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to your account</p>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div style={{ position: "relative" }}>
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <span
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      fontSize: "14px"
    }}
  >
    {showPassword ? "Hide" : "Show"}
  </span>
</div>


        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        
      </div>
    </div>
  );
}

export default LoginPage;