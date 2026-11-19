import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import GameUserListButton from "@/components/game-user-list-button";
import GameReviews from "@/components/game-reviews";
import GameScreenshotsCarousel from "@/components/game-screenshots-carousel";
import GameSteamDetails from "@/components/game-steam-details";
import GameTrailersCarousel from "@/components/game-trailers-carousel";
import { getGameBySlug } from "@/lib/get-game";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    return { title: "Game not found" };
  }

  return {
    title: `${game.title} | The Old Ladies Game Club`,
    description: game.description,
  };
}

export default async function GamePage({ params }) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-5xl flex-1 px-4 py-16 md:px-6">
      <Link
        href="/all-games"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All Games
      </Link>

      <img
        src={game.coverImage}
        alt={`${game.title} cover art`}
        className="mx-auto aspect-[460/215] w-full max-w-[460px] rounded-lg border border-border object-cover"
      />

      {game.screenshots.length || game.movies.length ? (
        <div className="mt-6 min-w-0 max-w-full space-y-6">
          {game.screenshots.length ? (
            <GameScreenshotsCarousel
              screenshots={game.screenshots}
              gameTitle={game.title}
            />
          ) : null}
          {game.movies.length ? (
            <GameTrailersCarousel
              movies={game.movies}
              gameTitle={game.title}
              steamStoreUrl={game.steamStoreUrl}
            />
          ) : null}
        </div>
      ) : null}

      <h1 className="mt-6 text-3xl font-bold">{game.title}</h1>

      <p className="mt-2 text-muted-foreground">
        {game.genres.join(" • ")}
      </p>

      <p className="mt-2">{game.rating}</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <GameUserListButton
          listKey="favourites"
          gameSlug={game.slug}
          gameTitle={game.title}
        />
        <GameUserListButton
          listKey="playQueue"
          gameSlug={game.slug}
          gameTitle={game.title}
        />
      </div>

      <p className="mt-6 text-muted-foreground">{game.description}</p>

      <GameSteamDetails game={game} />

      <GameReviews
        game={{
          slug: game.slug,
          title: game.title,
          coverImage: game.coverImage,
        }}
      />
    </main>
  );
}
