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

const port = process.env.PORT || 3000;

const server = http.createServer(app);

// Initialize database tables
const initDb = async () => {
    await createUserTable();
    await createBlacklistTable();
    await createAppreciationsTable();
    await createLikesTable();
    await createCommentsTable();
    await createEmployeeOfMonthTable();
    await createEmployeeOfMonthTeamTable();
};

initDb();

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});