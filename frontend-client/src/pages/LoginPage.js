import { useState, useEffect } from "react";
import { loginUser } from "../services/api";
import { adminLogin } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { FaEye, FaEyeSlash, FaFacebook, FaGoogle } from "react-icons/fa";
import {
  FiMonitor,
  FiTrendingUp,
  FiShield,
  FiZap
} from "react-icons/fi";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  useEffect(() => {
  const savedUsername = localStorage.getItem("rememberedUsername");

  if (savedUsername) {
    setUsername(savedUsername);
    setRememberMe(true);
  }
}, []);


  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const adminRes = await adminLogin(username, password);

      if (rememberMe) {
  localStorage.setItem("rememberedUsername", username);
} else {
  localStorage.removeItem("rememberedUsername");
}

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

  if (rememberMe) {
    localStorage.setItem("rememberedUsername", username);
  } else {
    localStorage.removeItem("rememberedUsername");
  }

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
  const handleFacebookLogin = () => {
  window.location.href = "http://localhost:5000/api/auth/facebook";
};
const handleGoogleLogin = () => {
  window.location.href = "http://localhost:5000/api/auth/google";
};
  return (
  <div className="login-page">

    <div className="left-panel">
      <div className="grid-bg"></div>
      <div className="particles">
  {[...Array(20)].map((_, i) => (
    <span key={i}></span>
  ))}
</div>
      <div className="bg-glow bg-glow-1"></div>
<div className="bg-glow bg-glow-2"></div>
<div className="bg-glow bg-glow-3"></div>

    <div className="brand-logo">
  <img src="InWallz.png" alt="InWallz" className="main-logo" />

  <div className="brand-text">
    <h1 className="logo-text">InWallz</h1>
    <span>Digital Signage Platform</span>
  </div>
</div>

     <div className="hero-section">

  <div className="hero-content">
    <h2 className="hero-title">
    Transform Your Walls
    <br />
    Into <span>Dynamic</span>
    <br />
    <span>Digital Experiences</span>
</h2>


    <p>
      Powerful. Intelligent. Seamless.
      The all-in-one digital signage platform
      for modern businesses.
    </p>
    <div className="login-stats-grid">
      <div className="stat-item">
         <FiMonitor />
          <h3>50+</h3>
           <p>
             Displays<br />
              Connected
           </p>
      </div>
       <div className="stat-item">
         <FiTrendingUp />
          <h3>99.9%</h3>
           <p>
             Uptime<br />
              Reliability
               </p>
       </div>
       <div className="stat-item">
         <FiShield />
          <h3>24/7</h3>
           <p>
             Monitoring<br />
              & Support
           </p>
       </div>
       <div className="stat-item">
         <FiZap />
          <h3>Real-time</h3>
           <p>
            Content<br />
      Delivery
    </p>
  </div>

</div>






    
    
    
    
  
  </div>

  <div className="preview-image">
    <img src="/hospital-screen.png" alt="preview" />
  </div>

</div>

    </div>

    <div className="right-panel">

      <div className="auth-card">

        <img
  src="/logo.svg"
  alt="logo"
  className="login-logo"
/>

        <h2>Welcome Back</h2>

        <p className="subtitle">
          Login to your account
        </p>

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
    right: "15px",
    top: "45%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}
>
  {showPassword ? <FaEyeSlash /> : <FaEye />}
</span>

        </div>
        <div className="login-options">
          <label className="remember-me">
  <input
    type="checkbox"
    checked={rememberMe}
    onChange={(e) => setRememberMe(e.target.checked)}
  />
  <span>Remember me</span>
</label>

  

  <a
  href="https://wa.me/919787462461?text=Hello Admin, I forgot my password. Please help me reset it."
  target="_blank"
  rel="noopener noreferrer"
  className="forgot-password"
>
  Forgot Password?
</a>

</div>

        <button
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Sign In"}
        </button>
        <div className="social-divider">
  <span>OR</span>
</div>

<button
  className="facebook-btn"
  onClick={handleFacebookLogin}
>
  <FaFacebook style={{ marginRight: "10px" }} />
  Continue with Facebook
</button>
<button
  className="google-btn"
  onClick={handleGoogleLogin}
>
  <FaGoogle style={{ marginRight: "10px" }} />
  Continue with Google
</button>
      </div>

    </div>

  </div>
);
}

export default LoginPage;