import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerDisplay } from "../services/api";
import socket from "../services/socket";

function PairingPage() {
  const [code, setCode] = useState(null);
  const navigate = useNavigate();

  // If a playlist is cached locally, jump straight to display (handles offline restart)
  useEffect(() => {
    try {
      const cached = localStorage.getItem("lastPlaylist");
      if (cached) {
        navigate("/display");
        return;
      }
    } catch (e) {
      // ignore
    }
  }, [navigate]);

  /* ================= GENERATE / LOAD PAIRING CODE ================= */
  useEffect(() => {
    const savedCode = localStorage.getItem("pairingCode");

    if (savedCode) {
      setCode(savedCode);
      if (navigator.onLine) {
        socket.emit("join-tv", savedCode);
      }
      return;
    }

    // If offline, do not attempt to call registerDisplay() — we can't get a code
    if (!navigator.onLine) return;

    registerDisplay().then((data) => {
      if (!data?.pairingCode) return;

      localStorage.setItem("pairingCode", data.pairingCode);
      setCode(data.pairingCode);
      if (window.AndroidBridge) {
        window.AndroidBridge.savePairingCode(data.pairingCode);
      }

      socket.emit("join-tv", data.pairingCode);
    });
  }, []);

  

  /* ================= SWITCH TO DISPLAY ON PLAYLIST ================= */
  useEffect(() => {
    const handler = () => {
      navigate("/display");
    };

    socket.on("start-playlist", handler);
    return () => socket.off("start-playlist", handler);
  }, [navigate]);

  useEffect(() => {
    if (code && window.AndroidBridge) {
      window.AndroidBridge.savePairingCode(code);
    }
  }, [code]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "black",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <h1>PAIR THIS TV</h1>
      <h2>{code ?? "Generating code..."}</h2>
      <p>Enter this code in dashboard</p>
    </div>
  );
}

export default PairingPage;