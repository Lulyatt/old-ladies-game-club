"use client";

import Link from "next/link";
import { ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { fetchReviewAgreeState, toggleReviewAgree } from "@/lib/reviews";

export default function ReviewAgreeButton({
  reviewId,
  likeCount = 0,
  onCountChange,
}) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [count, setCount] = useState(likeCount);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    setCount(likeCount);
  }, [likeCount]);

  useEffect(() => {
    if (!authReady || !user) {
      setAgreed(false);
      return;
    }

    let cancelled = false;

    async function loadAgreed() {
      try {
        const state = await fetchReviewAgreeState(user.uid, [reviewId]);
        if (!cancelled) {
          setAgreed(Boolean(state[reviewId]));
        }
      } catch {
        if (!cancelled) {
          setAgreed(false);
        }
      }
    }

    loadAgreed();

    return () => {
      cancelled = true;
    };
  }, [authReady, user, reviewId]);

  async function handleToggle(event) {
    event.stopPropagation();
    event.preventDefault();

    if (!user || loading) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await toggleReviewAgree({ user, reviewId });
      setCount(result.likeCount);
      setAgreed(result.agreed);
      onCountChange?.(result.likeCount);
    } catch (toggleError) {
      setError(toggleError.message);
    } finally {
      setLoading(false);
    }
  }

  if (!authReady) {
    return (
      <div
        data-review-agree
        className="inline-flex items-center gap-1 text-xs text-muted-foreground"
      >
        <ThumbsUp className="size-3.5" aria-hidden />
        <span>{count}</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        data-review-agree
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
        onClick={(event) => event.stopPropagation()}
      >
        <ThumbsUp className="size-3.5" aria-hidden />
        <span>{count}</span>
        <Link
          href="/login"
          className="underline-offset-4 hover:underline"
          onClick={(event) => event.stopPropagation()}
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div data-review-agree onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        aria-pressed={agreed}
        aria-label={agreed ? "Remove agree" : "Agree with review"}
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors disabled:opacity-50 ${
          agreed
            ? "border-club-poster-text/40 bg-muted text-club-poster-text"
            : "border-border bg-background text-muted-foreground hover:bg-muted"
        }`}
      >
        <ThumbsUp
          className={`size-3.5 ${agreed ? "fill-current" : ""}`}
          aria-hidden
        />
        <span>{count}</span>
      </button>
      {error ? (
        <p className="mt-1 text-[10px] text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
