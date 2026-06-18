import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import BlogPost from "@/lib/models/BlogPost";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "editor")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await connectToDatabase();
    const posts = await BlogPost.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ posts, success: true });
  } catch (error) {
    console.error("Admin fetch blog posts error:", error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "editor")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await connectToDatabase();
    const body = await request.json();

    const { title, content, excerpt, category } = body;
    if (!title || !content || !excerpt || !category) {
      return NextResponse.json({ error: "Missing required fields: title, content, excerpt, and category are required" }, { status: 400 });
    }

    // Auto-generate slug if not provided
    if (!body.slug || body.slug.trim() === "") {
      let slugBase = title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");
      
      body.slug = `${slugBase}-${Math.floor(Math.random() * 10000)}`;
    } else {
      body.slug = body.slug
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");
    }

    // Set publishedAt if status is Published
    if (body.status === "Published") {
      body.publishedAt = new Date();
    } else {
      body.publishedAt = null;
    }

    const newPost = await BlogPost.create(body);

    return NextResponse.json({ post: newPost, success: true }, { status: 201 });
  } catch (error: any) {
    console.error("Admin create blog post error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Blog post slug already exists, please customize the title or slug" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
