import express from "express";
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getMenuItems);
router.get("/:id", getMenuItemById);
router.post("/", protect, adminOnly, createMenuItem);
router.put("/:id", protect, adminOnly, updateMenuItem);
router.delete("/:id", protect, adminOnly, deleteMenuItem);

export default router;
