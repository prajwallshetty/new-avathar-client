import mongoose, { Schema, Document, Model } from "mongoose";
import { IDownload } from "../types";

export interface IDownloadDocument extends Omit<IDownload, "_id">, Document {}

const DownloadSchema = new Schema<IDownloadDocument>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    photoId: { type: Schema.Types.ObjectId, ref: "Photo" },
    category: { type: String, enum: ["single", "bulk", "zip"], default: "single" },
    sessionId: { type: String, required: true },
  },
  { timestamps: true }
);

const Download: Model<IDownloadDocument> =
  mongoose.models.Download || mongoose.model<IDownloadDocument>("Download", DownloadSchema);

export default Download;
