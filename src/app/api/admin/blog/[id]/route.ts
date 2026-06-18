import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import BlogPost from "@/lib/models/BlogPost";
import { getSession } from "@/lib/auth";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "editor")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const params = await props.params;
    await connectToDatabase();

    const post = await BlogPost.findById(params.id);
    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json({ post, success: true });
  } catch (error) {
    console.error("Admin fetch single blog post error:", error);
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "editor")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const params = await props.params;
    await connectToDatabase();
    const body = await request.json();

    const existingPost = await BlogPost.findById(params.id);
    if (!existingPost) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Format slug if changed
    if (body.slug) {
      body.slug = body.slug
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");
    }

    // Handle published date transition
    if (body.status === "Published" && existingPost.status !== "Published") {
      body.publishedAt = new Date();
    } else if (body.status === "Draft") {
      body.publishedAt = null;
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(params.id, body, { new: true });

    return NextResponse.json({ post: updatedPost, success: true });
  } catch (error: any) {
    console.error("Admin edit blog post error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Blog post slug already exists, please choose a different slug" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "editor")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const params = await props.params;
    await connectToDatabase();

    const deletedPost = await BlogPost.findByIdAndDelete(params.id);

    if (!deletedPost) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Admin delete blog post error:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
