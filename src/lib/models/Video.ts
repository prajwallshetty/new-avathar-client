import mongoose, { Schema, Document, Model } from "mongoose";
import { IVideo } from "../types";

export interface IVideoDocument extends Omit<IVideo, "_id">, Document {}

const VideoSchema = new Schema<IVideoDocument>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    category: { type: String, required: true, default: "General" },
    order: { type: Number, default: 0 },
    isHidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

VideoSchema.index({ eventId: 1, isHidden: 1, order: 1 });

const Video: Model<IVideoDocument> =
  mongoose.models.Video || mongoose.model<IVideoDocument>("Video", VideoSchema);

export default Video;
