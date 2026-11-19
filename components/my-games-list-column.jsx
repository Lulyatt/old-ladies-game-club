import Link from "next/link";

export default function MyGamesListColumn({
  title,
  description,
  games,
  emptyMessage,
  removingSlug,
  onRemove,
}) {
  return (
    <section className="min-w-0">
      <h2 className="text-xl font-bold">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}

      {games.length === 0 ? (
        <div className="card-raised mt-4 p-4">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-4">
          {games.map((game) => (
            <li key={game.slug}>
              <article className="card-raised flex min-w-0 flex-col gap-3 p-3">
                <Link
                  href={`/games/${game.slug}`}
                  className="block overflow-hidden rounded-md border border-border transition-opacity hover:opacity-90"
                >
                  <img
                    src={game.coverImage}
                    alt={`${game.title} cover art`}
                    className="aspect-[460/215] w-full object-cover"
                  />
                </Link>
                <div className="min-w-0">
                  <Link
                    href={`/games/${game.slug}`}
                    className="font-bold underline-offset-4 hover:underline"
                  >
                    {game.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {game.genres.join(" • ")}
                  </p>
                  <p className="mt-1 text-xs">{game.rating}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(game.slug)}
                  disabled={removingSlug === game.slug}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
                >
                  {removingSlug === game.slug ? "Removing…" : "Remove"}
                </button>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
