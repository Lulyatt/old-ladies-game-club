import { gameOfTheMonth } from "@/data/game-of-the-month";
import BlogPosts from "@/components/blog-posts";
import { blogPosts } from "@/data/blogPosts";
import { games } from "@/data/games";
import GameOfTheMonth from "@/components/game-of-the-month";
import BrowseGames from "@/components/browse-games";
import PageSection from "@/components/page-section";

const backgrounds = {
  hero: {
    mobile: "/backgrounds/hero-mobile.png",
    desktop: "/backgrounds/hero-desktop.png",
  },
  blankroom: {
    mobile: "/backgrounds/blankroom-mobile.png",
    desktop: "/backgrounds/blankroom-desktop.png",
  },
  basement: {
    mobile: "/backgrounds/basement-mobile.png",
    desktop: "/backgrounds/basement-desktop.png",
  },
};

export default function Home() {
  const browseGames = games.filter((g) => g.slug !== gameOfTheMonth.slug);

  return (
    <main className="flex flex-col overflow-x-hidden">
      <PageSection
        mobileImage={backgrounds.hero.mobile}
        desktopImage={backgrounds.hero.desktop}
        imageAlt="Old Ladies Game Club"
        belowNav
        divider
        desktopFit="natural"
      />

      <PageSection
        mobileImage={backgrounds.blankroom.mobile}
        desktopImage={backgrounds.blankroom.desktop}
        divider
        desktopFit="natural"
      >
        <GameOfTheMonth game={gameOfTheMonth} />
      </PageSection>

      <PageSection
        mobileImage={backgrounds.blankroom.mobile}
        desktopImage={backgrounds.blankroom.desktop}
        divider
        desktopFit="natural"
      >
        <BrowseGames games={browseGames} />
      </PageSection>

      <PageSection
        mobileImage={backgrounds.basement.mobile}
        desktopImage={backgrounds.basement.desktop}
        desktopFit="natural"
      >
        <BlogPosts blogPosts={blogPosts} />
      </PageSection>
    </main>
  );
}
