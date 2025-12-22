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
import { createEventTable } from "./models/event.model.js";

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
        console.log("📨 Server: send_message received. Data:", JSON.stringify(data, null, 2));
        // Data expected: { senderId, receiverId, message, room, id (tempId) }

        // Save to DB
        try {
            if (data.senderId && data.receiverId) {
                const savedMsg = await createMessage(data.senderId, data.receiverId, data.message);

                // Normalize created_at to ISO (UTC) so clients can reliably convert to local time
                const createdAtIso = savedMsg.created_at ? new Date(savedMsg.created_at).toISOString() : new Date().toISOString();

                // Ack to Sender with Real ID and ISO timestamp
                socket.emit("message_sent", { tempId: data.id, id: savedMsg.id, created_at: createdAtIso });
                console.log(`📤 Server: Emitted message_sent to sender. TempID: ${data.id}, RealID: ${savedMsg.id}`);

                data.id = savedMsg.id; // Add DB id to data
                data.created_at = createdAtIso;
            }
        } catch (err) {
            console.error("Error saving message:", err);
        }

        // Broadcast the message to everyone (simplest for now) or specific room
        // socket.broadcast.emit("receive_message", data);

        // BETTER: Send only to receiver
        const receiverSocketId = onlineUsers.get(String(data.receiverId));
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receive_message", { ...data, status: 'sent' });
        }
    });

    socket.on("message_delivered", async (data) => {
        console.log("🔔 Server: Received message_delivered:", data);
        // data: { messageId, senderId }
        const { updateMessageStatus } = await import('./models/message.model.js');
        if (data.messageId) await updateMessageStatus(data.messageId, 'delivered');

        const senderSocketId = onlineUsers.get(String(data.senderId));
        console.log(`🔍 Looking for sender ${data.senderId}. Socket ID: ${senderSocketId}`);

        if (senderSocketId) {
            io.to(senderSocketId).emit("message_status_update", { id: data.messageId, status: 'delivered' });
            console.log(`📤 Emitted message_status_update (delivered) to ${data.senderId}`);
        } else {
            console.warn(`⚠️ Sender ${data.senderId} not found in onlineUsers`);
        }
    });

    socket.on("message_read", async (data) => {
        console.log("🔔 Server: Received message_read:", data);
        // data: { messageId, senderId }
        const { updateMessageStatus } = await import('./models/message.model.js');
        if (data.messageId) await updateMessageStatus(data.messageId, 'read');

        const senderSocketId = onlineUsers.get(String(data.senderId));
        if (senderSocketId) {
            io.to(senderSocketId).emit("message_status_update", { id: data.messageId, status: 'read' });
            console.log(`📤 Emitted message_status_update (read) to ${data.senderId}`);
        }
    });

    socket.on("edit_message", async (data) => {
        // data: { id, text, receiverId }
        const receiverSocketId = onlineUsers.get(String(data.receiverId));
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("message_updated", { id: data.id, text: data.text });
        }
    });

    socket.on("delete_message", async (data) => {
        // data: { id, receiverId }
        const receiverSocketId = onlineUsers.get(String(data.receiverId));
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("message_deleted", { id: data.id });
        }
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

// API for Message Actions (Edit/Delete)
app.put("/api/messages/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const { editMessage } = await import('./models/message.model.js');
        const updated = await editMessage(id, message);
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to edit message" });
    }
});

app.delete("/api/messages/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { deleteMessage } = await import('./models/message.model.js');
        const deleted = await deleteMessage(id);
        res.json(deleted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete message" });
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
        const { fullname, email, designation, profile_picture, gender } = req.body;

        // Basic validation
        if (!fullname || !email) {
            return res.status(400).json({ error: "Name and Email are required" });
        }

        const updatedUser = await updateUserProfile(id, fullname, email, designation, profile_picture, gender);

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
    // create points table
    try {
        const { createPointsTable } = await import('./models/points.model.js');
        await createPointsTable();
    } catch (err) {
        console.error('Error creating points table', err);
    }

    // create redemption tables
    try {
        const { createRedemptionTables } = await import('./models/redemption.model.js');
        await createRedemptionTables();
    } catch (err) {
        console.error('Error creating redemption tables', err);
    }

    // create promotions tables
    try {
        const { createPromotionsTable } = await import('./models/promotion.model.js');
        await createPromotionsTable();
    } catch (err) {
        console.error('Error creating promotions tables', err);
    }

    await createEventTable(); // Create events and event_attendees tables

    // create dashboard stats table
    try {
        const { createDashboardStatsTable } = await import('./models/dashboard.model.js');
        await createDashboardStatsTable();
    } catch (err) {
        console.error('Error creating dashboard stats table', err);
    }
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