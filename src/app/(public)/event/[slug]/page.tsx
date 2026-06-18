import { redirect } from "next/navigation";

export default async function LegacyEventPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  redirect(`/gallery/${params.slug}`);
}
