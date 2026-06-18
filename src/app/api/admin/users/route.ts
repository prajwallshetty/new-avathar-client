import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "editor")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await connectToDatabase();
    const users = await User.find({}, { passwordHash: 0 }).sort({ name: 1 });
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await connectToDatabase();
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      passwordHash,
      role,
    });

    const userObj = newUser.toObject();
    delete (userObj as any).passwordHash;

    return NextResponse.json({ user: userObj, success: true }, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing user ID parameter" }, { status: 400 });
    }

    // Prevent admin from deleting their own account
    const dbUser = await User.findById(id);
    if (dbUser && dbUser.email === session.email) {
      return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
    }

    await connectToDatabase();
    await User.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
