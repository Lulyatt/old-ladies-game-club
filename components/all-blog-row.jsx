import Link from "next/link";

export default function AllBlogRow({ post }) {
  return (
    <article className="grid w-full min-w-0 grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,0.6fr)_auto] items-center gap-2 border-b border-border py-3 md:grid-cols-[7rem_minmax(0,2.5fr)_minmax(0,0.8fr)_auto] md:gap-4 md:py-4">
      <Link
        href={`/blog/${post.slug}`}
        className="block shrink-0 overflow-hidden rounded-md border border-border transition-opacity hover:opacity-90"
      >
        <img
          src={post.coverImage}
          alt={`${post.title} cover art`}
          className="aspect-[4/3] w-full object-cover"
        />
      </Link>

      <div className="min-w-0">
        <h2 className="truncate text-sm font-bold md:text-base">{post.title}</h2>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground md:text-sm">
          {post.description}
        </p>
      </div>

      <p className="min-w-0 truncate text-xs text-muted-foreground md:text-sm">
        {post.author}
      </p>

      <p className="shrink-0 text-right text-xs text-muted-foreground md:text-sm">
        {post.date}
      </p>
    </article>
  );
}
