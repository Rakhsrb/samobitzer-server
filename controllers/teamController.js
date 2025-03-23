import Team from "../models/team.js";

// getAllMembers
export const getAllMembers = async (req, res) => {
  try {
    const team = await Team.find();
    res.json({ data: team });
  } catch (err) {
    res.json({ error: err });
  }
};

// getOneMember
export const getOneMembers = async (req, res) => {
  try {
    const memberData = await Team.findById(req.params.id);
    if (!memberData) return res.json({ error: "Member not found" });
    res.json({ data: memberData });
  } catch (err) {
    res.json({ error: err });
  }
};

// CreateMember
export const createMember = async (req, res) => {
  const { name, job, image } = req.body;
  try {
    const newMember = await Team({ name, job, image });
    await newMember.save();
    return res.json({
      data: newMember,
      message: "New member has been created",
    });
  } catch (err) {
    res.json({ error: err });
  }
};

//  UpdateMember
export const updateMember = async (req, res) => {
  try {
    const member = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!member) return res.json({ error: "Member not found" });
    res.json({ data: member, message: "Member has been updated" });
  } catch (err) {
    res.json({ error: err });
  }
};

//  DeleteMember
export const deleteMember = async (req, res) => {
  try {
    const member = await Team.findByIdAndDelete(req.params.id);
    if (!member) return res.json({ error: "Member not found" });
  } catch (err) {
    res.json({ error: err });
  }
};
