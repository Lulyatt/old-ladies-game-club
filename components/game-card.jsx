import Link from "next/link";

export default function GameCard({ game }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="card-raised flex w-[200px] shrink-0 snap-center flex-col gap-2 p-3 md:w-full md:max-w-none md:p-3"
    >
      <img
        src={game.coverImage}
        alt={`${game.title} cover art`}
        className="aspect-[4/3] w-full rounded-lg border border-border object-cover"
      />
      <div className="flex flex-col text-left">
        <h3 className="text-lg font-bold leading-tight md:text-sm">{game.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground md:mt-0.5 md:text-[10px]">
          {game.genres.join(" • ")}
        </p>
        <p className="mt-1 text-sm text-muted-foreground md:mt-0.5 md:text-xs">
          {game.rating}
        </p>
      </div>
    </Link>
  );
}
