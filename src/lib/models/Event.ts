import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEvent extends Document {
  brideName: string;
  groomName: string;
  eventType: string;
  date: Date;
  coverImage: string;
  slug: string;
  template: string;
  images: { url: string; publicId: string }[];
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    brideName: { type: String, required: true },
    groomName: { type: String, required: true },
    eventType: { type: String, required: true },
    date: { type: Date, required: true },
    coverImage: { type: String },
    slug: { type: String, required: true, unique: true },
    template: { type: String, default: "default" },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
