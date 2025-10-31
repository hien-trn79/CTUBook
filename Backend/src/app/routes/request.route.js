import express from "express";
import requestController from "../controllers/request.controller.js";

const router = express.Router();

// /api/books/request/
router.get("/", requestController.findAll);
router.get("/:maDocGia", requestController.findByMaDocGia);

export default router;
