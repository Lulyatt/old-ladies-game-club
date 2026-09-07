import Link from "next/link";

export default function BlogCard({ post }) {
  return (
    <div className="card-raised flex w-[200px] shrink-0 snap-center flex-col gap-2 p-3 md:w-full md:max-w-none md:p-3">
      <Link
        href={`/blog/${post.slug}`}
        className="block overflow-hidden rounded-lg transition-opacity hover:opacity-90"
      >
        <img
          src={post.coverImage}
          alt={`${post.title} cover art`}
          className="aspect-[4/3] w-full border border-border object-cover"
        />
      </Link>
      <div className="flex flex-col text-left">
        <h3 className="text-lg font-bold leading-tight md:text-sm">{post.title}</h3>
        <p className="mt-1 hidden text-sm text-muted-foreground md:mt-0.5 md:block md:text-xs">
          {post.author}
        </p>
        <p className="mt-1 text-sm text-muted-foreground md:mt-0.5 md:text-xs">
          {post.date}
        </p>
      </div>
    </div>
  );
}
