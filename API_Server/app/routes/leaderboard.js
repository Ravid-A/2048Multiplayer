import express from "express";

import controllers from "../controllers/leaderboard.js";

import protect from "../middlewares/auth.js";

const router = express.Router();

router.get("/", protect, controllers.GetScore);
router.patch("/", protect, controllers.UpdateScore);

export default router;
