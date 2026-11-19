"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import {
  toggleForumReplyLike,
  toggleForumThreadLike,
} from "@/lib/forum";

export default function ForumLikeButton({
  user,
  threadId,
  replyId = null,
  likeCount = 0,
  liked = false,
  onChanged,
}) {
  const [count, setCount] = useState(likeCount);
  const [isLiked, setIsLiked] = useState(liked);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCount(likeCount);
    setIsLiked(liked);
  }, [likeCount, liked]);

  async function handleToggle() {
    if (!user || loading) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = replyId
        ? await toggleForumReplyLike({ user, threadId, replyId })
        : await toggleForumThreadLike({ user, threadId });

      setCount(result.likeCount);
      setIsLiked(result.liked);
      onChanged?.(result);
    } catch (toggleError) {
      setError(toggleError.message);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Heart className="size-4" aria-hidden />
        <span>{count}</span>
        <Link href="/login" className="underline-offset-4 hover:underline">
          Log in to like
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        aria-pressed={isLiked}
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors disabled:opacity-50 ${
          isLiked
            ? "border-club-poster-text/40 bg-muted text-club-poster-text"
            : "border-border bg-background text-muted-foreground hover:bg-muted"
        }`}
      >
        <Heart
          className={`size-4 ${isLiked ? "fill-current" : ""}`}
          aria-hidden
        />
        <span>{count}</span>
        <span className="sr-only">{isLiked ? "Unlike" : "Like"}</span>
      </button>
      {error ? (
        <p className="mt-1 text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
