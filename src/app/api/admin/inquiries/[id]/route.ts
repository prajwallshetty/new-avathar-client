import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Inquiry from "@/lib/models/Inquiry";
import { getSession } from "@/lib/auth";

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "editor")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const params = await props.params;
    await connectToDatabase();
    const body = await request.json();

    const inquiry = await Inquiry.findByIdAndUpdate(params.id, body, { new: true });
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ inquiry, success: true });
  } catch (error) {
    console.error("Update inquiry error:", error);
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

    const inquiry = await Inquiry.findByIdAndDelete(params.id);
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete inquiry error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
