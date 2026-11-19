import Link from "next/link";
import { formatReviewCount } from "@/lib/reviews";

export default function ReviewsGotmFeature({ game }) {
  return (
    <Link
      href={`/reviews/${game.slug}`}
      className="card-raised mx-auto block w-full max-w-xl border-2 border-border p-4 transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:p-6"
    >
      <p className="text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Game of the Month
      </p>
      {game.month ? (
        <p className="mt-1 text-center text-sm font-semibold">{game.month}</p>
      ) : null}

      <img
        src={game.coverImage}
        alt={`${game.title} cover art`}
        className="mx-auto mt-4 aspect-[460/215] w-full max-w-md rounded-lg border border-border object-cover"
      />

      <div className="mt-4 text-center">
        <h2 className="text-2xl font-bold md:text-3xl">{game.title}</h2>
        <p className="mt-1 font-mono text-xs text-muted-foreground md:text-sm">
          {game.slug}
        </p>
        <p className="mt-3 text-base font-medium">{game.rating}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatReviewCount(game.reviewCount)}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          View club reviews for this month&apos;s pick
        </p>
      </div>
    </Link>
  );
}
