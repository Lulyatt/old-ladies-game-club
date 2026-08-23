import { gameOfTheMonth } from "@/data/game-of-the-month";
import BlogPosts from "@/components/blog-posts";
import { blogPosts } from "@/data/blogPosts";
import { games } from "@/data/games";
import BlankroomSection from "@/components/blankroom-section";

export default function Home() {
  const browseGames = games.filter((g) => g.slug !== gameOfTheMonth.slug);

  return (
    <main className="flex flex-1 flex-col overflow-x-hidden">
      <section className="w-full">
        <img
          src="/hero.png"
          alt="Old Ladies Game Club"
          className="w-full h-auto"
        />

        <img
          src="/pagedivider.png"
          alt=""
          className="block w-full h-auto"
        />
      </section>

      <BlankroomSection game={gameOfTheMonth} games={browseGames} />

      <img
        src="/pagedivider.png"
        alt=""
        className="block w-full h-auto"
      />

      <section className="relative w-full min-h-[calc(100vw*941/1672)]">
        <div
          className="absolute inset-0 bg-[url('/basement.png')] bg-[length:100%_auto] bg-top bg-no-repeat saturate-250 brightness-60 min-[1400px]:bg-repeat-y"
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-3xl px-3 py-3 sm:px-4 sm:py-4">
          <BlogPosts blogPosts={blogPosts} />
        </div>
      </section>
    </main>
  );
}
