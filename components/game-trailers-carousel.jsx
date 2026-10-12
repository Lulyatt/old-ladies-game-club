"use client";

import { useRef } from "react";
import GameTrailer from "@/components/game-trailer";

export default function GameTrailersCarousel({ movies, gameTitle, steamStoreUrl }) {
  const scrollerRef = useRef(null);
  const dragState = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
  });

  if (!movies?.length) {
    return null;
  }

  const total = movies.length;

  function handlePointerDown(event) {
    if (event.pointerType !== "mouse" || event.button !== 0) {
      return;
    }

    if (event.target.closest("video, a, button")) {
      return;
    }

    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    dragState.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: scroller.scrollLeft,
    };

    scroller.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!dragState.current.active || event.pointerType !== "mouse") {
      return;
    }

    event.preventDefault();

    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    const distance = event.clientX - dragState.current.startX;
    scroller.scrollLeft = dragState.current.scrollLeft - distance;
  }

  function endDrag(event) {
    if (!dragState.current.active) {
      return;
    }

    dragState.current.active = false;
    scrollerRef.current?.releasePointerCapture(event.pointerId);
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden">
      <div
        ref={scrollerRef}
        className="flex w-full min-w-0 cursor-grab items-start gap-3 overflow-x-auto overscroll-x-contain scroll-smooth touch-pan-x active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label={`${gameTitle} trailers`}
        role="region"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="w-80 max-w-[85vw] shrink-0">
            <GameTrailer movie={movie} steamStoreUrl={steamStoreUrl} />
          </div>
        ))}
      </div>
      {total > 1 ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Drag or swipe sideways to browse {total} trailers
        </p>
      ) : null}
    </div>
  );
}
