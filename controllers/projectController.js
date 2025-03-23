import { upload } from "../middlewares/Uploader.js";
import Project from "../models/project.js";

// API Codes
export const getAllProjects = async (req, res) => {
  try {
    const titleRegExp = new RegExp(req.query.title, "i");
    const categoryRegExp = new RegExp(req.query.category, "i");
    const projects = await Project.find({
      title: titleRegExp,
      category: categoryRegExp,
    })
      .skip((req.query.pageNum - 1) * req.query.pageSize)
      .limit(req.query.pageSize);
    res.status(200).json({ data: projects, total: projects.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOneProject = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: "Not found!" });
    res.status(200).json({ data: project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNewProject = async (req, res) => {
  try {
    upload.array("images")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const { title, description, category } = req.body;
      if (!title || !description || !category) {
        return res.status(400).json({ message: "All fields are required!" });
      }

      const images = req.files.map(
        (file) =>
          `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
      );

      const newProject = await Project({
        title,
        description,
        category,
        images,
      });
      await newProject.save();
      return res.status(201).json({
        message: "Yangi loyiha yaratildi!",
        data: newProject,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Ошибка при создании тренера",
      error: error.message,
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const updateProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updateProject) return res.status(404).json({ error: "Not found!" });

    res.status(200).json({
      message: "Loyiha yangilandi!",
      data: updateProject,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const deleteProject = await Project.findByIdAndDelete(req.params.id);
    if (!deleteProject) return res.status(404).json({ error: "Not found!" });
    res.status(200).json({ message: "Loyiha o'chirildi!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
