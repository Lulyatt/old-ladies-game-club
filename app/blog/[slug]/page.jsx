import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/get-blog-post";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: `${post.title} | The Old Ladies Game Club`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl flex-1 px-6 py-16">
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Blog
      </Link>

      <img
        src={post.coverImage}
        alt={`${post.title} cover art`}
        className="aspect-[4/3] w-full max-w-md rounded-lg border border-border object-cover"
      />

      <h1 className="mt-6 text-3xl font-bold">{post.title}</h1>

      <p className="mt-2 text-sm text-muted-foreground">
        {post.author} • {post.date}
      </p>

      <p className="mt-4 text-muted-foreground">{post.description}</p>

      <div className="mt-8 space-y-4 text-muted-foreground">
        {post.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </main>
  );
}
