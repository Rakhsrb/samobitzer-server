import Service from "../models/service.js";

// get all services
export const getAllServices = async (req, res) => {
  try {
    const titleRegExp = new RegExp(req.query.title, "i");
    const categoryRegExp = new RegExp(req.query.category, "i");
    const services = await Service.find({
      title: titleRegExp,
      category: categoryRegExp,
    })
      .skip((req.query.pageNum - 1) * req.query.pageSize)
      .limit(req.query.pageSize);
    res.status(200).json({ data: services, total: services.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get one service
export const getOneService = async (req, res) => {
  try {
    const id = req.params.id;
    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ error: "Not found!" });
    res.status(200).json({ data: service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// create new service
export const createNewService = async (req, res) => {
  try {
    const { title, description, category, images } = req.body;
    const newService = await Service({
      title,
      description,
      category,
      images,
    });
    await newService.save();
    return res.status(201).json({
      message: "Yangi xizmat yaratildi!",
      data: newService,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedService = await Service.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedService) {
      return res.status(404).json({ error: "Service not found!" });
    }
    res.status(200).json({
      message: "Service updated successfully!",
      data: updatedService,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete service
export const deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) return res.status(404).json({ error: "Not found!" });
    res.status(200).json({ message: "Xizmat o'chirildi!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
