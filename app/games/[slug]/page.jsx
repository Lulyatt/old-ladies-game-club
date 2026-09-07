import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import GameSteamDetails from "@/components/game-steam-details";
import { getGameBySlug } from "@/lib/get-game";

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
    <main className="mx-auto max-w-3xl flex-1 px-6 py-16">
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

      <h1 className="mt-6 text-3xl font-bold">{game.title}</h1>

      <p className="mt-2 text-muted-foreground">
        {game.genres.join(" • ")}
      </p>

      <p className="mt-2">{game.rating}</p>

      <p className="mt-6 text-muted-foreground">{game.description}</p>

      <GameSteamDetails game={game} />
    </main>
  );
}
