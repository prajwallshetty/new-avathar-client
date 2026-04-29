import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Event from "@/lib/models/Event";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    await connectToDatabase();
    
    // Check if ID is a valid ObjectId, otherwise it might be a slug lookup
    let query: any = {};
    if (params.id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: params.id };
    } else {
      query = { slug: params.id };
    }

    const event = await Event.findOne(query);
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    
    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    await connectToDatabase();
    const body = await request.json();

    const event = await Event.findByIdAndUpdate(params.id, body, { new: true });
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    await connectToDatabase();
    
    const event = await Event.findByIdAndDelete(params.id);
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
