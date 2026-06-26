process.env.TZ = "Asia/Kolkata";
console.log("Node Time:", new Date());
console.log("Node TZ:", Intl.DateTimeFormat().resolvedOptions().timeZone);
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const axios = require("axios");
require("dotenv").config({
  path: path.join(__dirname, "../.env")
});

const authRoutes = require("./routes/authRoutes");
const assetRoutes = require("./routes/assetRoutes");
const playlistRoutes = require("./routes/playlistRoutes");
const displayRoutes = require("./routes/displayRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const groupRoutes = require("./routes/groupRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const adminAuthRoutes = require("./routes/adminAuth");
const adminUsersRoutes = require("./routes/adminUsers");
const deviceRoutes = require("./routes/deviceRoutes");

const db = require("./models/db");

const app = express();
const server = http.createServer(app);

/* ================= SOCKET.IO ================= */
const io = new Server(server, {
  cors: { origin: "*" }
});

/* ================= MIDDLEWARE ================= */
/* ================= MIDDLEWARE ================= */
app.use(cors({
  origin: [
    "http://203.101.40.119:3002",
    "http://203.101.40.119:3001",
    "http://203.101.40.119:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// make io available in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

/* ================= ROUTES ================= */
app.use("/api/display", displayRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin/users", adminUsersRoutes);
app.use("/api/devices", deviceRoutes);

app.use("/uploads", express.static("src/uploads"));

app.get("/", (req, res) => {
  res.send("PiSignage Backend Running");
});

app.post("/send-mail", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tech.inwallz@gmail.com",
        pass: "frzs xnbj ctpr jtnn", // replace this
      },
    });

    await transporter.sendMail({
      from: email,
      to: "tech.inwallz@gmail.com",
      subject: subject,
      text: `
Name: ${name}
Email: ${email}
Message:
${message}
      `,
    });

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

/* ================= SOCKET LOGIC (FIXED) ================= */
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  /* 🔥 TV JOINS ROOM */
  socket.on("join-tv", (pairingCode) => {
    socket.join(pairingCode);
    console.log("TV joined room:", pairingCode);

    // ✅ AUTO-START LAST PLAYLIST (CRITICAL FIX)
    db.query(
      "SELECT current_playlist_id FROM displays WHERE pairing_code = ?",
      [pairingCode],
      (err, rows) => {
        if (err) {
          console.error("DB error on join-tv:", err);
          return;
        }

        if (rows.length && rows[0].current_playlist_id) {
          socket.emit("start-playlist", {
            playlistId: rows[0].current_playlist_id
          });

          console.log(
            "Auto-started playlist",
            rows[0].current_playlist_id,
            "for TV",
            pairingCode
          );
        } else {
          console.log("No previous playlist for TV", pairingCode);
        }
      }
    );
  });

    /* 🔥 CLIENT REQUEST: send current playlist JSON for a pairingCode */
  socket.on("request-playlist", async (pairingCode) => {
    try {
      if (!pairingCode) return;

      // Find the current playlist id for this display (same as your join-tv logic)
      db.query(
        "SELECT current_playlist_id FROM displays WHERE pairing_code = ?",
        [pairingCode],
        async (err, rows) => {
          if (err) {
            console.error("DB error on request-playlist:", err);
            return;
          }

          if (!rows.length || !rows[0].current_playlist_id) {
            console.log("No current playlist for TV", pairingCode);
            // send an empty playlist object so client can handle it
            socket.emit("playlist", { assets: [], tickerConfig: null, revision: Date.now() });
            return;
          }

          const playlistId = rows[0].current_playlist_id;
          try {
            // Call your existing playlist API to get the full JSON (adjust URL if needed)
          const url = `http://localhost:5000/api/playlists/${playlistId}/assets`;
            const resp = await axios.get(url);
            const playlistJson = resp.data;

            // Emit the playlist object to the requesting socket/room
            io.to(pairingCode).emit("playlist", playlistJson);
            console.log("Sent playlist", playlistId, "to room", pairingCode);
          } catch (fetchErr) {
            console.error("Failed to fetch playlist JSON for id", playlistId, fetchErr);
            // fallback: emit minimal info so client doesn't hang
            socket.emit("playlist", { assets: [], tickerConfig: null, revision: Date.now() });
          }
        }
      );
    } catch (e) {
      console.error("request-playlist handler failed", e);
    }
  });

  /* 🔥 PLAY PLAYLIST (FROM CLIENT) */
  socket.on("play-playlist", ({ pairingCode, playlistId }) => {
    // 1️⃣ SAVE LAST PLAYLIST
    db.query(
      "UPDATE displays SET current_playlist_id = ? WHERE pairing_code = ?",
      [playlistId, pairingCode]
    );

    // 2️⃣ SEND TO TV
    io.to(pairingCode).emit("start-playlist", { playlistId });

    console.log(
      `Playlist ${playlistId} started on TV ${pairingCode}`
    );
  });

  //online or offline
  socket.on("heartbeat", (pairingCode) => {
  if (!pairingCode) return;

  db.query(
    "UPDATE displays SET last_seen = NOW() WHERE pairing_code = ?",
    [pairingCode]
  );
});

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const scheduler = require("./scheduler");
scheduler(io);

/* ================= START SERVER ================= */
server.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});