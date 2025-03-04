// server.js (Backend)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message");

// Initialize Express
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("YOUR_MONGODB_CONNECTION_STRING", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// WebSocket Server
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("🔵 User connected");

  socket.on("sendMessage", async (data) => {
    const newMessage = new Message({ user: data.user, message: data.message });
    await newMessage.save();
    io.emit("message", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected");
  });
});

// API to Get Messages
app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Start Server
server.listen(5000, () => console.log("🚀 Server running on port 5000"));
