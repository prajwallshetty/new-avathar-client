import mongoose, { Schema, Document, Model } from "mongoose";
import { IPhoto } from "../types";

export interface IPhotoDocument extends Omit<IPhoto, "_id">, Document {}

const PhotoSchema = new Schema<IPhotoDocument>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    category: { type: String, required: true, default: "General" },
    order: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isHidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Add compound index for fast loading and ordering
PhotoSchema.index({ eventId: 1, isHidden: 1, order: 1 });

const Photo: Model<IPhotoDocument> =
  mongoose.models.Photo || mongoose.model<IPhotoDocument>("Photo", PhotoSchema);

export default Photo;
