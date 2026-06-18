import mongoose, { Schema, Document, Model } from "mongoose";
import { IFavorite } from "../types";

export interface IFavoriteDocument extends Omit<IFavorite, "_id">, Document {}

const FavoriteSchema = new Schema<IFavoriteDocument>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    photoId: { type: Schema.Types.ObjectId, ref: "Photo", required: true, index: true },
    sessionId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

const Favorite: Model<IFavoriteDocument> =
  mongoose.models.Favorite || mongoose.model<IFavoriteDocument>("Favorite", FavoriteSchema);

export default Favorite;
