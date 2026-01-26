import mongoose from "mongoose";

const doubtSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: { type: String, required: true },

    image: { type: String },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["unresolved", "in-progress", "resolved"],
      default: "unresolved",
    },
    
    response: {
      text: { type: String, default: "" },
      repliedAt: { type: Date },
      mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    },
    // Chat messages between student and mentor
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: { type: String, enum: ["student", "mentor"], required: true },
        text: { type: String, default: "" },
        image: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    resolvedAt: { type: Date },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const doubtModel = mongoose.model("Doubt", doubtSchema);

export default doubtModel;
