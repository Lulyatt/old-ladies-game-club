import { gameOfTheMonth } from "@/data/game-of-the-month";
import GameOfTheMonth from "@/components/game-of-the-month";
import BlogPosts from "@/components/blog-posts";
import { blogPosts } from "@/data/blogPosts";

export default function Home() {
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
          className="block h-auto max-h-[60px] w-full object-cover sm:max-h-[100px]"
        />
      </section>

      <section className="relative w-full min-h-[480px] md:min-h-[855px]">
        <div
          className="absolute inset-0 bg-[url('/blankroom.png')] bg-cover bg-top bg-no-repeat"
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <GameOfTheMonth game={gameOfTheMonth} />
        </div>
      </section>

      <img
        src="/pagedivider.png"
        alt=""
        className="block h-auto max-h-[60px] w-full object-cover sm:max-h-[100px]"
      />

      <section className="relative w-full min-h-[480px] md:min-h-[855px]">
        <div
          className="absolute inset-0 bg-[url('/basement.png')] bg-cover bg-top bg-no-repeat saturate-250 brightness-60"
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <BlogPosts blogPosts={blogPosts} />
        </div>
      </section>
    </main>
  );
}
