import doubtModel from "../models/doubtModel.js"
import imagekit from "../utils/imageKit.js"

export const createDoubtController = async (req, res) => {
  try {
    const { title, description } = req.body
    let image = ""

    if (req.file) {
      const file = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      const upload = await imagekit.upload({
        file,
        fileName: req.file.originalname,
      })
      image = upload.url
    }

    const doubt = await doubtModel.create({
      title,
      description,
      image,
      student: req.user._id,
      status: "unresolved",
    })

    res.status(201).json(doubt)
  } catch {
    res.status(500).json({ message: "Failed to create doubt" })
  }
}

export const getStudentDoubtsController = async (req, res) => {
  try {
    const doubts = await doubtModel
      .find({ student: req.user._id })
      .populate("mentor", "name email")
      .sort({ createdAt: -1 })

    res.json(doubts)
  } catch {
    res.status(500).json({ message: "Failed to fetch doubts" })
  }
}

export const getSingleDoubtController = async (req, res) => {
  try {
    const doubt = await doubtModel
      .findById(req.params.id)
      .populate("student", "name email")
      .populate("mentor", "name email")
      .populate("messages.sender", "name email role")

    if (!doubt) return res.status(404).json({ message: "Doubt not found" })

    res.json(doubt)
  } catch {
    res.status(500).json({ message: "Failed to load doubt" })
  }
}

export const addMessageController = async (req, res) => {
  try {
    const doubt = await doubtModel.findById(req.params.id)
    if (!doubt) return res.status(404).json({ message: "Doubt not found" })

    const isStudent = doubt.student.toString() === req.user._id.toString()
    const isMentor = req.user.role === "mentor"

    if (!isStudent && !isMentor)
      return res.status(403).json({ message: "Not authorized" })

    let image = ""
    if (req.file) {
      const file = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      const upload = await imagekit.upload({
        file,
        fileName: req.file.originalname,
      })
      image = upload.url
    }

    doubt.messages.push({
      sender: req.user._id,
      role: req.user.role,
      text: req.body.text || "",
      image,
      createdAt: new Date(),
    })

    if (isMentor && !doubt.mentor) doubt.mentor = req.user._id
    if (doubt.status === "unresolved") doubt.status = "in-progress"

    await doubt.save()
    res.json(doubt)
  } catch {
    res.status(500).json({ message: "Failed to add message" })
  }
}

export const resolveDoubtController = async (req, res) => {
  try {
    const doubt = await doubtModel.findById(req.params.id)
    if (!doubt) return res.status(404).json({ message: "Doubt not found" })

    if (doubt.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only student can close ticket" })
    }

    doubt.status = "resolved"
    doubt.resolvedAt = new Date()
    doubt.resolvedBy = req.user._id

    await doubt.save()
    res.json(doubt)
  } catch {
    res.status(500).json({ message: "Failed to close ticket" })
  }
}

export const updateDoubtController = async (req, res) => {
  try {
    const { title, description } = req.body
    let update = { title, description }

    if (req.file) {
      const file = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      const upload = await imagekit.upload({
        file,
        fileName: req.file.originalname,
      })
      update.image = upload.url
    }

    const doubt = await doubtModel.findOneAndUpdate(
      { _id: req.params.id, student: req.user._id },
      update,
      { new: true }
    )

    if (!doubt)
      return res.status(404).json({ message: "Doubt not found or unauthorized" })

    res.json(doubt)
  } catch {
    res.status(500).json({ message: "Failed to update doubt" })
  }
}

export const deleteDoubtController = async (req, res) => {
  try {
    const doubt = await doubtModel.findOneAndDelete({
      _id: req.params.id,
      student: req.user._id,
    })

    if (!doubt)
      return res.status(404).json({ message: "Doubt not found or unauthorized" })

    res.json({ message: "Ticket deleted" })
  } catch {
    res.status(500).json({ message: "Failed to delete ticket" })
  }
}

export const getAllDoubtsForMentor = async (req, res) => {
  try {
    const doubts = await doubtModel
      .find()
      .populate("student", "name email")
      .populate("mentor", "name email")
      .sort({ createdAt: -1 })

    res.json(doubts)
  } catch {
    res.status(500).json({ message: "Failed to fetch doubts" })
  }
}
