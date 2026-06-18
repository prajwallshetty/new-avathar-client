import mongoose, { Schema, Document, Model } from "mongoose";
import { IEvent } from "../types";

export interface IEventDocument extends Omit<IEvent, "_id">, Document {}

const EventSchema = new Schema<IEventDocument>(
  {
    title: { type: String, required: true },
    eventType: {
      type: String,
      required: true,
      enum: ["Wedding", "Pre-Wedding", "Engagement", "Reception", "Mehndi", "Portrait", "Maternity", "Birthday", "Corporate"],
    },
    date: { type: String, required: true },
    venue: { type: String, required: true },
    coverImage: { type: String, default: "" },
    coverVideo: { type: String, default: "" },
    description: { type: String, default: "" },
    slug: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      required: true,
      enum: ["Draft", "Editing", "Delivered", "Archived"],
      default: "Draft",
    },
    template: { type: String, default: "Wedding Luxury" },
    allowDownloads: { type: Boolean, default: true },
    isPasswordProtected: { type: Boolean, default: false },
    password: { type: String, default: "" },
    clientDetails: {
      brideName: { type: String },
      groomName: { type: String },
      personName: { type: String },
      gender: { type: String, enum: ["Bride", "Groom"] },
      motherName: { type: String },
      fatherName: { type: String },
      celebrantName: { type: String },
      companyName: { type: String },
    },
  },
  { timestamps: true }
);

const Event: Model<IEventDocument> =
  mongoose.models.Event || mongoose.model<IEventDocument>("Event", EventSchema);

export default Event;
