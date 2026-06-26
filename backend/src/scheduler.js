const cron = require("node-cron");
const db = require("./models/db");

module.exports = (io) => {
  cron.schedule("* * * * *", () => {
    console.log("⏱ Scheduler tick");

    /* ================= START SCHEDULES ================= */
    const startSql = `
      SELECT *
      FROM schedules
      WHERE active = 1
      AND start_time <= NOW()
      AND (end_time IS NULL OR end_time > NOW())
      AND previous_playlist_id IS NULL
    `;

    db.query(startSql, (err, schedules) => {
      if (err) return console.error("Scheduler start error:", err);

      schedules.forEach((s) => {
        if (s.target_type === "player") {
          startPlayerSchedule(io, s);
        } else {
          startGroupSchedule(io, s);
        }
      });
    });

    /* ================= STOP SCHEDULES ================= */
    const stopSql = `
      SELECT *
      FROM schedules
      WHERE active = 1
      AND end_time IS NOT NULL
      AND end_time <= NOW()
      AND previous_playlist_id IS NOT NULL
    `;

    db.query(stopSql, (err, schedules) => {
      if (err) return console.error("Scheduler stop error:", err);

      schedules.forEach((s) => {
        if (s.target_type === "player") {
          stopPlayerSchedule(io, s);
        } else {
          stopGroupSchedule(io, s);
        }
      });
    });
  });
};

/* ================= START PLAYER ================= */
function startPlayerSchedule(io, s) {
  db.query(
    "SELECT pairing_code, current_playlist_id FROM displays WHERE id = ?",
    [s.target_id],
    (err, rows) => {
      if (err || !rows.length) return;

      const prev = rows[0].current_playlist_id;

      db.query(
        "UPDATE schedules SET previous_playlist_id = ? WHERE id = ?",
        [prev, s.id]
      );

      db.query(
        "UPDATE displays SET current_playlist_id = ? WHERE id = ?",
        [s.playlist_id, s.target_id]
      );

      io.to(rows[0].pairing_code).emit("start-playlist", {
        playlistId: s.playlist_id
      });

      console.log("▶ Player schedule started", s.id);
    }
  );
}

/* ================= STOP PLAYER ================= */
function stopPlayerSchedule(io, s) {
  db.query(
    "SELECT pairing_code FROM displays WHERE id = ?",
    [s.target_id],
    (err, rows) => {
      if (err || !rows.length) return;

      io.to(rows[0].pairing_code).emit("start-playlist", {
        playlistId: s.previous_playlist_id
      });

      db.query(
        "UPDATE displays SET current_playlist_id = ? WHERE id = ?",
        [s.previous_playlist_id, s.target_id]
      );

      /* ===== HANDLE REPEAT ===== */
      if (s.repeat_type === "daily") {
        db.query(
          `
          UPDATE schedules
          SET 
            start_time = DATE_ADD(start_time, INTERVAL 1 DAY),
            end_time = IF(end_time IS NOT NULL, DATE_ADD(end_time, INTERVAL 1 DAY), NULL),
            previous_playlist_id = NULL
          WHERE id = ?
          `,
          [s.id]
        );
      } 
      else if (s.repeat_type === "weekly") {
        db.query(
          `
          UPDATE schedules
          SET 
            start_time = DATE_ADD(start_time, INTERVAL 7 DAY),
            end_time = IF(end_time IS NOT NULL, DATE_ADD(end_time, INTERVAL 7 DAY), NULL),
            previous_playlist_id = NULL
          WHERE id = ?
          `,
          [s.id]
        );
      } 
      else {
        // once
        db.query(
          `
          UPDATE schedules
          SET active = 0,
              previous_playlist_id = NULL
          WHERE id = ?
          `,
          [s.id]
        );
      }

      console.log("⏹ Player schedule ended", s.id);
    }
  );
}

/* ================= START GROUP ================= */
function startGroupSchedule(io, s) {
  db.query(
    `
    SELECT d.id, d.pairing_code, d.current_playlist_id
    FROM display_group_players gp
    JOIN displays d ON d.id = gp.display_id
    WHERE gp.group_id = ?
    LIMIT 1
    `,
    [s.target_id],
    (err, rows) => {
      if (err || !rows.length) return;

      const prev = rows[0].current_playlist_id;

      db.query(
        "UPDATE schedules SET previous_playlist_id = ? WHERE id = ?",
        [prev, s.id]
      );
    }
  );

  db.query(
    `
    SELECT d.id, d.pairing_code
    FROM display_group_players gp
    JOIN displays d ON d.id = gp.display_id
    WHERE gp.group_id = ?
    `,
    [s.target_id],
    (err, rows) => {
      if (err) return;

      rows.forEach((r) => {
        db.query(
          "UPDATE displays SET current_playlist_id = ? WHERE id = ?",
          [s.playlist_id, r.id]
        );

        io.to(r.pairing_code).emit("start-playlist", {
          playlistId: s.playlist_id
        });
      });

      console.log("▶ Group schedule started", s.id);
    }
  );
}

/* ================= STOP GROUP ================= */
function stopGroupSchedule(io, s) {
  db.query(
    `
    SELECT d.id, d.pairing_code
    FROM display_group_players gp
    JOIN displays d ON d.id = gp.display_id
    WHERE gp.group_id = ?
    `,
    [s.target_id],
    (err, rows) => {
      if (err) return;

      rows.forEach((r) => {
        db.query(
          "UPDATE displays SET current_playlist_id = ? WHERE id = ?",
          [s.previous_playlist_id, r.id]
        );

        io.to(r.pairing_code).emit("start-playlist", {
          playlistId: s.previous_playlist_id
        });
      });

       /* ===== HANDLE REPEAT ===== */
      if (s.repeat_type === "daily") {
        db.query(
          `
          UPDATE schedules
          SET 
            start_time = DATE_ADD(start_time, INTERVAL 1 DAY),
            end_time = IF(end_time IS NOT NULL, DATE_ADD(end_time, INTERVAL 1 DAY), NULL),
            previous_playlist_id = NULL
          WHERE id = ?
          `,
          [s.id]
        );
      } 
      else if (s.repeat_type === "weekly") {
        db.query(
          `
          UPDATE schedules
          SET 
            start_time = DATE_ADD(start_time, INTERVAL 7 DAY),
            end_time = IF(end_time IS NOT NULL, DATE_ADD(end_time, INTERVAL 7 DAY), NULL),
            previous_playlist_id = NULL
          WHERE id = ?
          `,
          [s.id]
        );
      } 
      else {
        db.query(
          `
          UPDATE schedules
          SET active = 0,
              previous_playlist_id = NULL
          WHERE id = ?
          `,
          [s.id]
        );
      }

      console.log("⏹ Group schedule ended", s.id);
    }
  );
}