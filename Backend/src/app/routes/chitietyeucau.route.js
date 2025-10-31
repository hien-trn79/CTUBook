import express from "express";
import chitietyeucauControlller from "../controllers/ChiTietYeuCau.controller.js";

const router = express.Router();

// [GET] /api/books/chi-tiet-yeu-cau/
router.get("/", chitietyeucauControlller.findAll);
// [GET] /api/books/chi-tiet-yeu-cau/:MAYEUCAU
router.get("/:MAYEUCAU", chitietyeucauControlller.findByIDMAYEUCAU);

export default router;
