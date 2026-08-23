import GameCard from "@/components/game-card";

export default function BrowseGames({ games }) {
  return (
    <section className="md:py-6">
      <h2 className="section-label text-base font-bold md:text-2xl">Browse Games</h2>
      <p className="section-subtitle hidden text-xs md:block md:text-sm">
        Explore games the club has played and reviewed.
      </p>

      <div className="mt-4 flex flex-col items-center gap-8 px-8 md:mt-5 md:grid md:w-full md:grid-cols-3 md:gap-4 md:px-0">
        {games.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>
    </section>
  );
}
