import mongoose, { Schema, Document, Model } from "mongoose";
import { IInquiry } from "../types";

export interface IInquiryDocument extends Omit<IInquiry, "_id">, Document {}

const InquirySchema = new Schema<IInquiryDocument>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: String },
    type: {
      type: String,
      required: true,
      enum: ["wedding", "pre-wedding", "portrait", "event", "other"],
      default: "other",
    },
    message: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["New", "Replied", "Archived"],
      default: "New",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const Inquiry: Model<IInquiryDocument> =
  mongoose.models.Inquiry || mongoose.model<IInquiryDocument>("Inquiry", InquirySchema);

export default Inquiry;
