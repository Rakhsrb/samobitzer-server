import { upload } from "../middlewares/Uploader.js";
import Service from "../models/service.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllServices = async (req, res) => {
  try {
    const titleRegExp = new RegExp(req.query.title, "i");
    const services = await Service.find({
      title: titleRegExp,
    })
      .skip((req.query.pageNum - 1) * req.query.pageSize)
      .limit(req.query.pageSize);
    res.status(200).json({ data: services, total: services.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOneService = async (req, res) => {
  try {
    const id = req.params.id;
    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ error: "Service not found!" });
    res.status(200).json({ data: service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNewService = async (req, res) => {
  try {
    upload.single("image")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const { title, description } = req.body;
      if (!title || !description) {
        return res.status(400).json({ message: "All fields are required!" });
      }

      const image = req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : null;

      const newService = await Service({
        title,
        description,
        image,
      });
      await newService.save();
      return res.status(201).json({
        message: "New services has been created successfully!",
        data: newService,
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error with creating service", error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    upload.single("image")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const { title, description } = req.body;
      if (!title || !description) {
        return res.status(400).json({ message: "All fields are required!" });
      }

      const updateData = {
        title,
        description,
      };

      if (req.file) {
        updateData.image = `${req.protocol}://${req.get("host")}/uploads/${
          req.file.filename
        }`;
      }

      const updatedService = await Service.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedService) {
        return res.status(404).json({ message: "Service not found" });
      }

      res.status(200).json(updatedService);
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error with updating service", error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const deleteService = await Service.findByIdAndDelete(req.params.id);
    if (!deleteService) return res.status(404).json({ message: "NOT FOUND!" });

    if (deleteService.image) {
      const slicedPhoto = deleteService.image.slice(30);
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

    return res.status(200).json({ message: "Service has been deleted!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
