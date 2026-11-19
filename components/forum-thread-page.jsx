"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import ForumPost from "@/components/forum-post";
import ForumReplyForm from "@/components/forum-reply-form";
import { auth } from "@/lib/firebase";
import {
  fetchForumLikeState,
  fetchForumReplies,
  fetchForumThread,
} from "@/lib/forum";

export default function ForumThreadPage({ threadId }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [threadLiked, setThreadLiked] = useState(false);
  const [replyLiked, setReplyLiked] = useState({});

  const loadThread = useCallback(async () => {
    setError("");
    setNotFound(false);

    try {
      const [nextThread, nextReplies] = await Promise.all([
        fetchForumThread(threadId),
        fetchForumReplies(threadId),
      ]);

      if (!nextThread) {
        setNotFound(true);
        setThread(null);
        setReplies([]);
        return;
      }

      setThread(nextThread);
      setReplies(nextReplies);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    if (!thread) {
      return;
    }

    if (!user?.uid) {
      setThreadLiked(false);
      setReplyLiked({});
      return;
    }

    let cancelled = false;

    async function loadLikeState() {
      try {
        const likeState = await fetchForumLikeState(
          user.uid,
          threadId,
          replies.map((reply) => reply.id),
        );

        if (!cancelled) {
          setThreadLiked(likeState.threadLiked);
          setReplyLiked(likeState.replyLiked);
        }
      } catch {
        if (!cancelled) {
          setThreadLiked(false);
          setReplyLiked({});
        }
      }
    }

    loadLikeState();

    return () => {
      cancelled = true;
    };
  }, [thread, replies, threadId, user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    setLoading(true);
    loadThread();
  }, [loadThread]);

  if (loading) {
    return (
      <main className="mx-auto w-full min-w-0 max-w-3xl flex-1 px-4 py-16 md:px-6">
        <p className="text-sm text-muted-foreground">Loading thread…</p>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="mx-auto w-full min-w-0 max-w-3xl flex-1 px-4 py-16 md:px-6">
        <h1 className="text-2xl font-bold">Thread not found</h1>
        <Link
          href="/forum"
          className="mt-4 inline-block text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Back to Forum
        </Link>
      </main>
    );
  }

  if (error || !thread) {
    return (
      <main className="mx-auto w-full min-w-0 max-w-3xl flex-1 px-4 py-16 md:px-6">
        <p className="text-sm text-destructive" role="alert">
          {error || "Could not load this thread."}
        </p>
        <Link
          href="/forum"
          className="mt-4 inline-block text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Back to Forum
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-3xl flex-1 px-4 py-16 md:px-6">
      <Link
        href="/forum"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Forum
      </Link>

      <ForumPost
        title={thread.title}
        body={thread.body}
        authorUsername={thread.authorUsername}
        avatarSrc={thread.avatarSrc}
        avatarAlt={thread.avatarAlt}
        fallbackInitial={thread.fallbackInitial}
        createdAtLabel={thread.createdAtLabel}
        threadId={threadId}
        likeCount={thread.likeCount}
        liked={threadLiked}
        user={user}
        onLikeChanged={(result) => {
          setThreadLiked(result.liked);
          setThread((current) =>
            current ? { ...current, likeCount: result.likeCount } : current,
          );
        }}
      />

      <section className="mt-8 min-w-0">
        <h2 className="text-lg font-semibold">
          Replies ({replies.length})
        </h2>

        {replies.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No replies yet.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {replies.map((reply) => (
              <ForumPost
                key={reply.id}
                body={reply.body}
                authorUsername={reply.authorUsername}
                avatarSrc={reply.avatarSrc}
                avatarAlt={reply.avatarAlt}
                fallbackInitial={reply.fallbackInitial}
                createdAtLabel={reply.createdAtLabel}
                threadId={threadId}
                replyId={reply.id}
                likeCount={reply.likeCount}
                liked={Boolean(replyLiked[reply.id])}
                user={user}
                onLikeChanged={(result) => {
                  setReplyLiked((current) => ({
                    ...current,
                    [reply.id]: result.liked,
                  }));
                  setReplies((current) =>
                    current.map((entry) =>
                      entry.id === reply.id
                        ? { ...entry, likeCount: result.likeCount }
                        : entry,
                    ),
                  );
                }}
              />
            ))}
          </div>
        )}
      </section>

      {authReady && !user ? (
        <div className="card-raised mt-8 p-5">
          <p className="text-sm text-muted-foreground">
            Log in to reply to this thread.
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
        <ForumReplyForm user={user} threadId={threadId} onPosted={loadThread} />
      ) : null}
    </main>
  );
}
