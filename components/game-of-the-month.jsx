import Link from "next/link";

export default function GameOfTheMonth({ game }) {
  return (
    <section className="w-full text-center">
      <Link
        href={`/games/${game.slug}`}
        className="mx-auto flex w-fit max-w-full flex-col items-center gap-2 rounded-lg border border-border bg-[#f5f0e8] p-2 shadow-md transition-shadow hover:shadow-lg sm:max-w-[260px] sm:gap-4 sm:p-4"
      >
        <img
          src={game.coverImage}
          alt={`${game.title} cover art`}
          className="aspect-[4/3] w-full max-w-[120px] rounded border border-border object-cover sm:max-w-[160px]"
        />

        <div className="min-w-0 text-left sm:max-w-xs sm:text-center">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
            Game of the Month
          </p>
          <p className="text-[10px] font-semibold sm:mt-1 sm:text-base">
            {game.month}
          </p>

          <h2 className="mt-0.5 text-sm font-bold leading-tight sm:mt-0 sm:text-xl">
            {game.title}
          </h2>

          <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground max-[420px]:hidden sm:mt-1.5 sm:text-xs">
            {game.genres.join(" • ")}
          </p>

          <p className="text-[10px] text-muted-foreground sm:mt-1 sm:text-xs">
            {game.rating}
          </p>

          <p className="mt-2 hidden text-xs text-muted-foreground sm:block sm:text-sm">
            {game.description}
          </p>

          <span className="mt-2 hidden text-xs font-medium text-primary sm:inline-block sm:mt-4">
            View game →
          </span>
        </div>
      </Link>
    </section>
  );
}
