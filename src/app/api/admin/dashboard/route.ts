import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Event from "@/lib/models/Event";
import Photo from "@/lib/models/Photo";
import Download from "@/lib/models/Download";
import Favorite from "@/lib/models/Favorite";
import GalleryView from "@/lib/models/GalleryView";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "editor")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await connectToDatabase();

    // 1. Gather status metrics
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ status: { $in: ["Editing", "Delivered"] } });
    const draftEvents = await Event.countDocuments({ status: "Draft" });
    const deliveredEvents = await Event.countDocuments({ status: "Delivered" });
    const archivedEvents = await Event.countDocuments({ status: "Archived" });

    // 2. Count Photos & Videos
    const totalPhotos = await Photo.countDocuments();

    // 3. Count unique clients based on unique titles/slugs
    const totalClients = await Event.distinct("title").then((res) => res.length);

    // 4. Download and view counts
    const totalDownloads = await Download.countDocuments();
    const totalViews = await GalleryView.countDocuments();

    // 5. Compile recent activity feed
    const recentEvents = await Event.find().sort({ createdAt: -1 }).limit(5).lean();
    const recentFavorites = await Favorite.find()
      .populate("eventId", "title")
      .populate("photoId", "url")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    const recentDownloads = await Download.find()
      .populate("eventId", "title")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const activityList: any[] = [];

    recentEvents.forEach((ev: any) => {
      activityList.push({
        type: "event_created",
        description: `New gallery "${ev.title}" created.`,
        time: ev.createdAt,
        metadata: { slug: ev.slug },
      });
    });

    recentFavorites.forEach((fav: any) => {
      activityList.push({
        type: "favorite_added",
        description: `Someone favorited a photo in "${fav.eventId?.title || 'Unknown Event'}".`,
        time: fav.createdAt,
        metadata: { photoUrl: fav.photoId?.url },
      });
    });

    recentDownloads.forEach((dl: any) => {
      activityList.push({
        type: "download_logged",
        description: `Media download logged for "${dl.eventId?.title || 'Unknown Event'}" (${dl.category}).`,
        time: dl.createdAt,
        metadata: { category: dl.category },
      });
    });

    // Sort combined activities by date descending
    const sortedActivities = activityList
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 8);

    return NextResponse.json({
      metrics: {
        totalEvents,
        activeEvents,
        draftEvents,
        deliveredEvents,
        archivedEvents,
        totalPhotos,
        totalClients,
        totalDownloads,
        totalViews,
      },
      recentActivity: sortedActivities,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
