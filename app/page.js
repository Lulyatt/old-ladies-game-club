import { gameOfTheMonth } from "@/data/game-of-the-month";
import GameOfTheMonth from "@/components/game-of-the-month";

export default function Home() {

  return (
    <main className="flex flex-1 flex-col">

      <section className="w-full">
        <img
          src="/hero.png"
          alt="Old Ladies Game Club"
          className="w-full h-auto"
        />


        <img
          src="/pagedivider.png"
          alt=""
          className="block w-full h-[52px]"
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


      <section className="relative w-full min-h-[855px]">

        <div
          className="absolute inset-0 bg-[url('/blankroom.png')] bg-cover bg-top bg-no-repeat"
          aria-hidden
        />
        
        {/* Content sits above background */}
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-12">
          <GameOfTheMonth game={gameOfTheMonth} />
        </div>
      </section>
    </main>
  );
}