import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Photo from "@/lib/models/Photo";
import { getSession } from "@/lib/auth";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    await connectToDatabase();
    const photos = await Photo.find({ eventId: params.id }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Fetch photos error:", error);
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "editor")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const params = await props.params;
    await connectToDatabase();
    const body = await request.json(); // Single photo or array of photos

    if (Array.isArray(body)) {
      // Find highest order to increment
      const lastPhoto = await Photo.findOne({ eventId: params.id }).sort({ order: -1 });
      let baseOrder = lastPhoto ? lastPhoto.order + 1 : 0;

      const photoDocs = body.map((photo: any, index: number) => ({
        eventId: params.id,
        url: photo.url,
        publicId: photo.publicId,
        category: photo.category || "General",
        order: baseOrder + index,
        isFeatured: photo.isFeatured || false,
        isHidden: photo.isHidden || false,
      }));

      const newPhotos = await Photo.insertMany(photoDocs);
      return NextResponse.json({ photos: newPhotos, success: true }, { status: 201 });
    } else {
      const { url, publicId, category, isFeatured, isHidden } = body;
      if (!url || !publicId) {
        return NextResponse.json({ error: "Missing url or publicId" }, { status: 400 });
      }

      const lastPhoto = await Photo.findOne({ eventId: params.id }).sort({ order: -1 });
      const order = lastPhoto ? lastPhoto.order + 1 : 0;

      const newPhoto = await Photo.create({
        eventId: params.id,
        url,
        publicId,
        category: category || "General",
        order,
        isFeatured: isFeatured || false,
        isHidden: isHidden || false,
      });

      return NextResponse.json({ photo: newPhoto, success: true }, { status: 201 });
    }
  } catch (error) {
    console.error("Upload photos error:", error);
    return NextResponse.json({ error: "Failed to upload photos" }, { status: 500 });
  }
}

// Bulk update photos (reordering, categories, hides, featured)
export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "editor")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const params = await props.params;
    await connectToDatabase();
    const { updates } = await request.json(); // Array of { _id, order, category, isFeatured, isHidden }

    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: "Invalid updates format. Expected array." }, { status: 400 });
    }

    const bulkOps = updates.map((update: any) => ({
      updateOne: {
        filter: { _id: update._id, eventId: params.id },
        update: {
          $set: {
            ...(update.order !== undefined && { order: update.order }),
            ...(update.category !== undefined && { category: update.category }),
            ...(update.isFeatured !== undefined && { isFeatured: update.isFeatured }),
            ...(update.isHidden !== undefined && { isHidden: update.isHidden }),
          },
        },
      },
    }));

    await Photo.bulkWrite(bulkOps);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bulk photos update error:", error);
    return NextResponse.json({ error: "Failed to update photos" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "editor")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const photoId = searchParams.get("photoId");

    if (!photoId) {
      return NextResponse.json({ error: "Missing photoId parameter" }, { status: 400 });
    }

    const params = await props.params;
    await connectToDatabase();
    const deletedPhoto = await Photo.findOneAndDelete({ _id: photoId, eventId: params.id });

    if (!deletedPhoto) {
      return NextResponse.json({ error: "Photo not found or unauthorized deletion" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete photo error:", error);
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
  }
}
