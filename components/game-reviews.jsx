"use client";

import { useCallback, useEffect, useState } from "react";
import ClubReviewsCarousel from "@/components/club-reviews-carousel";
import GameReviewForm from "@/components/game-review-form";
import { fetchReviewsByGameSlug } from "@/lib/reviews";

export default function GameReviews({ game }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReviews = useCallback(async () => {
    setError("");

    try {
      const nextReviews = await fetchReviewsByGameSlug(game.slug);
      setReviews(nextReviews);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [game.slug]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  return (
    <div className="mt-10 min-w-0 max-w-full">
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading reviews…</p>
      ) : (
        <ClubReviewsCarousel
          reviews={reviews}
          title="Club Reviews"
          description="What members thought after playing."
          emptyMessage="No member reviews yet. Be the first to share your thoughts."
          linkGame={false}
        />
      )}

      {error ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <GameReviewForm game={game} onSaved={loadReviews} />
    </div>
  );
}
