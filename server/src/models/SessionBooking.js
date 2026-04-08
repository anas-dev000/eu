import mongoose from "mongoose";

const sessionBookingSchema = new mongoose.Schema(
  {
    bookerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    startAt: { type: Date, required: true, index: true },
    endAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "cancelled_by_user", "cancelled_by_specialist"],
      default: "pending",
      index: true,
    },
    patientFullName: { type: String, required: true, trim: true },
    patientAgeYears: { type: Number, min: 0, max: 120 },
    patientDateOfBirth: { type: Date },
    relationshipToPatient: { type: String, required: true, trim: true },
    contactPhone: { type: String, required: true, trim: true },
    contactPhoneAlt: { type: String, trim: true },
    cityOrRegion: { type: String, trim: true },
    concernsSummary: { type: String, required: true, trim: true },
    priorDiagnosisSummary: { type: String, trim: true },
    additionalNotes: { type: String, trim: true },
    specialistInternalNote: { type: String, trim: true },
  },
  { timestamps: true }
);

sessionBookingSchema.index({ startAt: 1, endAt: 1 });

export const SessionBooking = mongoose.model("SessionBooking", sessionBookingSchema);
