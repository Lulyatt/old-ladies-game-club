import ReviewedGameRow from "@/components/reviewed-game-row";
import ReviewsGotmFeature from "@/components/reviews-gotm-feature";
import { fetchGameOfTheMonth } from "@/lib/game-of-the-month";
import {
  fetchAverageRatingForGame,
  fetchReviewedGamesSummary,
  formatReviewCount,
} from "@/lib/reviews";

export const metadata = {
  title: "Reviews | The Old Ladies Game Club",
  description: "Club reviews and game of the month.",
};

export const revalidate = 60;

export default async function ReviewsPage() {
  const [gameOfTheMonth, reviewedGames] = await Promise.all([
    fetchGameOfTheMonth(),
    fetchReviewedGamesSummary(),
  ]);

  let featuredGame = null;

  if (gameOfTheMonth) {
    let reviewCount = 0;

    try {
      const stats = await fetchAverageRatingForGame(gameOfTheMonth.slug);
      reviewCount = stats?.count ?? 0;
    } catch {
      reviewCount = 0;
    }

    featuredGame = {
      slug: gameOfTheMonth.slug,
      title: gameOfTheMonth.title,
      coverImage: gameOfTheMonth.coverImage,
      rating: gameOfTheMonth.rating,
      month: gameOfTheMonth.month,
      reviewCount,
    };
  }

  const otherReviewedGames = featuredGame
    ? reviewedGames.filter((game) => game.slug !== featuredGame.slug)
    : reviewedGames;

  return (
    <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 snap-none px-4 py-16 md:px-6">
      <h1 className="text-3xl font-bold">Reviews</h1>
      <p className="mt-2 text-muted-foreground">
        Club ratings and member write-ups for games we have played together.
      </p>

      {featuredGame ? (
        <div className="mt-10">
          <ReviewsGotmFeature game={featuredGame} />
        </div>
      ) : null}

      <section className="mt-10 min-w-0 md:mt-12">
        <h2 className="text-xl font-bold md:text-2xl">
          {featuredGame ? "Other reviewed games" : "Reviewed games"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a game to read top and recent member reviews.
        </p>

        {otherReviewedGames.length === 0 ? (
          <div className="card-raised mt-6 p-4">
            <p className="text-sm text-muted-foreground">
              {featuredGame
                ? "No other games have club reviews yet."
                : "No club reviews yet. Visit a game page to share your thoughts after playing."}
            </p>
          </div>
        ) : (
          <div className="mt-6 w-full min-w-0 overflow-hidden">
            <div
              className="mb-2 hidden min-w-0 grid-cols-[5.5rem_minmax(0,1fr)_auto_auto] gap-4 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:grid"
              aria-hidden
            >
              <span>Cover</span>
              <span>Game</span>
              <span className="text-right">Rating</span>
              <span className="text-right">Reviews</span>
            </div>
            <div>
              {otherReviewedGames.map((game) => (
                <ReviewedGameRow key={game.slug} game={game} />
              ))}
            </div>
          </div>
        )}
      </section>

      {featuredGame ? (
        <p className="sr-only">
          Featured game {featuredGame.title} has{" "}
          {formatReviewCount(featuredGame.reviewCount)}.
        </p>
      ) : null}
    </main>
  );
}
