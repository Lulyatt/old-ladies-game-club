"use client";

import { useEffect, useRef, useState } from "react";
import GameOfTheMonth from "@/components/game-of-the-month";
import BrowseGames from "@/components/browse-games";
import RoomPanel from "@/components/room-panel";
import PageDivider from "@/components/page-divider";
import SnapScreen from "@/components/snap-screen";

const TILE_RATIO = 941 / 1672;

function MobilePanels({ game, games }) {
  return (
    <>
      <SnapScreen>
        <RoomPanel image="/blankroom.png" className="max-md:h-full">
          <GameOfTheMonth game={game} />
        </RoomPanel>
        <PageDivider />
      </SnapScreen>

      <SnapScreen>
        <RoomPanel image="/blankroom.png" className="max-md:h-full">
          <BrowseGames games={games} />
        </RoomPanel>
        <PageDivider />
      </SnapScreen>
    </>
  );
}

function DesktopSection({ game, games }) {
  const sectionRef = useRef(null);
  const gotmRef = useRef(null);
  const browseRef = useRef(null);
  const [split, setSplit] = useState(false);
  const [tileHeight, setTileHeight] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const update = () => {
      const tileH = section.offsetWidth * TILE_RATIO;
      setTileHeight(tileH);

      const gotmHeight = gotmRef.current?.offsetHeight ?? 0;
      const browseHeight = browseRef.current?.offsetHeight ?? 0;
      setSplit(gotmHeight + browseHeight + 32 > tileH);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(section);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const panelMinHeight =
    tileHeight > 0 ? `${tileHeight}px` : "calc(100vw * 941 / 1672)";

  return (
    <section ref={sectionRef} className="relative w-full min-h-[calc(100vw*941/1672)]">
      <div
        className="absolute inset-0 bg-[url('/blankroom.png')] bg-[length:100%_auto] bg-top bg-repeat-y"
        aria-hidden
      />

      {split && tileHeight > 0 && (
        <img
          src="/pagedivider.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-0 z-[5] block w-full -translate-y-1/2"
          style={{ top: `${tileHeight}px` }}
        />
      )}

      {split ? (
        <>
          <div
            className="relative z-10 flex items-center justify-center"
            style={{ minHeight: panelMinHeight }}
          >
            <div ref={gotmRef} className="mx-auto w-full min-w-0 max-w-3xl px-4 py-4">
              <GameOfTheMonth game={game} />
            </div>
          </div>
          <div
            className="relative z-10 flex items-center justify-center"
            style={{ minHeight: panelMinHeight }}
          >
            <div ref={browseRef} className="mx-auto w-full min-w-0 max-w-3xl px-4 py-4">
              <BrowseGames games={games} />
            </div>
          </div>
        </>
      ) : (
        <div className="relative z-10 mx-auto w-full min-w-0 max-w-3xl px-4 py-4">
          <div ref={gotmRef}>
            <GameOfTheMonth game={game} />
          </div>
          <div ref={browseRef}>
            <BrowseGames games={games} />
          </div>
        </div>
      )}
    </section>
  );
}

export default function BlankroomSection({ game, games }) {
  return (
    <>
      <div className="md:hidden">
        <MobilePanels game={game} games={games} />
      </div>
      <div className="hidden md:block">
        <DesktopSection game={game} games={games} />
      </div>
    </>
  );
}
