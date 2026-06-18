import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Settings from "@/lib/models/Settings";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings on first load
      settings = await Settings.create({
        brandName: "New Avathar Photography",
        whatsappNumber: "+91 99999 99999",
        instagramLink: "https://instagram.com/newavathar",
        facebookLink: "https://facebook.com/newavathar",
        footerText: "© New Avathar Photography. All Rights Reserved.",
      });
    }
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Fetch settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await connectToDatabase();
    const body = await request.json();

    let settings = await Settings.findOne();
    if (settings) {
      settings = await Settings.findByIdAndUpdate(settings._id, body, { new: true });
    } else {
      settings = await Settings.create(body);
    }

    return NextResponse.json({ settings, success: true });
  } catch (error) {
    console.error("Save settings error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
