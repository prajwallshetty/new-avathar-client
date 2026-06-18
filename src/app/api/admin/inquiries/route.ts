import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Inquiry from "@/lib/models/Inquiry";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "editor")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await connectToDatabase();

    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("Fetch inquiries error:", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}
