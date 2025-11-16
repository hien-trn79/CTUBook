import express from "express";
import muonController from "../controllers/muon.controller.js";

const router = express.Router();

// [Get] /api/books/muon-tra
router.get("/", muonController.findAll);

// [GET] /api/books/muon-tra/:MADOCGIA
router.get("/:MADOCGIA", muonController.findByMaDocGia);
router.delete("/:MADOCGIA", muonController.delete);

export default router;
