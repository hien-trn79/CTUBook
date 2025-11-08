import express from "express";
import meController from "../controllers/me.controller.js";

const router = express.Router();

// [GET] /api/me/
router.get("/", meController.findByUsername);

// [POST] /api/me/
router.post("/", meController.create);

// [GET] /api/me/my-cart/:id
router.get("/my-cart/:id", meController.getMyCart);

// [PUT] /api/me/my-cart/:id
router.put("/my-cart/:id", meController.updateMyCart);

// [DELETE] /api/me/my-cart/:id
router.delete("/my-cart/:id", meController.deleteMyCart);

export default router;
