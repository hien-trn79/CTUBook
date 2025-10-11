import brandController from "../controllers/brand.controller.js";
import express from "express";

const router = express.Router();

router.get("/", brandController.findAll);
router.post("/", brandController.create);
router.delete("/", brandController.deleteAll);

router.get("/:id", brandController.findOne);
router.put("/:id", brandController.update);
router.delete("/:id", brandController.delete);

export default router;
