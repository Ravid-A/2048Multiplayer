import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import database from "./database.js";

import users from "./routes/users.js";

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", users);

database.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
