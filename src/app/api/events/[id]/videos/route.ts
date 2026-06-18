import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Video from "@/lib/models/Video";
import { getSession } from "@/lib/auth";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    await connectToDatabase();
    const videos = await Video.find({ eventId: params.id }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Fetch videos error:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}

export async function POST(
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
    const { url, publicId, category } = await request.json();

    if (!url || !publicId) {
      return NextResponse.json({ error: "Missing url or publicId" }, { status: 400 });
    }

    const lastVideo = await Video.findOne({ eventId: params.id }).sort({ order: -1 });
    const order = lastVideo ? lastVideo.order + 1 : 0;

    const newVideo = await Video.create({
      eventId: params.id,
      url,
      publicId,
      category: category || "General",
      order,
    });

    return NextResponse.json({ video: newVideo, success: true }, { status: 201 });
  } catch (error) {
    console.error("Upload video error:", error);
    return NextResponse.json({ error: "Failed to upload video" }, { status: 500 });
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

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json({ error: "Missing videoId parameter" }, { status: 400 });
    }

    const params = await props.params;
    await connectToDatabase();
    const deletedVideo = await Video.findOneAndDelete({ _id: videoId, eventId: params.id });

    if (!deletedVideo) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete video error:", error);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
