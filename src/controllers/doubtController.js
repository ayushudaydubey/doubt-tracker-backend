import doubtModel from "../models/doubtModel.js";
import imagekit from "../utils/imageKit.js";

// 1. Create Doubt
export const createDoubtController = async (req, res) => {
  const { title, description } = req.body;
  let imageUrl = null;

  try {
    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
      });
      imageUrl = uploadResponse.url;
    }

    const doubt = await doubtModel.create({
      title,
      description,
      image: imageUrl,
      student: req.user._id,
    });

    res.status(201).json(doubt);
  } catch (err) {
    console.error("Error creating doubt:", err);
    res.status(500).json({ message: "Failed to create doubt" });
  }
};

// 2. Get All Doubts of a Student
export const getDoubtsController = async (req, res) => {
  try {
    const doubts = await doubtModel.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.json(doubts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch doubts" });
  }
};

// 3. Get Single Doubt Details
export const getShowOneDoubtsController = async (req, res) => {
  try {
    const doubt = await doubtModel.findById(req.params.id)
      .populate("student", "name email")
      .populate("mentor", "name email mobile description")
      .populate("response.mentor", "name email mobile"); 
    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    res.status(200).json(doubt);
  } catch (err) {
    console.error("Error loading doubt:", err);
    res.status(500).json({ message: "Failed to load doubt" });
  }
};

// 4. Mentor Replies to Doubt
export const replyToDoubtController = async (req, res) => {
  try {
    const { response } = req.body;

    const updatedDoubt = await doubtModel.findByIdAndUpdate(
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
      .populate("response.mentor", "name email mobile"); // ✅ This line is important

    if (!updatedDoubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    res.status(200).json(updatedDoubt);
  } catch (err) {
    console.error("Reply failed:", err);
    res.status(500).json({ message: "Failed to submit response" });
  }
};



// 5. Get All Doubts for a Student (with Mentor Info)
export const getStudentDoubtsController = async (req, res) => {
  try {
    const doubts = await doubtModel
      .find({ student: req.user._id })
      .populate("mentor", "name email")
      .sort({ createdAt: -1 });

    res.json(doubts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch student doubts" });
  }
};

// 6. Update a Doubt by Student
export const updateDoubtController = async (req, res) => {
  try {
    const { title, description } = req.body;
    let updatedFields = { title, description };

    // Handle image if sent
    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
      });
      updatedFields.image = uploadResponse.url;
    }

    const doubt = await doubtModel.findOneAndUpdate(
      { _id: req.params.id, student: req.user._id },
      updatedFields,
      { new: true }
    );

    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found or unauthorized" });
    }

    res.json(doubt);
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ message: "Failed to update doubt" });
  }
};

// 7. Get All Doubts for Mentor Dashboard
export const getAllDoubtsController = async (req, res) => {
  try {
    const doubts = await doubtModel
      .find()
      .populate("student", "name email")
      .populate("mentor", "name email")
      .sort({ createdAt: -1 });

    res.json(doubts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all doubts" });
  }
};

// 8. Delete a doubt by student
export const deleteDoubtController = async (req, res) => {
  try {
    const doubt = await doubtModel.findOneAndDelete({
      _id: req.params.id,
      student: req.user._id,
    });

    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found or unauthorized" });
    }

    res.json({ message: "Doubt deleted successfully" });
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({ message: "Failed to delete doubt" });
  }
};

