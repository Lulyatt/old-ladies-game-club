import Link from "next/link";
import { formatReviewCount } from "@/lib/reviews";

export default function ReviewedGameRow({ game }) {
  return (
    <Link
      href={`/reviews/${game.slug}`}
      className="grid w-full min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3 border-b border-border py-3 transition-colors hover:bg-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:grid-cols-[5.5rem_minmax(0,1fr)_auto_auto] sm:gap-4 md:py-4"
    >
      <img
        src={game.coverImage}
        alt={`${game.title} cover art`}
        className="aspect-[460/215] w-full rounded-md border border-border object-cover"
      />

      <div className="min-w-0">
        <h2 className="truncate text-sm font-bold md:text-base">{game.title}</h2>
        <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
          {game.slug}
        </p>
      </div>

      <p className="col-span-2 text-sm font-medium sm:col-span-1 sm:text-right">
        {game.rating}
      </p>

      <p className="text-xs text-muted-foreground sm:text-right md:text-sm">
        {formatReviewCount(game.reviewCount)}
      </p>
    </Link>
  );
}
