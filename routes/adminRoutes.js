import express from "express";
import {
  CreateAccount,
  DeleteAccount,
  GetAllAccounts,
  getUser,
  LoginToAccount,
  UpdateAccount,
} from "../controllers/adminController.js";
import IsExisted from "../middlewares/isExisted.js";

const router = express.Router();

router.get("/", IsExisted, GetAllAccounts);
router.get("/profile", IsExisted, getUser);
router.post("/login", LoginToAccount);
router.post("/register", IsExisted, CreateAccount);
router.delete("/delete/:id", IsExisted, DeleteAccount);
router.put("/update/:id", IsExisted, UpdateAccount);

export default router;
