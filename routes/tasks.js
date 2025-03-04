const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Create a Task
router.post("/create", (req, res) => {
    const { task_name, event_id, assigned_to, status } = req.body;
    const sql = "INSERT INTO tasks (task_name, event_id, assigned_to, status) VALUES (?, ?, ?, ?)";

    db.query(sql, [task_name, event_id, assigned_to, status], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Task created successfully!" });
    });
});

// ✅ Get All Tasks
router.get("/", (req, res) => {
    const sql = "SELECT * FROM tasks";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ✅ Get Task by ID
router.get("/:id", (req, res) => {
    const sql = "SELECT * FROM tasks WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: "Task not found" });
        res.json(result[0]);
    });
});

// ✅ Update a Task
router.put("/update/:id", (req, res) => {
    const { task_name, status } = req.body;
    const sql = "UPDATE tasks SET task_name=?, status=? WHERE id=?";

    db.query(sql, [task_name, status, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Task updated successfully!" });
    });
});

// ✅ Delete a Task
router.delete("/delete/:id", (req, res) => {
    const sql = "DELETE FROM tasks WHERE id=?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Task deleted successfully!" });
    });
});

module.exports = router;
