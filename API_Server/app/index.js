import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import users from "./routes/users.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", users);

export default app;
