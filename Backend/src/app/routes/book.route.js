import express from "express";
import book from "../controllers/book.controller.js";
import muonRouter from "./muon.routes.js";
import requestRouter from "./request.route.js";
// chi tiet don muon
import chitietRouter from "./chitiet.route.js";
// chi tiet yeu cau
import chitietyeucauRouter from "./chitietyeucau.route.js";
import multer from "multer";

const upload = multer({
  dest: "public/uploads/",
});

const router = express.Router();

// /api/books/
router.get("/", book.findAll);
router.post("/", upload.single("IMAGE"), book.create);
router.delete("/", book.deleteAll);

// /api/books/search
router.get("/search", book.searchBooks);

// /api/books/count
router.get("/count", book.countBooks);

// /api/books/favorite
router.get("/favorite", book.findAllFavorite);

// trang thai sach
router.get("/status-approved", book.getApprovedAll);
router.get("/status-waiting", book.getWaitingAll);
router.get("/status-none", book.getNoneAll);
router.get("/status-returned", book.getReturnedAll);

// danh sach muon tra
router.use("/muon-tra", muonRouter);

// danh sach chi tiet don muon
router.use("/chi-tiet-don-muon", chitietRouter);

// danh sach yeu cau
router.use("/chi-tiet-yeu-cau", chitietyeucauRouter);

// danh sach cac yeu cau
router.use("/request", requestRouter);

// /api/books/:id
router.get("/:id", book.findOne);
router.put("/:id", upload.single("IMAGE"), book.update);
router.delete("/:id", book.delete);

export default router;
