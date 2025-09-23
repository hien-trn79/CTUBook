import express from "express";
import book from "../controllers/book.controller.js";

const router = express.Router();

// /api/books/
router.get("/", book.findAll);
router.post("/", book.create);
router.delete("/", book.deleteAll);

// /api/books/:id
router.get("/:id", book.findOne);
router.put("/:id", book.update);
router.delete("/:id", book.delete);

export default router;
