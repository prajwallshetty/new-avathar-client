import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Inquiry from "@/lib/models/Inquiry";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const { name, phone, email, date, type, message } = body;

    // Required fields check
    if (!name || !phone || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, phone, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate type enum
    const validTypes = ["wedding", "pre-wedding", "portrait", "event", "other"];
    const inquiryType = validTypes.includes(type) ? type : "other";

    const newInquiry = await Inquiry.create({
      name,
      phone,
      email,
      date: date || "",
      type: inquiryType,
      message,
      status: "New",
      notes: ""
    });

    return NextResponse.json({ inquiry: newInquiry, success: true }, { status: 201 });
  } catch (error) {
    console.error("Create inquiry error:", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
