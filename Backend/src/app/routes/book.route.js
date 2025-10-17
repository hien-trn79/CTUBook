import express from "express";
import book from "../controllers/book.controller.js";
import muonRouter from "./muon.routes.js";
import requestRouter from "./request.route.js";
import multer from "multer";

const upload = multer({
  dest: "public/uploads/",
});

const router = express.Router();

// /api/books/
router.get("/", book.findAll);
router.post("/", upload.single("IMAGE"), book.create);
router.delete("/", book.deleteAll);

// /api/books/favorite
router.get("/favorite", book.findAllFavorite);

// trang thai sach
router.get("/status-approved", book.getApprovedAll);
router.get("/status-waiting", book.getWaitingAll);
router.get("/status-none", book.getNoneAll);
router.get("/status-returned", book.getReturnedAll);

// danh sach muon tra
router.use("/muon-tra", muonRouter);

// danh sach cac yeu cau
router.use("/request", requestRouter);

// /api/books/:id
router.get("/:id", book.findOne);
router.put("/:id", upload.single("IMAGE"), book.update);
router.delete("/:id", book.delete);

export default router;
