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
  },
  {
    timestamps: true,
  }
);

const doubtModel = mongoose.model("Doubt", doubtSchema);

export default doubtModel;
