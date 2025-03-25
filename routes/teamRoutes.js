import express from "express";
import {
  getAllMembers,
  getOneMembers,
  deleteMember,
  createNewTeamate,
  updateTeamate,
} from "../controllers/teamController.js";
import IsExisted from "../middlewares/isExisted.js";

const router = express.Router();

router.get("/", getAllMembers);
router.get("/:id", getOneMembers);
router.post("/create", IsExisted, createNewTeamate);
router.put("/update/:id", IsExisted, updateTeamate);
router.delete("/delete/:id", IsExisted, deleteMember);

export default router;
