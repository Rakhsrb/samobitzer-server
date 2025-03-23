import express from "express";
import {
  CreateAccount,
  DeleteAccount,
  GetAllAccounts,
  LoginToAccount,
  UpdateAccount,
} from "../controllers/adminController.js";
import IsExisted from "../middlewares/isExisted.js";

const router = express.Router();

router.get("/", IsExisted, GetAllAccounts);
router.post("/login", LoginToAccount);
router.post("/register", IsExisted, CreateAccount);
router.delete("/delete/:id", IsExisted, DeleteAccount);
router.put("/update/:id", IsExisted, UpdateAccount);

export default router;
