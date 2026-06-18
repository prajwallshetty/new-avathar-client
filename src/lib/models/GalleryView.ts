import mongoose, { Schema, Document, Model } from "mongoose";
import { IGalleryView } from "../types";

export interface IGalleryViewDocument extends Omit<IGalleryView, "_id">, Document {}

const GalleryViewSchema = new Schema<IGalleryViewDocument>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    userAgent: { type: String },
  },
  { timestamps: true }
);

const GalleryView: Model<IGalleryViewDocument> =
  mongoose.models.GalleryView || mongoose.model<IGalleryViewDocument>("GalleryView", GalleryViewSchema);

export default GalleryView;
