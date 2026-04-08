import mongoose from "mongoose";

const sessionMessageSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "SessionBooking", required: true, index: true },
    senderUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true, trim: true, maxlength: 4000 },
  },
  { timestamps: true }
);

sessionMessageSchema.index({ bookingId: 1, createdAt: 1 });

export const SessionMessage = mongoose.model("SessionMessage", sessionMessageSchema);
