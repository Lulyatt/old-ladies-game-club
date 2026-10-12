"use client";

import { useRef } from "react";

export default function GameScreenshotsCarousel({ screenshots, gameTitle }) {
  const scrollerRef = useRef(null);
  const dragState = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
  });

  if (!screenshots?.length) {
    return null;
  }

  const total = screenshots.length;

  function handlePointerDown(event) {
    if (event.pointerType !== "mouse" || event.button !== 0) {
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
        aria-label={`${gameTitle} screenshots`}
        role="region"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {screenshots.map((shot, index) => (
          <figure key={shot.id} className="m-0 w-80 max-w-[85vw] shrink-0">
            <img
              src={shot.path_full}
              alt={`${gameTitle} screenshot ${index + 1} of ${total}`}
              className="block h-auto w-full select-none rounded-lg border border-border"
              draggable={false}
            />
          </figure>
        ))}
      </div>
      {total > 1 ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Drag or swipe sideways to browse {total} screenshots
        </p>
      ) : null}
    </div>
  );
}
