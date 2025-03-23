import express from "express";
import {
  getAllMembers,
  getOneMembers,
  createMember,
  updateMember,
  deleteMember,
} from "../controllers/teamController.js";
import IsExisted from "../middlewares/isExisted.js";

const router = express.Router();

router.get("/", getAllMembers);
router.get("/:id", getOneMembers);
router.post("/create", IsExisted, createMember);
router.put("/update/:id", IsExisted, updateMember);
router.delete("/delete/:id", IsExisted, deleteMember);

export default router;
