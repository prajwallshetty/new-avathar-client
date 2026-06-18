import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import BlogPost from "@/lib/models/BlogPost";

export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    await connectToDatabase();

    const post = await BlogPost.findOne({ slug: params.slug, status: "Published" });

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json({ post, success: true });
  } catch (error) {
    console.error("Fetch single blog post error:", error);
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
  }
}
