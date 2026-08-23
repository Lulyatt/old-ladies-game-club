import Link from "next/link";

export default function GameOfTheMonth({ game }) {
  return (
    <section className="w-full text-center">
      <Link
        href={`/games/${game.slug}`}
        className="mx-auto flex w-full max-w-xs flex-col items-center gap-3 rounded-xl border border-border bg-[#f5f0e8] p-4 shadow-md transition-shadow hover:shadow-lg sm:max-w-sm md:max-w-[260px] md:gap-4 md:rounded-lg md:p-4"
      >
        <img
          src={game.coverImage}
          alt={`${game.title} cover art`}
          className="aspect-[4/3] w-full rounded-lg border border-border object-cover md:max-w-[160px]"
        />

        <div className="w-full min-w-0 md:max-w-xs md:text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground md:text-xs">
            Game of the Month
          </p>
          <p className="text-sm font-semibold md:text-base">{game.month}</p>

          <h2 className="mt-1 text-lg font-bold leading-tight md:text-xl">
            {game.title}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground md:text-xs">
            {game.genres.join(" • ")}
          </p>

          <p className="mt-1 text-sm text-muted-foreground md:text-xs">
            {game.rating}
          </p>

          <p className="mt-2 hidden text-sm text-muted-foreground md:block">
            {game.description}
          </p>
        </div>
      </Link>
    </section>
  );
}
