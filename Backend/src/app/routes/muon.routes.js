import express from "express";
import muonController from "../controllers/muon.controller.js";

const router = express.Router();

router.get("/", muonController.findAll);
// router.post("/", muonController.create);
// router.delete("/", muonController.deleteAll);

// router.get("/:id", muonController.findOne);
// router.put("/:id", muonController.update);
// router.delete("/:id", muonController.delete);

export default router;
