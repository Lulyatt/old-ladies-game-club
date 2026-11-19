"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import GameReviewForm from "@/components/game-review-form";
import ReviewsListSection from "@/components/reviews-list-section";
import { fetchReviewsByGameSlug, sortReviewsByLikes } from "@/lib/reviews";

export default function GameReviewsHubBody({ game, initialReviews }) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [refreshing, setRefreshing] = useState(false);

  const loadReviews = useCallback(async () => {
    setRefreshing(true);

    try {
      const nextReviews = await fetchReviewsByGameSlug(game.slug, {
        coverImage: game.coverImage,
      });
      setReviews(nextReviews);
      router.refresh();
    } finally {
      setRefreshing(false);
    }
  }, [game.slug, game.coverImage, router]);

  const topReviews = sortReviewsByLikes(reviews);
  const recentReviews = reviews;

  return (
    <>
      <div className="mt-6 min-w-0">
        <GameReviewForm game={game} onSaved={loadReviews} />
      </div>

      {refreshing ? (
        <p className="mt-6 text-sm text-muted-foreground">Updating reviews…</p>
      ) : null}

      <div className="mt-10 grid min-w-0 gap-10 md:grid-cols-2 md:items-start md:gap-8 lg:gap-10">
        <ReviewsListSection
          title="Top reviews"
          description="Sorted by club appreciation when available."
          reviews={topReviews}
          emptyMessage="No reviews yet."
        />
        <ReviewsListSection
          title="Recent reviews"
          description="Newest member write-ups first."
          reviews={recentReviews}
          emptyMessage="No reviews yet."
        />
      </div>
    </>
  );
}
