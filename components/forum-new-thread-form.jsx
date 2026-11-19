"use client";

import { useState } from "react";
import { ensureUserProfile } from "@/lib/ensure-user-profile";
import { createForumThread } from "@/lib/forum";

export default function ForumNewThreadForm({ user, onCreated }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const profile = await ensureUserProfile(user);
      const threadId = await createForumThread({
        user,
        username: profile.username,
        avatarId: profile.avatarId,
        title,
        body,
      });
      setTitle("");
      setBody("");
      onCreated?.(threadId);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-raised mt-8 flex flex-col gap-4 p-5">
      <div>
        <h2 className="text-lg font-bold">Start a thread</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Share a thought with the club.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="forum-thread-title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="forum-thread-title"
          type="text"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="forum-thread-body" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="forum-thread-body"
          required
          rows={5}
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
        {loading ? "Posting…" : "Post thread"}
      </button>
    </form>
  );
}
