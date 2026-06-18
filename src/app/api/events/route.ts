import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Event from "@/lib/models/Event";
import Photo from "@/lib/models/Photo";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all events sorted by date
    const events = await Event.find({}).sort({ date: -1, createdAt: -1 }).lean();
    
    // Attach photo counts dynamically to each event
    const eventsWithCounts = await Promise.all(
      events.map(async (event: any) => {
        const photoCount = await Photo.countDocuments({ eventId: event._id });
        return { ...event, photoCount };
      })
    );

    return NextResponse.json({ events: eventsWithCounts });
  } catch (error) {
    console.error("Fetch events error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
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

    // Required fields check
    const { title, eventType, date, venue } = body;
    if (!title || !eventType || !date || !venue) {
      return NextResponse.json({ error: "Missing required core fields" }, { status: 400 });
    }

    // Auto-generate slug if not provided
    if (!body.slug) {
      let slugBase = title.toLowerCase();
      
      const details = body.clientDetails || {};
      if (eventType === "Wedding" && details.brideName && details.groomName) {
        slugBase = `${details.brideName}-weds-${details.groomName}`;
      } else if (eventType === "Pre-Wedding" && details.brideName && details.groomName) {
        slugBase = `${details.brideName}-and-${details.groomName}-prewedding`;
      } else if (eventType === "Mehndi" && details.personName) {
        slugBase = `${details.personName}-mehndi`;
      } else if (eventType === "Portrait" && details.personName) {
        slugBase = `${details.personName}-portraits`;
      } else if (eventType === "Maternity" && details.motherName) {
        slugBase = `${details.motherName}-maternity`;
      } else if (eventType === "Birthday" && details.celebrantName) {
        slugBase = `${details.celebrantName}-birthday`;
      } else if (eventType === "Corporate" && details.companyName) {
        slugBase = `${details.companyName}-showcase`;
      }

      body.slug = `${slugBase}-${Math.floor(Math.random() * 1000)}`;
      // Replace spaces, special chars, ensure standard slug format
      body.slug = body.slug.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    }

    const newEvent = await Event.create(body);
    return NextResponse.json({ event: newEvent, success: true }, { status: 201 });
  } catch (error: any) {
    console.error("Create event error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Event slug already exists, please customize the title or slug" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
