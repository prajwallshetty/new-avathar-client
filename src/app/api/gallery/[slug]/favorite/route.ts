import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Event from "@/lib/models/Event";
import Favorite from "@/lib/models/Favorite";

// Get all favorited photos for a given session
export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID parameter is required" }, { status: 400 });
    }

    await connectToDatabase();
    const event = await Event.findOne({ slug: params.slug });
    if (!event) return NextResponse.json({ error: "Gallery not found" }, { status: 404 });

    const favorites = await Favorite.find({ eventId: event._id, sessionId }).select("photoId");
    const favoritePhotoIds = favorites.map((fav) => fav.photoId.toString());

    return NextResponse.json({ favoritePhotoIds });
  } catch (error) {
    console.error("Fetch favorites error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Toggle favorite status
export async function POST(
  request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const { photoId, sessionId } = await request.json();

    if (!photoId || !sessionId) {
      return NextResponse.json({ error: "Missing photoId or sessionId parameters" }, { status: 400 });
    }

    await connectToDatabase();
    const event = await Event.findOne({ slug: params.slug });
    if (!event) return NextResponse.json({ error: "Gallery not found" }, { status: 404 });

    const existingFavorite = await Favorite.findOne({
      eventId: event._id,
      photoId,
      sessionId,
    });

    if (existingFavorite) {
      // Unfavorite
      await Favorite.findByIdAndDelete(existingFavorite._id);
      return NextResponse.json({ favorited: false, success: true });
    } else {
      // Favorite
      await Favorite.create({
        eventId: event._id,
        photoId,
        sessionId,
      });
      return NextResponse.json({ favorited: true, success: true });
    }
  } catch (error) {
    console.error("Toggle favorite error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
