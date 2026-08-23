import Link from "next/link";

export default function GameCard({ game }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="@container flex min-w-0 w-full flex-col overflow-hidden rounded-lg border border-border bg-[#f5f0e8] shadow-sm transition-shadow hover:shadow-md"
    >
      <img
        src={game.coverImage}
        alt={`${game.title} cover art`}
        className="aspect-[4/3] w-full object-cover"
      />
      <div className="flex flex-1 flex-col p-2 text-left sm:p-3">
        <h3 className="text-[10px] font-bold leading-tight sm:text-sm">{game.title}</h3>
        <p className="mt-0.5 hidden text-[10px] text-muted-foreground min-[421px]:@[9rem]:block sm:text-xs">
          {game.genres.join(" • ")}
        </p>
        <p className="mt-0.5 text-[10px] text-muted-foreground sm:mt-1 sm:text-xs">{game.rating}</p>
      </div>
    </Link>
  );
}
