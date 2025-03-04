const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Send a Message
router.post("/send", (req, res) => {
    const { sender_id, receiver_id, message } = req.body;
    const sql = "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)";

    db.query(sql, [sender_id, receiver_id, message], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Message sent successfully!" });
    });
});

// ✅ Get All Messages Between Two Users
router.get("/:sender_id/:receiver_id", (req, res) => {
    const { sender_id, receiver_id } = req.params;
    const sql = "SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY sent_at ASC";

    db.query(sql, [sender_id, receiver_id, receiver_id, sender_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

module.exports = router;
