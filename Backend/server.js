import http from "http"; // server configuration
import app from "./app.js";
import "./db/db.js";
import { createUserTable } from "./models/user.model.js";
import { createBlacklistTable } from "./models/blacklistedTokens.js";
import {
    createAppreciationsTable,
    createLikesTable,
    createCommentsTable
} from "./models/appreciation.model.js";
import {
    createEmployeeOfMonthTable,
    createEmployeeOfMonthTeamTable
} from "./models/employeeOfMonth.model.js";

import { createMessagesTable, createMessage, getMessages, getRecentConversations } from "./models/message.model.js";

import { createJobsTable } from "./models/job.model.js";
import { createApplicationsTable } from "./models/application.model.js";
import { createOffersTable } from "./models/offer.model.js";
import { createInterviewsTable } from "./models/interview.model.js";

import { Server } from "socket.io";
import dotenv from "dotenv";
import net from "net";

dotenv.config();

const port = process.env.PORT || 3000;
const MAX_PORT_ATTEMPTS = 10;

const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Frontend URL
        methods: ["GET", "POST"],
    },
});

const onlineUsers = new Map(); // Store online users: userId -> socketId

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Handle user login/online status
    socket.on("user_connected", (userId) => {
        const idStr = String(userId); // Force string for consistency
        onlineUsers.set(idStr, socket.id);
        io.emit("online_users", Array.from(onlineUsers.keys()));
        console.log(`User ${idStr} is online. Total online: ${onlineUsers.size}`);
    });

    // Join a chat room (optional, for direct messages)
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    // Handle sending messages
    socket.on("send_message", async (data) => {
        console.log("Message received:", data);
        // Data expected: { senderId, receiverId, message, room }

        // Save to DB
        try {
            if (data.senderId && data.receiverId) {
                const savedMsg = await createMessage(data.senderId, data.receiverId, data.message);
                data.id = savedMsg.id; // Add DB id to data
                data.created_at = savedMsg.created_at;
            }
        } catch (err) {
            console.error("Error saving message:", err);
        }

        // Broadcast the message to everyone (simplest for now) or specific room
        socket.broadcast.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
        // Remove user from onlineUsers map efficiently
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                io.emit("online_users", Array.from(onlineUsers.keys()));
                console.log(`User ${userId} went offline.`);
                break;
            }
        }
    });
});

import { createMeeting, createMeetingTable, deleteMeeting, getMeetings } from "./models/meeting.model.js";
import { updateUserProfile } from "./models/user.model.js";

// ... existing imports ...

// API to get Chat History
app.get("/api/messages/:user1/:user2", async (req, res) => {
    try {
        const { user1, user2 } = req.params;
        const messages = await getMessages(user1, user2);
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

// API to get Recent Conversations
app.get("/api/chats/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const recent = await getRecentConversations(userId);
        res.json(recent);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch recent chats" });
    }
});

// --- MEETINGS API ---
app.get("/api/meetings", async (req, res) => {
    try {
        const meetings = await getMeetings();
        res.json(meetings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch meetings" });
    }
});

app.post("/api/meetings", async (req, res) => {
    try {
        const { title, start_time, end_time, type } = req.body;
        const newMeeting = await createMeeting(title, start_time, end_time, type);
        res.status(201).json(newMeeting);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create meeting" });
    }
});

app.delete("/api/meetings/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await deleteMeeting(id);
        res.json({ message: "Meeting deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete meeting" });
    }
});

// Update Profile API
app.put("/api/users/profile/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname, email, designation, profile_picture } = req.body;

        // Basic validation
        if (!fullname || !email) {
            return res.status(400).json({ error: "Name and Email are required" });
        }

        const updatedUser = await updateUserProfile(id, fullname, email, designation, profile_picture);

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Return updated user without password
        delete updatedUser.password;
        res.json(updatedUser);
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ error: "Failed to update profile" });
    }
});
// --------------------

// Initialize database tables
const initDb = async () => {
    await createUserTable();
    await createBlacklistTable();
    await createAppreciationsTable();
    await createLikesTable();
    await createCommentsTable();
    await createEmployeeOfMonthTable();
    await createEmployeeOfMonthTeamTable();
    await createJobsTable();
    await createApplicationsTable();
    await createInterviewsTable();
    await createOffersTable();
    await createMessagesTable();
    await createMeetingTable(); // Create meetings table
};

initDb();

const startServer = async () => {
    const preferred = parseInt(port, 10);

    for (let p = preferred; p < preferred + MAX_PORT_ATTEMPTS; p++) {
        try {
            await new Promise((resolve, reject) => {
                const onListening = () => {
                    server.off('error', onError);
                    resolve();
                };
                const onError = (err) => {
                    server.off('listening', onListening);
                    reject(err);
                };
                server.once('listening', onListening);
                server.once('error', onError);
                server.listen(p);
            });

            console.log(`Server is running on port ${p}`);
            return;
        } catch (err) {
            if (err && err.code === 'EADDRINUSE') {
                console.warn(`Port ${p} is in use, trying next port...`);
                continue;
            } else {
                console.error('Error while trying to listen on port', p, err);
                process.exit(1);
            }
        }
    }

    console.error(`No available ports found in range ${preferred}-${preferred + MAX_PORT_ATTEMPTS - 1}.`);
    process.exit(1);
};

server.on('error', (err) => {
    console.error('Server error:', err);
});

startServer().catch(err => {
    console.error('Failed to start server', err);
    process.exit(1);
});