"use client";

import { useEffect, useRef, useState } from "react";
import ClubReviewCard from "@/components/club-review-card";

export default function ClubReviewsCarousel({
  reviews,
  title,
  description,
  emptyMessage,
  linkGame = true,
  showAuthorPortrait = false,
  showUsername = true,
  scrollCarousel = false,
  gridLayout = false,
  reviewLinkHref = null,
}) {
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const linkReviews = Boolean(reviewLinkHref);
  const sectionRef = useRef(null);
  const scrollerRef = useRef(null);
  const dragState = useRef({
    active: false,
    capturing: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
    suppressClick: false,
  });

  useEffect(() => {
    if (linkReviews || !expandedReviewId) {
      return;
    }

    function handlePointerDown(event) {
      if (sectionRef.current?.contains(event.target)) {
        return;
      }

      setExpandedReviewId(null);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [expandedReviewId, linkReviews]);

  function handleScrollerPointerDown(event) {
    if (!scrollCarousel || event.button !== 0) {
      return;
    }

    if (event.target.closest("a")) {
      return;
    }

    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    dragState.current = {
      active: true,
      capturing: false,
      startX: event.clientX,
      scrollLeft: scroller.scrollLeft,
      moved: false,
      suppressClick: false,
    };
  }

  function handleScrollerPointerMove(event) {
    if (!scrollCarousel || !dragState.current.active) {
      return;
    }

    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    const distance = event.clientX - dragState.current.startX;

    if (Math.abs(distance) < 8) {
      return;
    }

    dragState.current.moved = true;

    if (!dragState.current.capturing) {
      scroller.setPointerCapture(event.pointerId);
      dragState.current.capturing = true;
    }

    if (event.pointerType === "mouse") {
      event.preventDefault();
      scroller.scrollLeft = dragState.current.scrollLeft - distance;
    }
  }

  function endScrollerDrag(event) {
    if (!dragState.current.active) {
      return;
    }

    dragState.current.suppressClick = dragState.current.moved;
    dragState.current.active = false;
    dragState.current.moved = false;

    if (dragState.current.capturing) {
      scrollerRef.current?.releasePointerCapture(event.pointerId);
      dragState.current.capturing = false;
    }
  }

  function toggleExpanded(reviewId) {
    if (dragState.current.suppressClick) {
      dragState.current.suppressClick = false;
      return;
    }

    setExpandedReviewId((current) => (current === reviewId ? null : reviewId));
  }

  const scrollTrackClass = gridLayout
    ? "mt-4 grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-3"
    : scrollCarousel
      ? "flex w-full min-w-0 max-w-full cursor-grab snap-x snap-mandatory snap-always gap-4 overflow-x-auto overscroll-x-contain scroll-smooth touch-pan-x active:cursor-grabbing pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      : "mt-4 flex w-full min-w-0 snap-x snap-mandatory snap-always gap-4 overflow-x-auto pb-2 scroll-ps-[calc(50%-min(50vw-1.25rem,18rem))] scroll-pe-[calc(50%-min(50vw-1.25rem,18rem))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mt-5 md:grid md:grid-cols-1 md:gap-4 md:overflow-visible md:snap-none md:scroll-ps-0 md:scroll-pe-0 lg:grid-cols-2";

  return (
    <section ref={sectionRef} className="min-w-0 max-w-full">
      <h2 className="text-center text-base font-bold md:text-left md:text-2xl">{title}</h2>
      {description ? (
        <p className="mx-auto mt-1 max-w-md text-center text-sm text-muted-foreground md:mx-0 md:text-left">
          {description}
        </p>
      ) : null}

      {reviews.length === 0 ? (
        <p className="mt-6 text-center text-sm text-muted-foreground md:text-left">
          {emptyMessage}
        </p>
      ) : (
        <div
          className={
            scrollCarousel && !gridLayout
              ? "mt-4 w-full min-w-0 max-w-full overflow-hidden"
              : ""
          }
        >
          <div
            ref={scrollCarousel && !gridLayout ? scrollerRef : undefined}
            className={scrollTrackClass}
            onPointerDown={
              scrollCarousel && !gridLayout ? handleScrollerPointerDown : undefined
            }
            onPointerMove={
              scrollCarousel && !gridLayout ? handleScrollerPointerMove : undefined
            }
            onPointerUp={scrollCarousel && !gridLayout ? endScrollerDrag : undefined}
            onPointerCancel={
              scrollCarousel && !gridLayout ? endScrollerDrag : undefined
            }
          >
            {reviews.map((review) =>
              scrollCarousel && !gridLayout ? (
                <div
                  key={review.id}
                  className="w-[min(calc(100vw-2.5rem),36rem)] max-w-full shrink-0 snap-center min-w-0"
                >
                  <ClubReviewCard
                    review={review}
                    linkGame={linkGame}
                    href={reviewLinkHref}
                    showAuthorPortrait={showAuthorPortrait}
                    showUsername={showUsername}
                    inScrollCarousel
                    isExpanded={linkReviews ? false : expandedReviewId === review.id}
                    onToggleExpand={
                      linkReviews ? undefined : () => toggleExpanded(review.id)
                    }
                  />
                </div>
              ) : (
                <ClubReviewCard
                  key={review.id}
                  review={review}
                  linkGame={linkGame}
                  href={reviewLinkHref}
                  showAuthorPortrait={showAuthorPortrait}
                  showUsername={showUsername}
                  compactGrid={gridLayout}
                  isExpanded={linkReviews ? false : expandedReviewId === review.id}
                  onToggleExpand={
                    linkReviews ? undefined : () => toggleExpanded(review.id)
                  }
                />
              ),
            )}
          </div>
          {scrollCarousel && !gridLayout && reviews.length > 1 ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Drag or swipe sideways to read more reviews
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}
