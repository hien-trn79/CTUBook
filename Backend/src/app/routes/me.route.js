import express from "express";
import meController from "../controllers/me.controller.js";

const router = express.Router();

// [GET] /api/me/
router.get("/", meController.findByUsername);

export default router;
