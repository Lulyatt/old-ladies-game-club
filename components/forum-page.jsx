"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import ForumNewThreadForm from "@/components/forum-new-thread-form";
import { auth } from "@/lib/firebase";
import { fetchForumThreads } from "@/lib/forum";

export default function ForumPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadThreads = useCallback(async () => {
    setError("");

    try {
      const nextThreads = await fetchForumThreads();
      setThreads(nextThreads);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  function handleThreadCreated(threadId) {
    if (threadId) {
      router.push(`/forum/${threadId}`);
      return;
    }

    loadThreads();
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-5xl flex-1 px-4 py-16 md:px-6">
      <h1 className="text-3xl font-bold">Forum</h1>
      <p className="mt-2 text-muted-foreground">
        Chat with the club. Anyone can read; log in to post.
      </p>

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading threads…</p>
      ) : null}

      {error ? (
        <p className="mt-8 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {!loading && !error ? (
        <div className="mt-8 min-w-0 space-y-3">
          {threads.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No threads yet. Be the first to start a conversation.
            </p>
          ) : (
            threads.map((thread) => (
              <Link
                key={thread.id}
                href={`/forum/${thread.id}`}
                className="card-raised block min-w-0 p-4 transition-opacity hover:opacity-90 md:p-5"
              >
                <h2 className="text-base font-bold break-words md:text-lg">
                  {thread.title}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {thread.authorUsername} • {thread.lastActivityLabel} •{" "}
                  {thread.replyCount}{" "}
                  {thread.replyCount === 1 ? "reply" : "replies"}
                </p>
                {thread.bodyPreview ? (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {thread.bodyPreview}
                  </p>
                ) : null}
              </Link>
            ))
          )}
        </div>
      ) : null}

      {authReady && !user ? (
        <div className="card-raised mt-8 p-5">
          <h2 className="text-lg font-bold">Join the conversation</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Log in to start a thread or reply.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Go to Login
          </Link>
        </div>
      ) : null}

      {user ? (
        <ForumNewThreadForm user={user} onCreated={handleThreadCreated} />
      ) : null}
    </main>
  );
}
