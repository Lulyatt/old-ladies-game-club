import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-6 py-16 text-center">
      <h1 className="text-3xl font-bold">Post not found</h1>
      <p className="mt-4 text-muted-foreground">
        That blog post doesn&apos;t exist yet.
      </p>
      <Link
        href="/blog"
        className="mt-6 inline-block text-primary underline-offset-4 hover:underline"
      >
        Back to blog
      </Link>
    </main>
  );
}
