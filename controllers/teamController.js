import { upload } from "../middlewares/Uploader.js";
import Team from "../models/team.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllMembers = async (req, res) => {
  try {
    const team = await Team.find();
    res.json({ data: team });
  } catch (err) {
    res.json({ error: err });
  }
};

export const getOneMembers = async (req, res) => {
  try {
    const memberData = await Team.findById(req.params.id);
    if (!memberData) return res.json({ error: "Teamate not found" });
    res.json({ data: memberData });
  } catch (err) {
    res.json({ error: err });
  }
};

export const createNewTeamate = async (req, res) => {
  try {
    upload.single("image")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const { name, experience } = req.body;
      if (!name || !experience) {
        return res.status(400).json({ message: "All fields are required!" });
      }

      const image = req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : null;

      const newTeamate = await Team({
        name,
        experience,
        image,
      });
      await newTeamate.save();
      return res.status(201).json({
        message: "New teamate has been created successfully!",
        data: newTeamate,
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error with creating", error: error.message });
  }
};

export const updateTeamate = async (req, res) => {
  try {
    upload.single("image")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const { name, experience } = req.body;
      if (!name || !experience) {
        return res.status(400).json({ message: "All fields are required!" });
      }

      const updateData = {
        name,
        experience,
      };

      if (req.file) {
        updateData.image = `${req.protocol}://${req.get("host")}/uploads/${
          req.file.filename
        }`;
      }

      const updatedTeamate = await Team.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedTeamate) {
        return res.status(404).json({ message: "Teamate not found" });
      }

      res.status(200).json(updatedTeamate);
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error with updating", error: error.message });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const member = await Team.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: "NOT FOUND!" });

    if (member.image) {
      const slicedPhoto = member.image.slice(30);
      const filePath = path.join(__dirname, "..", "uploads", slicedPhoto);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        } else {
          console.warn(`File not found: ${filePath}`);
        }
      } catch (err) {
        console.error(`Failed to delete image: ${filePath}`, err);
      }
    }

    return res.status(200).json({ message: "Teamate has been deleted!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
