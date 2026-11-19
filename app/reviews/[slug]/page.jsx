import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import GameReviewsHubBody from "@/components/game-reviews-hub-body";
import { getGameBySlug } from "@/lib/get-game";
import {
  fetchAverageRatingForGame,
  fetchReviewsByGameSlug,
  formatClubGameRating,
  formatReviewCount,
} from "@/lib/reviews";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    return { title: "Reviews not found" };
  }

  return {
    title: `${game.title} Reviews | The Old Ladies Game Club`,
    description: `Member reviews for ${game.title}.`,
  };
}

export default async function GameReviewsHubPage({ params }) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  let stats = null;

  try {
    stats = await fetchAverageRatingForGame(slug);
  } catch {
    stats = null;
  }

  let reviews = [];

  try {
    reviews = await fetchReviewsByGameSlug(slug);
  } catch {
    reviews = [];
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 snap-none px-4 py-16 md:px-6">
      <Link
        href="/reviews"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All Reviews
      </Link>

      <img
        src={game.coverImage}
        alt={`${game.title} cover art`}
        className="mx-auto aspect-[460/215] w-full max-w-[460px] rounded-lg border border-border object-cover"
      />

      <header className="card-raised mt-6 p-4 md:p-6">
        <h1 className="text-3xl font-bold">{game.title}</h1>
        <p className="mt-2 font-mono text-sm text-muted-foreground">{slug}</p>
        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Club rating
            </dt>
            <dd className="mt-0.5 font-medium">
              {formatClubGameRating(stats)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Reviews
            </dt>
            <dd className="mt-0.5 font-medium">
              {formatReviewCount(stats?.count ?? 0)}
            </dd>
          </div>
        </dl>
        <Link
          href={`/games/${slug}`}
          className="mt-6 inline-block rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Go to Game Info
        </Link>
      </header>

      <GameReviewsHubBody
        game={{
          slug: game.slug,
          title: game.title,
          coverImage: game.coverImage,
        }}
        initialReviews={reviews}
      />
    </main>
  );
}
