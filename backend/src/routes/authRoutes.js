const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const db = require("../models/db");

const router = express.Router();
const authController = require("../controllers/authController");

// ---------------- Normal Login ----------------
router.post("/login", authController.login);

// ---------------- Facebook Login ----------------
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
  })
);

// ---------------- Google Login ----------------
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// ===================================================
// Common Social Login Handler
// ===================================================
async function handleSocialLogin(req, res, provider) {
  try {
    const email = req.user.emails?.[0]?.value;
    const name = req.user.displayName;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: `${provider} account has no email.`,
      });
    }

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, rows) => {
        if (err) return res.status(500).json(err);

        // Existing user
        if (rows.length > 0) {
          return res.redirect(
            `http://localhost:3002/login/${provider}?userId=${
              rows[0].id
            }&username=${encodeURIComponent(rows[0].username)}`
          );
        }

        // New user
        const username = email.split("@")[0];
        const randomPassword = Math.random().toString(36);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        db.query(
          "INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)",
          [name, username, email, hashedPassword],
          (err, result) => {
            if (err) return res.status(500).json(err);

            res.redirect(
              `http://localhost:3002/login/${provider}?userId=${
                result.insertId
              }&username=${encodeURIComponent(username)}`
            );
          }
        );
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `${provider} login failed`,
    });
  }
}

// ---------------- Facebook Callback ----------------
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "http://localhost:3002/login",
  }),
  (req, res) => handleSocialLogin(req, res, "facebook")
);

// ---------------- Google Callback ----------------
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:3002/login",
  }),
  (req, res) => handleSocialLogin(req, res, "google")
);

module.exports = router;