import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import BlogPost from "@/lib/models/BlogPost";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    await connectToDatabase();

    const query: any = { status: "Published" };
    if (category && category !== "All") {
      query.category = category;
    }

    const posts = await BlogPost.find(query).sort({ publishedAt: -1 });

    return NextResponse.json({ posts, success: true });
  } catch (error) {
    console.error("Fetch blog posts error:", error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}
