import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Event from "@/lib/models/Event";
import Photo from "@/lib/models/Photo";
import Video from "@/lib/models/Video";
import Favorite from "@/lib/models/Favorite";
import Download from "@/lib/models/Download";
import GalleryView from "@/lib/models/GalleryView";
import { getSession } from "@/lib/auth";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    await connectToDatabase();
    
    let query: any = {};
    if (params.id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: params.id };
    } else {
      query = { slug: params.id };
    }

    const event = await Event.findOne(query).lean();
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    // Fetch analytics details dynamically
    const photoCount = await Photo.countDocuments({ eventId: event._id });
    const videoCount = await Video.countDocuments({ eventId: event._id });
    const viewCount = await GalleryView.countDocuments({ eventId: event._id });
    
    // Unique guest calculations (based on unique sessionId)
    const uniqueGuests = await GalleryView.distinct("sessionId", { eventId: event._id });
    const uniqueGuestCount = uniqueGuests.length;

    const downloadCount = await Download.countDocuments({ eventId: event._id });
    const favoriteCount = await Favorite.countDocuments({ eventId: event._id });

    // Fetch detailed analytics lists
    const favoritesList = await Favorite.find({ eventId: event._id })
      .populate("photoId")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    
    const downloadsList = await Download.find({ eventId: event._id })
      .populate("photoId")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const viewsList = await GalleryView.find({ eventId: event._id })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      event,
      stats: {
        photoCount,
        videoCount,
        viewCount,
        uniqueGuestCount,
        downloadCount,
        favoriteCount,
      },
      favorites: favoritesList,
      downloads: downloadsList,
      views: viewsList,
    });
  } catch (error) {
    console.error("Fetch event details error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "editor")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const params = await props.params;
    await connectToDatabase();
    const body = await request.json();

    const event = await Event.findByIdAndUpdate(params.id, body, { new: true });
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    return NextResponse.json({ event, success: true });
  } catch (error) {
    console.error("Update event error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "editor")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const params = await props.params;
    await connectToDatabase();

    const event = await Event.findById(params.id);
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    // Clean up all related assets in the database recursively
    await Event.findByIdAndDelete(params.id);
    await Photo.deleteMany({ eventId: params.id });
    await Video.deleteMany({ eventId: params.id });
    await Favorite.deleteMany({ eventId: params.id });
    await Download.deleteMany({ eventId: params.id });
    await GalleryView.deleteMany({ eventId: params.id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
