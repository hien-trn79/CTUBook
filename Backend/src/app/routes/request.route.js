import express from "express";
import requestController from "../controllers/request.controller.js";

const router = express.Router();

// /api/books/request/
router.get("/", requestController.findAll);

// Tạo mới yêu cầu mượn sách
router.post("/", requestController.create);

// Lay tong so yeu cau
router.get("/count", requestController.getCount);

// Lấy yêu cầu mượn sách theo mã độc giả
router.get("/:maDocGia", requestController.findByMaDocGia);

// Cap nhat yeu cau theo _id yeu cau
router.put("/:id", requestController.update);

export default router;
