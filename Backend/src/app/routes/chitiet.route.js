import express from "express";
import chitietController from "../controllers/ChiTietDonMuon.controller.js";

const router = express.Router();

// [GET] /api/books/chi-tiet-don-muon/
router.get("/", chitietController.findAll);

// [GET] /api/books/chi-tiet-don-muon/:MADONMUON
router.get("/:MADONMUON", chitietController.findByIDDonMuon);

export default router;
