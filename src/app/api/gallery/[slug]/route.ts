import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Event from "@/lib/models/Event";
import Photo from "@/lib/models/Photo";
import Video from "@/lib/models/Video";
import Settings from "@/lib/models/Settings";
import GalleryView from "@/lib/models/GalleryView";

export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    await connectToDatabase();
    const event = await Event.findOne({ slug: params.slug }).lean();

    if (!event) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    // Fetch branding logo/settings
    const branding = await Settings.findOne() || {
      brandName: "New Avathar Photography",
      whatsappNumber: "",
      instagramLink: "",
      facebookLink: "",
      footerText: "© New Avathar Photography. All Rights Reserved.",
    };

    // If password-protected and not authenticated yet, hide private fields
    if (event.isPasswordProtected) {
      return NextResponse.json({
        isLocked: true,
        event: {
          _id: event._id,
          title: event.title,
          eventType: event.eventType,
          date: event.date,
          venue: event.venue,
          coverImage: event.coverImage,
          coverVideo: event.coverVideo,
          slug: event.slug,
          template: event.template,
        },
        branding,
      });
    }

    // Standard public gallery load
    const photos = await Photo.find({ eventId: event._id, isHidden: false }).sort({ order: 1, createdAt: -1 });
    const videos = await Video.find({ eventId: event._id, isHidden: false }).sort({ order: 1, createdAt: -1 });

    // Log the view if sessionId is supplied
    if (sessionId) {
      const alreadyLogged = await GalleryView.findOne({ eventId: event._id, sessionId });
      if (!alreadyLogged) {
        const userAgent = request.headers.get("user-agent") || "";
        await GalleryView.create({
          eventId: event._id,
          sessionId,
          userAgent,
        });
      }
    }

    return NextResponse.json({
      isLocked: false,
      event,
      photos,
      videos,
      branding,
    });
  } catch (error) {
    console.error("Public gallery GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Password verification POST endpoint
export async function POST(
  request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const { password, sessionId } = await request.json();

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    await connectToDatabase();
    const event = await Event.findOne({ slug: params.slug }).lean();

    if (!event) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    if (event.password !== password) {
      return NextResponse.json({ error: "Incorrect gallery password" }, { status: 401 });
    }

    // Password matches! Load all content
    const photos = await Photo.find({ eventId: event._id, isHidden: false }).sort({ order: 1, createdAt: -1 });
    const videos = await Video.find({ eventId: event._id, isHidden: false }).sort({ order: 1, createdAt: -1 });
    const branding = await Settings.findOne() || {};

    // Log the view
    if (sessionId) {
      const alreadyLogged = await GalleryView.findOne({ eventId: event._id, sessionId });
      if (!alreadyLogged) {
        const userAgent = request.headers.get("user-agent") || "";
        await GalleryView.create({
          eventId: event._id,
          sessionId,
          userAgent,
        });
      }
    }

    return NextResponse.json({
      isLocked: false,
      event,
      photos,
      videos,
      branding,
    });
  } catch (error) {
    console.error("Public gallery POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
