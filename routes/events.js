const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Create an Event
router.post("/create", (req, res) => {
    const { title, description, event_date, created_by } = req.body;
    const sql = "INSERT INTO events (title, description, event_date, created_by) VALUES (?, ?, ?, ?)";

    db.query(sql, [title, description, event_date, created_by], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Event created successfully!" });
    });
});

// ✅ Get All Events
router.get("/", (req, res) => {
    const sql = "SELECT * FROM events";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ✅ Get Event by ID
router.get("/:id", (req, res) => {
    const sql = "SELECT * FROM events WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: "Event not found" });
        res.json(result[0]);
    });
});

// ✅ Update an Event
router.put("/update/:id", (req, res) => {
    const { title, description, event_date } = req.body;
    const sql = "UPDATE events SET title=?, description=?, event_date=? WHERE id=?";

    db.query(sql, [title, description, event_date, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Event updated successfully!" });
    });
});

// ✅ Delete an Event
router.delete("/delete/:id", (req, res) => {
    const sql = "DELETE FROM events WHERE id=?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Event deleted successfully!" });
    });
});

module.exports = router;
