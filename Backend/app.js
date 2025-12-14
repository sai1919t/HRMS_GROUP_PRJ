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


app.get("/", (req, res) => {
    res.send("Hello World");
});

export default app;
