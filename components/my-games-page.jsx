"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import MyGamesListColumn from "@/components/my-games-list-column";
import { fetchFavouriteGamesForUser, removeFavourite } from "@/lib/favourites";
import { auth } from "@/lib/firebase";
import {
  fetchPlayQueueGamesForUser,
  removeFromPlayQueue,
} from "@/lib/play-queue";

export default function MyGamesPage() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [favouriteGames, setFavouriteGames] = useState([]);
  const [playQueueGames, setPlayQueueGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingFavouriteSlug, setRemovingFavouriteSlug] = useState(null);
  const [removingQueueSlug, setRemovingQueueSlug] = useState(null);

  const loadLists = useCallback(async () => {
    if (!user) {
      setFavouriteGames([]);
      setPlayQueueGames([]);
      setLoading(false);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const [favourites, playQueue] = await Promise.all([
        fetchFavouriteGamesForUser(user.uid),
        fetchPlayQueueGamesForUser(user.uid),
      ]);
      setFavouriteGames(favourites);
      setPlayQueueGames(playQueue);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    loadLists();
  }, [authReady, loadLists]);

  async function handleRemoveFavourite(gameSlug) {
    if (!user || removingFavouriteSlug) {
      return;
    }

    setRemovingFavouriteSlug(gameSlug);
    setError("");

    try {
      await removeFavourite(user.uid, gameSlug);
      setFavouriteGames((current) =>
        current.filter((game) => game.slug !== gameSlug),
      );
    } catch (removeError) {
      setError(removeError.message);
    } finally {
      setRemovingFavouriteSlug(null);
    }
  }

  async function handleRemoveFromQueue(gameSlug) {
    if (!user || removingQueueSlug) {
      return;
    }

    setRemovingQueueSlug(gameSlug);
    setError("");

    try {
      await removeFromPlayQueue(user.uid, gameSlug);
      setPlayQueueGames((current) =>
        current.filter((game) => game.slug !== gameSlug),
      );
    } catch (removeError) {
      setError(removeError.message);
    } finally {
      setRemovingQueueSlug(null);
    }
  }

  if (!authReady) {
    return (
      <main className="mx-auto max-w-7xl flex-1 px-4 py-16 md:px-6">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-7xl flex-1 px-4 py-16 md:px-6">
        <h1 className="text-3xl font-bold">My Games</h1>
        <p className="mt-4 text-muted-foreground">
          Log in to save favourites and build your play queue.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Go to Login
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-16 md:px-6">
      <h1 className="text-3xl font-bold">My Games</h1>
      <p className="mt-2 text-muted-foreground">
        Favourites and your play queue from the club library.
      </p>

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading your lists…</p>
      ) : null}

      {error ? (
        <p className="mt-8 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {!loading ? (
        <div className="mt-8 grid min-w-0 gap-8 md:grid-cols-2 md:items-start md:gap-6 lg:gap-8">
          <MyGamesListColumn
            title="Favourited games"
            description="Games you want to keep on your shelf."
            games={favouriteGames}
            removingSlug={removingFavouriteSlug}
            onRemove={handleRemoveFavourite}
            emptyMessage={
              <>
                No favourites yet. On a game page, use &quot;Add to My Games&quot;, or{" "}
                <Link href="/all-games" className="underline-offset-4 hover:underline">
                  browse all games
                </Link>
                .
              </>
            }
          />
          <MyGamesListColumn
            title="Play Queue"
            description="What you plan to play next."
            games={playQueueGames}
            removingSlug={removingQueueSlug}
            onRemove={handleRemoveFromQueue}
            emptyMessage={
              <>
                Your queue is empty. On a game page, use &quot;Add to Play Queue&quot;, or{" "}
                <Link href="/all-games" className="underline-offset-4 hover:underline">
                  browse all games
                </Link>
                .
              </>
            }
          />
        </div>
      ) : null}
    </main>
  );
}
