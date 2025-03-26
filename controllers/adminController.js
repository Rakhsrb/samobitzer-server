import Admin from "../models/admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const GetAllAccounts = async (_, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json({ data: admins, total: admins.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const CreateAccount = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existedAdmin = await Admin.findOne({ email });
    if (existedAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();
    res.status(201).json({
      message: "Created successfully!",
      data: newAdmin,
    });
  } catch (error) {
    console.error("Error in CreateAccount:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const LoginToAccount = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        message: "Admin with this email does not exist!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Incorrect email or password!",
      });
    }

    const token = jwt.sign({ userId: admin._id }, process.env.JWTSECRETKEY, {
      expiresIn: "30d",
    });

    return res.status(200).json({
      message: "Success!",
      token,
    });
  } catch (error) {
    return res.json({ message: error });
  }
};

export const DeleteAccount = async (req, res) => {
  try {
    const removedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!removedAdmin) {
      return res.json({ message: "Admin not found" });
    }
    res.json({ data: removedAdmin, message: "Admin has been deleted" });
  } catch (err) {
    res.json({ error: err });
  }
};

export const UpdateAccount = async (req, res) => {
  const { email, password, name } = req.body;
  const { id } = req.params;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { name, email, password: hashedPassword },
      { new: true }
    );
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found!" });
    }
    res.status(200).json({
      message: "Admin updated successfully!",
      data: updatedAdmin,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const foundAdmin = await Admin.findById(req.userId);
    if (!foundAdmin)
      return res.status(404).json({ message: "Admin not found!" });
    return res.status(200).json(foundAdmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
