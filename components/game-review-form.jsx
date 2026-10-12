"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ensureUserProfile } from "@/lib/ensure-user-profile";
import {
  AESTHETICS_OPTIONS,
  VALUE_FOR_MONEY_OPTIONS,
} from "@/lib/review-extra-ratings";
import {
  fetchUserReviewForGame,
  formatScoreNumber,
  saveReview,
} from "@/lib/reviews";

const SCORE_OPTIONS = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1];

export default function GameReviewForm({ game, onSaved }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [aesthetics, setAesthetics] = useState("not_bad");
  const [valueForMoney, setValueForMoney] = useState("about_right");
  const [score, setScore] = useState("4.5");
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authReady) return;

    if (!user) {
      setLoadingExisting(false);
      return;
    }

    let cancelled = false;

    async function loadExistingReview() {
      setLoadingExisting(true);

      try {
        const existing = await fetchUserReviewForGame(user.uid, game.slug);
        if (cancelled) return;

        if (existing) {
          setReviewText(existing.reviewText ?? "");
          setAesthetics(existing.aesthetics ?? "not_bad");
          setValueForMoney(existing.valueForMoney ?? "about_right");
          setScore(String(existing.score ?? 4.5));
          setIsEditing(true);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message);
        }
      } finally {
        if (!cancelled) {
          setLoadingExisting(false);
        }
      }
    }

    loadExistingReview();

    return () => {
      cancelled = true;
    };
  }, [authReady, user, game.slug]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const profile = await ensureUserProfile(user);
      await saveReview({
        user,
        username: profile.username,
        game,
        reviewText,
        aesthetics,
        valueForMoney,
        score,
      });
      setIsEditing(true);
      onSaved?.();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  if (!authReady || loadingExisting) {
    return (
      <p className="mt-6 text-sm text-muted-foreground">Loading review form…</p>
    );
  }

  if (!user) {
    return (
      <div className="card-raised mt-8 p-5">
        <h2 className="text-lg font-bold">Write a review</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Log in to share your thoughts with the club.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card-raised mt-8 flex flex-col gap-4 p-5">
      <div>
        <h2 className="text-lg font-bold">
          {isEditing ? "Update your review" : "Write a review"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Share your verdict with the club. You can edit this later.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="review-text" className="text-sm font-medium">
          Your review
        </label>
        <textarea
          id="review-text"
          required
          rows={5}
          value={reviewText}
          onChange={(event) => setReviewText(event.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="review-aesthetics" className="text-sm font-medium">
          Aesthetics
        </label>
        <select
          id="review-aesthetics"
          value={aesthetics}
          onChange={(event) => setAesthetics(event.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          {AESTHETICS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="review-value" className="text-sm font-medium">
          Value for money
        </label>
        <select
          id="review-value"
          value={valueForMoney}
          onChange={(event) => setValueForMoney(event.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          {VALUE_FOR_MONEY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="review-score" className="text-sm font-medium">
          Score
        </label>
        <select
          id="review-score"
          value={score}
          onChange={(event) => setScore(event.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          {SCORE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              ⭐ {formatScoreNumber(option)} / 5
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-fit rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {loading ? "Saving…" : isEditing ? "Update review" : "Submit review"}
      </button>
    </form>
  );
}
