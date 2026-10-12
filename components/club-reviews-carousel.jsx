"use client";

import { useEffect, useRef, useState } from "react";
import ClubReviewCard from "@/components/club-review-card";

export default function ClubReviewsCarousel({
  reviews,
  title,
  description,
  emptyMessage,
  linkGame = true,
  showUsername = true,
}) {
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!expandedReviewId) {
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
  }, [expandedReviewId]);

  function toggleExpanded(reviewId) {
    setExpandedReviewId((current) => (current === reviewId ? null : reviewId));
  }

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
        <div className="mt-4 flex w-full min-w-0 snap-x snap-mandatory snap-always gap-4 overflow-x-auto pb-2 scroll-ps-[calc(50%-min(50vw-1.25rem,18rem))] scroll-pe-[calc(50%-min(50vw-1.25rem,18rem))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mt-5 md:grid md:grid-cols-1 md:gap-4 md:overflow-visible md:snap-none md:scroll-ps-0 md:scroll-pe-0 lg:grid-cols-2">
          {reviews.map((review) => (
            <ClubReviewCard
              key={review.id}
              review={review}
              linkGame={linkGame}
              showUsername={showUsername}
              isExpanded={expandedReviewId === review.id}
              onToggleExpand={() => toggleExpanded(review.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
