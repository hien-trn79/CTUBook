import express from "express";
import userController from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", userController.findAll);
router.post("/", userController.create);
router.delete("/", userController.deleteAll);

router.get("/:id", userController.findOne);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);

export default router;
