import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Event from "@/lib/models/Event";
import ClientGalleryView from "./ClientGalleryView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  try {
    await connectToDatabase();
    const event = await Event.findOne({ slug: params.slug });
    if (!event) return { title: "Gallery Not Found - New Avathar" };

    return {
      title: `${event.title} | New Avathar Photography`,
      description: `View the official client gallery for ${event.title}. curated by New Avathar Photography.`,
    };
  } catch (err) {
    return { title: "Gallery - New Avathar Photography" };
  }
}

export default async function GalleryPage(props: PageProps) {
  const params = await props.params;
  return <ClientGalleryView slug={params.slug} />;
}
