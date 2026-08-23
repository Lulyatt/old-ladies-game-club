import GameCard from "@/components/game-card";

export default function BrowseGames({ games }) {
  return (
    <section className="py-1 sm:py-6">
      <h2 className="section-label text-lg font-bold sm:text-2xl">
        Browse Games
      </h2>
      <p className="section-subtitle max-w-md text-xs sm:text-sm">
        Explore games the club has played and reviewed.
      </p>

      <div className="mt-3 grid w-full min-w-0 grid-cols-3 gap-1 sm:mt-5 sm:gap-3 md:gap-4">
        {games.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>
    </section>
  );
}
