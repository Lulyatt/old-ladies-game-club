"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ClubReviewsCarousel from "@/components/club-reviews-carousel";
import {
  fetchReviewsByGameSlug,
  sortReviewsByLikes,
} from "@/lib/reviews";

export default function GameReviews({ game }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReviews = useCallback(async () => {
    setError("");

    try {
      const nextReviews = await fetchReviewsByGameSlug(game.slug, {
        coverImage: game.coverImage,
      });
      setReviews(sortReviewsByLikes(nextReviews).slice(0, 3));
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [game.slug, game.coverImage]);

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
          description="Top member reviews — tap one to read more on the reviews page."
          emptyMessage="No member reviews yet. Be the first to share your thoughts."
          linkGame={false}
          showAuthorPortrait
          gridLayout
          reviewLinkHref={`/reviews/${game.slug}`}
        />
      )}

      {error ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Link
        href={`/reviews/${game.slug}`}
        className="mt-8 inline-block rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
      >
        Share your thoughts
      </Link>
    </div>
  );
}
