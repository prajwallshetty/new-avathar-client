import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Event from "@/lib/models/Event";
import Download from "@/lib/models/Download";

export async function POST(
  request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const { photoId, sessionId, category } = await request.json();

    if (!sessionId || !category) {
      return NextResponse.json({ error: "Missing sessionId or category" }, { status: 400 });
    }

    await connectToDatabase();
    const event = await Event.findOne({ slug: params.slug });
    if (!event) return NextResponse.json({ error: "Gallery not found" }, { status: 404 });

    await Download.create({
      eventId: event._id,
      photoId: photoId || null,
      category,
      sessionId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Log download error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
