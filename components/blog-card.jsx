import Link from "next/link";

export default function BlogCard({ post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="@container flex min-w-0 w-full flex-col overflow-hidden rounded-lg border border-border bg-[#f5f0e8] shadow-sm transition-shadow hover:shadow-md"
    >
      <img
        src={post.coverImage}
        alt={`${post.title} cover art`}
        className="aspect-[4/3] w-full object-cover"
      />
      <div className="flex flex-1 flex-col p-2 text-left sm:p-3">
        <h3 className="text-[10px] font-bold leading-tight sm:text-sm">{post.title}</h3>
        <p className="mt-0.5 hidden text-[10px] text-muted-foreground min-[421px]:@[9rem]:block sm:text-xs">
          {post.author}
        </p>
        <p className="mt-0.5 text-[10px] text-muted-foreground sm:mt-1 sm:text-xs">
          {post.date}
        </p>
      </div>
    </Link>
  );
}
