import Link from "next/link";

export default function AccountReviewCard({ review }) {
  const { game, reviewText, score } = review;

  return (
    <article className="card-raised flex w-[min(100vw-3rem,34rem)] shrink-0 snap-center flex-col gap-4 p-4 md:h-40 md:w-[34rem] md:flex-row md:items-stretch md:gap-5">
      <Link
        href={`/games/${game.slug}`}
        className="block shrink-0 overflow-hidden rounded-md border border-border transition-opacity hover:opacity-90 md:w-[11.5rem]"
      >
        <img
          src={game.coverImage}
          alt={`${game.title} cover art`}
          className="aspect-[460/215] w-full object-cover"
        />
      </Link>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center">
        <p className="line-clamp-5 text-sm leading-relaxed text-muted-foreground md:line-clamp-4">
          {reviewText}
        </p>
      </div>

      <div className="flex shrink-0 flex-row items-center justify-between gap-2 border-t border-border pt-3 md:flex-col md:justify-center md:border-t-0 md:border-l md:pt-0 md:pl-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground md:text-center">
          Score
        </p>
        <p className="text-base font-bold md:text-lg">{score}</p>
      </div>
    </article>
  );
}
