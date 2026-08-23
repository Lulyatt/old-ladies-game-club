import Link from "next/link";

export default function GameCard({ game }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="flex w-full max-w-[200px] min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-[#f5f0e8] shadow-sm transition-shadow hover:shadow-md md:max-w-none"
    >
      <img
        src={game.coverImage}
        alt={`${game.title} cover art`}
        className="aspect-[4/3] w-full object-cover"
      />
      <div className="flex flex-col p-2 text-left md:p-3">
        <h3 className="text-sm font-bold leading-tight md:text-sm">{game.title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground md:text-[10px] md:leading-normal">
          {game.genres.join(" • ")}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground md:mt-0.5 md:text-xs">
          {game.rating}
        </p>
      </div>
    </Link>
  );
}
