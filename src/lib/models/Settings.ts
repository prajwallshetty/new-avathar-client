import mongoose, { Schema, Document, Model } from "mongoose";
import { ISettings } from "../types";

export interface ISettingsDocument extends Omit<ISettings, "_id">, Document {}

const SettingsSchema = new Schema<ISettingsDocument>(
  {
    logoUrl: { type: String, default: "" },
    brandName: { type: String, required: true, default: "New Avathar Photography" },
    whatsappNumber: { type: String, default: "" },
    instagramLink: { type: String, default: "" },
    facebookLink: { type: String, default: "" },
    footerText: { type: String, default: "© New Avathar Photography. All Rights Reserved." },
  },
  { timestamps: true }
);

const Settings: Model<ISettingsDocument> =
  mongoose.models.Settings || mongoose.model<ISettingsDocument>("Settings", SettingsSchema);

export default Settings;
