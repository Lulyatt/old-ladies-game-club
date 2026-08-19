import { gameOfTheMonth } from "@/data/game-of-the-month";
import GameOfTheMonth from "@/components/game-of-the-month";

export default function Home() {

  return (
    <main className="flex flex-1 flex-col">
      {/* Full-width hero */}
      <section className="w-full">
        <img
          src="/hero.png"
          alt="Old Ladies Game Club"
          className="w-full h-auto"
        />
        <div className="px-6 py-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            The Old Ladies Game Club
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Pick a game. Play it. Talk about it.
          </p>
        </div>
      </section>

      {/* Later sections can be constrained */}
      <section className="mx-auto w-full max-w-5xl px-6 ">
      <GameOfTheMonth game={gameOfTheMonth} />
      </section>
    </main>
  ); }