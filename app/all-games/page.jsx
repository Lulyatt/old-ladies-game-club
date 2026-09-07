import AllGamesRow from "@/components/all-games-row";
import { getAllGames } from "@/lib/get-game";

export const metadata = {
  title: "All Games | The Old Ladies Game Club",
  description: "Browse every game in the club.",
};

export default async function AllGamesPage() {
  const allGames = await getAllGames();

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 snap-none px-4 py-16 md:px-6">
      <h1 className="text-3xl font-bold">All Games</h1>
      <p className="mt-2 text-muted-foreground">
        Every game the club has covered.
      </p>

      <div className="mt-8 w-full min-w-0 overflow-hidden">
        <div
          className="mb-2 hidden min-w-0 grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)_minmax(5.5rem,7rem)_minmax(0,1fr)_minmax(0,1fr)_minmax(3.5rem,auto)] gap-3 text-xs font-medium uppercase tracking-wide text-muted-foreground md:grid md:gap-4"
          aria-hidden
        >
          
        </div>

        <div>
          {allGames.map((game) => (
            <AllGamesRow key={game.slug} game={game} />
          ))}
        </div>
      </div>
    </main>
  );
}
