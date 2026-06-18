import mongoose from "mongoose";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "editor";
  createdAt?: string;
  updatedAt?: string;
}

export interface IEvent {
  _id?: string;
  title: string;
  eventType: "Wedding" | "Pre-Wedding" | "Engagement" | "Reception" | "Mehndi" | "Portrait" | "Maternity" | "Birthday" | "Corporate";
  date: string;
  venue: string;
  coverImage?: string;
  coverVideo?: string;
  description?: string;
  slug: string;
  status: "Draft" | "Editing" | "Delivered" | "Archived";
  template: string;
  allowDownloads: boolean;
  isPasswordProtected: boolean;
  password?: string;
  clientDetails: {
    brideName?: string;
    groomName?: string;
    personName?: string;
    gender?: "Bride" | "Groom";
    motherName?: string;
    fatherName?: string;
    celebrantName?: string;
    companyName?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface IPhoto {
  _id?: string;
  eventId: string | mongoose.Types.ObjectId;
  url: string;
  publicId: string;
  category: string;
  order: number;
  isFeatured: boolean;
  isHidden: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IVideo {
  _id?: string;
  eventId: string | mongoose.Types.ObjectId;
  url: string;
  publicId: string;
  category: string;
  order: number;
  isHidden: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IFavorite {
  _id?: string;
  eventId: string | mongoose.Types.ObjectId;
  photoId: string | mongoose.Types.ObjectId;
  sessionId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IDownload {
  _id?: string;
  eventId: string | mongoose.Types.ObjectId;
  photoId?: string | mongoose.Types.ObjectId;
  category: "single" | "bulk" | "zip";
  sessionId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IGalleryView {
  _id?: string;
  eventId: string | mongoose.Types.ObjectId;
  sessionId: string;
  userAgent?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISettings {
  _id?: string;
  logoUrl?: string;
  brandName: string;
  whatsappNumber?: string;
  instagramLink?: string;
  facebookLink?: string;
  footerText?: string;
  createdAt?: string;
  updatedAt?: string;
}
