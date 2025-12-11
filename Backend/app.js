import express from "express"; // main app
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import appreciationRoutes from "./routes/appreciation.routes.js";
import employeeOfMonthRoutes from "./routes/employeeOfMonth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/appreciations", appreciationRoutes);
app.use("/api/employee-of-month", employeeOfMonthRoutes);

app.get("/", (req, res) => {
    res.send("Hello World");
});

export default app;
