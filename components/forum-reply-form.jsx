"use client";

import { useState } from "react";
import { ensureUserProfile } from "@/lib/ensure-user-profile";
import { createForumReply } from "@/lib/forum";

export default function ForumReplyForm({ user, threadId, onPosted }) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const profile = await ensureUserProfile(user);
      await createForumReply({
        user,
        username: profile.username,
        avatarId: profile.avatarId,
        threadId,
        body,
      });
      setBody("");
      onPosted?.();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-raised mt-6 flex flex-col gap-4 p-5">
      <h2 className="text-lg font-bold">Reply</h2>

      <div className="flex flex-col gap-2">
        <label htmlFor="forum-reply-body" className="text-sm font-medium">
          Your reply
        </label>
        <textarea
          id="forum-reply-body"
          required
          rows={4}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
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
        {loading ? "Posting…" : "Post reply"}
      </button>
    </form>
  );
}
