import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Event from "@/lib/models/Event";

export async function GET() {
  try {
    await connectToDatabase();
    const events = await Event.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    // Auto-generate slug if not provided
    if (!body.slug) {
      body.slug = `${body.brideName.toLowerCase()}-weds-${body.groomName.toLowerCase()}-${Math.floor(Math.random() * 1000)}`;
      // Replace spaces and special chars
      body.slug = body.slug.replace(/[^a-z0-9-]/g, '-');
    }

    const newEvent = await Event.create(body);
    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "Slug already exists, please try another name combination" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
