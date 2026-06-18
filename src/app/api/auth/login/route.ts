import { NextResponse } from "next/server";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await request.json();

    const userCount = await User.countDocuments();

    // Seeding dynamic admin on first login if database has no users
    if (userCount === 0) {
      const defaultEmail = process.env.ADMIN_EMAIL || "admin@newavathar.com";
      const defaultPassword = process.env.ADMIN_PASSWORD || "admin123";

      if (email === defaultEmail && password === defaultPassword) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
          name: "Main Administrator",
          email: defaultEmail,
          passwordHash: hashedPassword,
          role: "admin",
        });
        
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        const session = await encrypt({ role: "admin", email, expires, name: "Main Administrator" });

        (await cookies()).set("admin_session", session, {
          expires,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        return NextResponse.json({ success: true });
      }
    }

    // Standard database lookup for user
    const dbUser = await User.findOne({ email });
    if (!dbUser) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, dbUser.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await encrypt({
      role: dbUser.role,
      email: dbUser.email,
      name: dbUser.name,
      expires,
    });

    (await cookies()).set("admin_session", session, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  (await cookies()).set("admin_session", "", {
    expires: new Date(0),
    httpOnly: true,
  });
  return NextResponse.json({ success: true });
}
