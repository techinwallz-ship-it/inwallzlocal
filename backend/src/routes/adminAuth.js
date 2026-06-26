const express = require("express");
const bcrypt = require("bcrypt");   // ✅ FIXED
const jwt = require("jsonwebtoken");
const db = require("../models/db");

const router = express.Router();

/* ================= ADMIN LOGIN ================= */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Missing credentials" });

  db.query(
    "SELECT * FROM admins WHERE username = ?",
    [username],
    async (err, rows) => {
      if (err) return res.status(500).json(err);
      if (!rows.length)
        return res.status(401).json({ message: "Invalid admin credentials" });

      const admin = rows[0];

      const match = await bcrypt.compare(password, admin.password);
      if (!match)
        return res.status(401).json({ message: "Invalid admin credentials" });

      const token = jwt.sign(
        { adminId: admin.id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        token,
        admin: { id: admin.id, username: admin.username }
      });
    }
  );
});

module.exports = router;