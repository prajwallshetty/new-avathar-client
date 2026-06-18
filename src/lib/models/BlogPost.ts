import mongoose, { Schema, Document, Model } from "mongoose";
import { IBlogPost } from "../types";

export interface IBlogPostDocument extends Omit<IBlogPost, "_id">, Document {}

const BlogPostSchema = new Schema<IBlogPostDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    coverImage: { type: String, default: "" },
    category: { type: String, required: true, index: true },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["Draft", "Published"], default: "Draft", index: true },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    seoKeywords: { type: [String], default: [] },
    author: { type: String, default: "New Avatar Team" },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const BlogPost: Model<IBlogPostDocument> =
  mongoose.models.BlogPost || mongoose.model<IBlogPostDocument>("BlogPost", BlogPostSchema);

export default BlogPost;
