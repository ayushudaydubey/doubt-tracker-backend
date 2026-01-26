import doubtModel from "../models/doubtModel.js"
import imagekit from "../utils/imageKit.js"

export const createDoubtController = async (req, res) => {
  const { title, description } = req.body
  let imageUrl = null
  try {
    if (req.file) {
      const base64 = req.file.buffer.toString("base64")
      const fileData = `data:${req.file.mimetype};base64,${base64}`
      const uploadResponse = await imagekit.upload({
        file: fileData,
        fileName: req.file.originalname,
      })
      imageUrl = uploadResponse.url
    }
    const doubt = await doubtModel.create({
      title,
      description,
      image: imageUrl,
      student: req.user._id,
    })
    res.status(201).json(doubt)
  } catch {
    res.status(500).json({ message: "Failed to create doubt" })
  }
}

export const getDoubtsController = async (req, res) => {
  try {
    const doubts = await doubtModel
      .find({ student: req.user._id })
      .sort({ createdAt: -1 })
    res.json(doubts)
  } catch {
    res.status(500).json({ message: "Failed to fetch doubts" })
  }
}

export const getShowOneDoubtsController = async (req, res) => {
  try {
    const doubt = await doubtModel
      .findById(req.params.id)
      .populate("student", "name email")
      .populate("mentor", "name email mobile description")
      .populate("response.mentor", "name email mobile")
      .populate("messages.sender", "name email")
    if (!doubt) return res.status(404).json({ message: "Doubt not found" })
    res.json(doubt)
  } catch {
    res.status(500).json({ message: "Failed to load doubt" })
  }
}

export const replyToDoubtController = async (req, res) => {
  try {
    const { response } = req.body
    const updatedDoubt = await doubtModel
      .findByIdAndUpdate(
        req.params.id,
        {
          response: {
            text: response,
            repliedAt: new Date(),
            mentor: req.user._id,
          },
          mentor: req.user._id,
          status: "resolved",
        },
        { new: true }
      )
      .populate("student", "name email")
      .populate("mentor", "name email mobile description")
      .populate("response.mentor", "name email mobile")
    if (!updatedDoubt) return res.status(404).json({ message: "Doubt not found" })
    res.json(updatedDoubt)
  } catch {
    res.status(500).json({ message: "Failed to submit response" })
  }
}

export const addMessageController = async (req, res) => {
  try {
    const doubt = await doubtModel.findById(req.params.id)
    if (!doubt) return res.status(404).json({ message: "Doubt not found" })

    if (
      doubt.student.toString() !== req.user._id.toString() &&
      req.user.role !== "mentor"
    ) {
      return res.status(403).json({ message: "Not authorized" })
    }

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
    })

    if (req.user.role === "mentor") doubt.mentor = req.user._id
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

    if (
      doubt.student.toString() !== req.user._id.toString() &&
      req.user.role !== "mentor"
    ) {
      return res.status(403).json({ message: "Not authorized" })
    }

    doubt.status = "resolved"
    doubt.resolvedAt = new Date()
    doubt.resolvedBy = req.user._id
    if (req.user.role === "mentor") doubt.mentor = req.user._id

    await doubt.save()

    res.json(doubt)
  } catch {
    res.status(500).json({ message: "Failed to resolve doubt" })
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
    res.status(500).json({ message: "Failed to fetch student doubts" })
  }
}

export const updateDoubtController = async (req, res) => {
  try {
    const { title, description } = req.body
    let updatedFields = { title, description }
    if (req.file) {
      const base64 = req.file.buffer.toString("base64")
      const fileData = `data:${req.file.mimetype};base64,${base64}`
      const uploadResponse = await imagekit.upload({
        file: fileData,
        fileName: req.file.originalname,
      })
      updatedFields.image = uploadResponse.url
    }
    const doubt = await doubtModel.findOneAndUpdate(
      { _id: req.params.id, student: req.user._id },
      updatedFields,
      { new: true }
    )
    if (!doubt)
      return res.status(404).json({ message: "Doubt not found or unauthorized" })
    res.json(doubt)
  } catch {
    res.status(500).json({ message: "Failed to update doubt" })
  }
}

export const getAllDoubtsController = async (req, res) => {
  try {
    const doubts = await doubtModel
      .find()
      .populate("student", "name email")
      .populate("mentor", "name email")
      .sort({ createdAt: -1 })
    res.json(doubts)
  } catch {
    res.status(500).json({ message: "Failed to fetch all doubts" })
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
    res.json({ message: "Doubt deleted successfully" })
  } catch {
    res.status(500).json({ message: "Failed to delete doubt" })
  }
}