import Link from "next/link";

function TagList({ items }) {
  if (!items?.length) return null;

  return (
    <div className="flex max-h-16 flex-wrap gap-1 overflow-hidden">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] leading-tight md:text-xs"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function AllGamesRow({ game }) {
  const steamMeta = [game.developers.join(", "), game.releaseDate]
    .filter(Boolean)
    .join(" • ");

  return (
    <article className="grid w-full min-w-0 grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)_4.5rem_minmax(0,0.65fr)_minmax(0,0.65fr)_auto] items-center gap-2 border-b border-border py-3 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)_minmax(5.5rem,7rem)_minmax(0,1fr)_minmax(0,1fr)_minmax(3.5rem,auto)] md:gap-4 md:py-4">
      
      <Link
        href={`/games/${game.slug}`}
        className="block shrink-0 overflow-hidden rounded-md border border-border transition-opacity hover:opacity-90"
      >
        <img
          src={game.coverImage}
          alt={`${game.title} cover art`}
          className="aspect-[460/215] w-full object-cover"
        />
      </Link>
      
      
      <div className="min-w-0">
        <p className="line-clamp-2 text-xs text-muted-foreground md:text-sm">
          {game.description}
        </p>
        {steamMeta ? (
          <p className="mt-1 truncate text-[10px] text-muted-foreground md:text-xs">
            {steamMeta}
          </p>
        ) : null}
      </div>


      <TagList items={game.genres} />

      <TagList items={game.categories} />

      <p className="shrink-0 text-right text-xs md:text-sm">{game.rating}</p>
    </article>
  );
}
