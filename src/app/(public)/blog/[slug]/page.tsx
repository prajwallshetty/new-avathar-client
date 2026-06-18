import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PageTransition from "@/components/layout/PageTransition";
import connectToDatabase from "@/lib/db";
import BlogPost from "@/lib/models/BlogPost";
import { IBlogPost } from "@/lib/types";
import { Metadata } from "next";
import { FaArrowLeft } from "react-icons/fa";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectToDatabase();
  const post = await BlogPost.findOne({ slug: params.slug, status: "Published" }).lean() as unknown as IBlogPost;

  if (!post) {
    return {
      title: "Not Found | New Avatar Photography",
    };
  }

  return {
    title: post.seoTitle || `${post.title} | New Avatar Photography`,
    description: post.seoDescription || post.excerpt,
    keywords: post.seoKeywords && post.seoKeywords.length > 0 ? post.seoKeywords.join(", ") : undefined,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  await connectToDatabase();
  const post = await BlogPost.findOne({ slug: params.slug, status: "Published" }).lean() as unknown as IBlogPost;

  if (!post) {
    notFound();
  }

  const publishDate = new Date(post.publishedAt || post.createdAt!).toISOString();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: publishDate,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "New Avatar Photography",
      logo: {
        "@type": "ImageObject",
        url: "https://www.newavatar.com/logo.png",
      },
    },
  };

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="pt-32 pb-32 bg-brand-bg min-h-screen">
        <article className="container mx-auto px-6 md:px-12 max-w-4xl">
          <Link href="/blog" className="inline-flex items-center gap-3 text-brand-mutedLight hover:text-brand-gold transition-colors font-inter text-xs tracking-widest uppercase mb-12">
            <FaArrowLeft /> Back to Journal
          </Link>

          <header className="mb-12 text-center">
            {post.category && (
              <div className="mb-6">
                <span className="text-brand-gold font-inter text-xs tracking-[0.2em] uppercase border border-brand-gold/30 px-4 py-1.5 rounded-full">
                  {post.category}
                </span>
              </div>
            )}
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-brand-text mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-brand-mutedLight font-inter text-sm tracking-wide">
              <span>By {post.author}</span>
              <span className="w-1 h-1 rounded-full bg-brand-gold/50" />
              <time dateTime={publishDate}>
                {new Date(publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </time>
            </div>
          </header>

          {post.coverImage && (
            <div className="relative w-full aspect-[21/9] md:aspect-[21/9] mb-16 rounded-xl overflow-hidden border border-brand-border">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div 
            className="prose prose-invert prose-lg max-w-none prose-headings:font-playfair prose-a:text-brand-gold hover:prose-a:text-brand-gold/80 prose-img:rounded-xl prose-hr:border-brand-border"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-brand-border flex flex-wrap items-center gap-3">
              <span className="font-inter text-xs text-brand-mutedLight tracking-widest uppercase mr-2">Tags:</span>
              {post.tags.map(tag => (
                <span key={tag} className="text-brand-text font-inter text-xs tracking-wider bg-brand-surface px-3 py-1 rounded-sm border border-brand-border">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </div>
    </PageTransition>
  );
}
