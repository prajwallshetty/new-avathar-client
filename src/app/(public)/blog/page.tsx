import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import PageTransition from "@/components/layout/PageTransition";
import SectionHeading from "@/components/ui/SectionHeading";
import connectToDatabase from "@/lib/db";
import BlogPost from "@/lib/models/BlogPost";
import { IBlogPost } from "@/lib/types";

export const metadata = {
  title: "Blog | New Avatar Photography",
  description: "Read our latest stories, photography tips, and wedding guides from New Avatar Photography.",
};

async function getBlogPosts(): Promise<IBlogPost[]> {
  await connectToDatabase();
  const posts = await BlogPost.find({ status: "Published" }).sort({ publishedAt: -1 }).lean();
  
  // Convert _id to string so it can be passed to client components if needed, or safely rendered
  return posts.map(post => ({
    ...post,
    _id: post._id.toString(),
  })) as unknown as IBlogPost[];
}

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <PageTransition>
      <div className="pt-32 pb-32 bg-brand-bg min-h-screen">
        <div className="container mx-auto px-6 md:px-12">
          <SectionHeading
            title="Our Journal"
            subtitle="Stories & Inspiration"
            className="mb-16"
          />

          {posts.length === 0 ? (
            <div className="flex justify-center py-24 text-brand-mutedLight text-sm tracking-widest uppercase">
              No stories published yet. Check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col bg-brand-surface border border-brand-border/50 rounded-lg overflow-hidden hover:border-brand-gold/50 transition-all duration-500"
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center">
                        <span className="text-brand-mutedLight font-inter text-xs tracking-widest uppercase">
                          No Image
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {post.category && (
                      <div className="absolute top-4 left-4 bg-brand-bg/80 backdrop-blur-md border border-brand-border px-3 py-1 rounded-full">
                        <span className="text-brand-gold font-inter text-[10px] tracking-widest uppercase">
                          {post.category}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-brand-mutedLight font-inter text-[10px] tracking-widest uppercase mb-4">
                        <span>{new Date(post.publishedAt || post.createdAt!).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <h3 className="font-playfair text-2xl text-brand-text mb-4 group-hover:text-brand-gold transition-colors duration-300">
                        {post.title}
                      </h3>
                      <p className="font-inter text-sm text-brand-mutedLight line-clamp-3 leading-relaxed mb-6">
                        {post.excerpt}
                      </p>
                    </div>
                    
                    <div className="mt-auto">
                      <span className="font-inter text-xs text-brand-gold tracking-[0.2em] uppercase flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                        Read Story <span className="text-lg">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
