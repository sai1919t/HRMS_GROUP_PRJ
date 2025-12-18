import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import appreciationRoutes from "./routes/appreciation.routes.js";
import employeeOfMonthRoutes from "./routes/employeeOfMonth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import offerRoutes from "./routes/offer.routes.js";
import { initDb } from "./db/initDb.js";
import meetingRoutes from "./routes/meeting.routes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initDb();

app.use("/api/users", userRoutes);
app.use("/api/appreciations", appreciationRoutes);
app.use("/api/employee-of-month", employeeOfMonthRoutes);


app.use("/api/jobs", jobRoutes);
app.use("/api", applicationRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/meetings", meetingRoutes);


// Serve static files
app.use('/assets', express.static('assets'));


app.get("/", (req, res) => {
    res.send("Hello World");
});

// Lightweight contact endpoint — replace with real mailer/service as needed
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing fields' });
        }
        console.log('Contact submission:', { name, email, message });
        // TODO: hook up nodemailer or other service here
        return res.status(201).json({ success: true, message: 'Received' });
    } catch (err) {
        console.error('Contact error', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Lightweight feedback endpoint
app.post('/api/feedback', async (req, res) => {
    try {
        const { rating, comment } = req.body;
        if (!rating) return res.status(400).json({ error: 'Rating required' });
        console.log('Feedback submission:', { rating, comment });
        // TODO: persist or forward to service
        return res.status(201).json({ success: true });
    } catch (err) {
        console.error('Feedback error', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

export default app;
