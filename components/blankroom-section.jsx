"use client";

import { useEffect, useRef, useState } from "react";
import GameOfTheMonth from "@/components/game-of-the-month";
import BrowseGames from "@/components/browse-games";

const TILE_HEIGHT_RATIO = 941 / 1672;

export default function BlankroomSection({ game, games }) {
  const sectionRef = useRef(null);
  const gotmRef = useRef(null);
  const browseRef = useRef(null);
  const [split, setSplit] = useState(false);
  const [tileHeight, setTileHeight] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const update = () => {
      const width = section.offsetWidth;
      const tileH = width * TILE_HEIGHT_RATIO;
      setTileHeight(tileH);

      const gotmHeight = gotmRef.current?.offsetHeight ?? 0;
      const browseHeight = browseRef.current?.offsetHeight ?? 0;
      const contentHeight = gotmHeight + browseHeight + 32;

      setSplit(contentHeight > tileH);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(section);
    if (gotmRef.current) observer.observe(gotmRef.current);
    if (browseRef.current) observer.observe(browseRef.current);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [split]);

  const panelHeight =
    tileHeight > 0 ? `${tileHeight}px` : "calc(100vw * 941 / 1672)";

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[calc(100vw*941/1672)]"
    >
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
            className="relative z-10 flex min-h-0 items-center justify-center"
            style={{ minHeight: panelHeight }}
          >
            <div ref={gotmRef} className="mx-auto w-full min-w-0 max-w-3xl px-3 sm:px-4">
              <GameOfTheMonth game={game} />
            </div>
          </div>

          <div
            className="relative z-10 flex min-h-0 items-center justify-center"
            style={{ minHeight: panelHeight }}
          >
            <div ref={browseRef} className="mx-auto w-full min-w-0 max-w-3xl px-3 sm:px-4">
              <BrowseGames games={games} />
            </div>
          </div>
        </>
      ) : (
        <div className="relative z-10 mx-auto w-full min-w-0 max-w-3xl px-3 py-3 sm:px-4 sm:py-4">
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
