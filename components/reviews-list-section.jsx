"use client";

import { useEffect, useRef, useState } from "react";
import ClubReviewCard from "@/components/club-review-card";

export default function ReviewsListSection({
  reviews,
  title,
  description,
  emptyMessage,
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

  return (
    <section ref={sectionRef} className="min-w-0">
      <h2 className="text-lg font-bold md:text-xl">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}

      {reviews.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="min-w-0">
              <ClubReviewCard
                review={review}
                linkGame={false}
                showAuthorPortrait
                isExpanded={expandedReviewId === review.id}
                onToggleExpand={() =>
                  setExpandedReviewId((current) =>
                    current === review.id ? null : review.id,
                  )
                }
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
