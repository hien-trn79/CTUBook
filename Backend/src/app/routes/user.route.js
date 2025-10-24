import express from "express";
import userController from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", userController.findAll);
router.post("/", userController.create);
router.delete("/", userController.deleteAll);

router.get("/:username", userController.findOne);
router.put("/:username", userController.update);
router.delete("/:username", userController.delete);

export default router;
