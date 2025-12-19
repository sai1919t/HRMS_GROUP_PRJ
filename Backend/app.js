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
// allow updating location via users route (updateUser supports it now)
import usersRoutes from './routes/users.routes.js';
app.use('/api/users', usersRoutes);
app.use("/api/appreciations", appreciationRoutes);
app.use("/api/employee-of-month", employeeOfMonthRoutes);


app.use("/api/jobs", jobRoutes);
app.use("/api", applicationRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/meetings", meetingRoutes);

// activities
import activitiesRoutes from './routes/activities.routes.js';
app.use('/api/activities', activitiesRoutes);

// Serve static files
app.use('/assets', express.static('assets'));

// uploads routes (file management)
import uploadsRoutes from './routes/uploads.routes.js';
app.use('/api/uploads', uploadsRoutes);

app.get("/", (req, res) => {
    res.send("Hello World");
});

// admin routes (grant points)
import adminRoutes from './routes/admin.routes.js';
app.use('/api/admin', adminRoutes);

// Lightweight contact endpoint — replace with real mailer/service as needed
import nodemailer from 'nodemailer';

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing fields' });
        }
        console.log('Contact submission:', { name, email, message });

        // If SMTP configured, send mail
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587', 10),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                }
            });

            const to = process.env.CONTACT_TO || process.env.SMTP_USER;

            await transporter.sendMail({
                from: email,
                to,
                subject: `Contact form: ${name}`,
                text: message,
                html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p>${message}</p>`
            });
        }

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

        // If SMTP configured, send a notification email
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587', 10),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                }
            });
            const to = process.env.FEEDBACK_TO || process.env.SMTP_USER;
            await transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: `New feedback: ${rating} stars`,
                text: `${comment || ''}`,
                html: `<p><strong>Rating:</strong> ${rating}</p><p>${comment || ''}</p>`
            });
        }

        // TODO: persist or forward to service
        return res.status(201).json({ success: true });
    } catch (err) {
        console.error('Feedback error', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

export default app;
