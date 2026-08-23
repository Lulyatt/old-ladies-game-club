"use client";

import { useEffect, useRef, useState } from "react";

const BLANKROOM_TILE_HEIGHT_RATIO = 941 / 1672;

export default function RoomSection({
  children,
  background,
  tileHeightRatio = BLANKROOM_TILE_HEIGHT_RATIO,
  backgroundClassName = "",
}) {
  const sectionRef = useRef(null);
  const [dividerCount, setDividerCount] = useState(0);
  const [tileHeight, setTileHeight] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mediaQuery = window.matchMedia("(min-width: 640px)");

    const update = () => {
      const width = section.offsetWidth;
      const tileH = width * tileHeightRatio;

      setTileHeight(tileH);

      setDividerCount(0);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(section);
    mediaQuery.addEventListener("change", update);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, [tileHeightRatio]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[calc(100vw*941/1672)] sm:min-h-[calc(100vw*941/1672)]"
    >
      <div
        className={`absolute inset-0 bg-[length:100%_auto] bg-top bg-repeat-y ${backgroundClassName}`}
        style={{ backgroundImage: `url('${background}')` }}
        aria-hidden
      />

      {Array.from({ length: dividerCount }).map((_, index) => (
        <img
          key={index}
          src="/pagedivider.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-0 z-[5] block h-auto max-h-[60px] w-full -translate-y-1/2 object-cover sm:max-h-[100px]"
          style={{ top: `${(index + 1) * tileHeight}px` }}
        />
      ))}

      <div className="relative z-10">{children}</div>
    </section>
  );
}
