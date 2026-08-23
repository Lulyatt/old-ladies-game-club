import { gameOfTheMonth } from "@/data/game-of-the-month";
import BlogPosts from "@/components/blog-posts";
import { blogPosts } from "@/data/blogPosts";
import { games } from "@/data/games";
import BlankroomSection from "@/components/blankroom-section";
import PageDivider from "@/components/page-divider";
import RoomPanel from "@/components/room-panel";
import SnapScreen from "@/components/snap-screen";

export default function Home() {
  const browseGames = games.filter((g) => g.slug !== gameOfTheMonth.slug);

  return (
    <main className="flex flex-col overflow-x-hidden">
      <SnapScreen belowNav className="md:h-auto">
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <img
            src="/hero.png"
            alt="Old Ladies Game Club"
            className="absolute inset-0 h-full w-full object-cover object-top md:static md:h-auto md:w-full md:object-contain"
          />
        </div>
        <PageDivider />
      </SnapScreen>

      <BlankroomSection game={gameOfTheMonth} games={browseGames} />

      <PageDivider className="max-md:hidden" />

      <SnapScreen className="md:h-auto">
        <RoomPanel
          image="/basement.png"
          filterClassName="saturate-250 brightness-60"
          desktopBgClassName="bg-no-repeat min-[1400px]:bg-repeat-y"
          className="max-md:h-full"
        >
          <BlogPosts blogPosts={blogPosts} />
        </RoomPanel>
      </SnapScreen>
    </main>
  );
}
