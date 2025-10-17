import express from "express";
import requestController from "../controllers/request.controller.js";

const router = express.Router();

// /api/books/request/
router.get("/", requestController.findAll);

export default router;
