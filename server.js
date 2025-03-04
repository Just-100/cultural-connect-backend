require("dotenv").config();
console.log("Loaded ENV Variables:", process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD);
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// ✅ MySQL Database Connection Using .env
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// ✅ Connect to MySQL
db.connect(err => {
    if (err) {
        console.error("❌ Database connection failed: " + err.stack);
        return;
    }
    console.log("✅ Connected to MySQL Database");
});

// ✅ Test Route
app.get("/", (req, res) => {
    res.send("Cultural Connect Backend is Running! 🚀");
});

// ✅ User Registration API
app.post("/api/users/register", async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, email, hashedPassword, role], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User registered successfully!" });
    });
});

// ✅ User Login API
app.post("/api/users/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        res.json({ message: "Login successful!", user: { id: user.id, name: user.name, role: user.role } });
    });
});

// ✅ Import & Use Routes
const eventsRoutes = require("./routes/events");
app.use("/api/events", eventsRoutes);

const tasksRoutes = require("./routes/tasks");
app.use("/api/tasks", tasksRoutes);

const messagesRoutes = require("./routes/messages");
app.use("/api/messages", messagesRoutes);

// ✅ Real-Time Chat with WebSockets
io.on("connection", socket => {
    console.log("🟢 A user connected:", socket.id);

    socket.on("sendMessage", ({ sender_id, receiver_id, message }) => {
        const sql = "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)";
        db.query(sql, [sender_id, receiver_id, message], (err, result) => {
            if (err) {
                console.error("❌ Error saving message:", err);
                return;
            }
            io.emit("receiveMessage", { sender_id, receiver_id, message });
        });
    });

    socket.on("disconnect", () => {
        console.log("🔴 A user disconnected:", socket.id);
    });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});