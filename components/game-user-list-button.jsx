"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  USER_GAME_LISTS,
  addGameToList,
  isGameInList,
  removeGameFromList,
} from "@/lib/user-game-lists";
import { auth } from "@/lib/firebase";

const LIST_LABELS = {
  [USER_GAME_LISTS.favourites]: {
    add: "Add to My Games",
    remove: "Remove from My Games",
  },
  [USER_GAME_LISTS.playQueue]: {
    add: "Add to Play Queue",
    remove: "Remove from Play Queue",
  },
};

export default function GameUserListButton({ listKey, gameSlug, gameTitle }) {
  const labels = LIST_LABELS[listKey];
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [inList, setInList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

    if (!user) {
      setInList(false);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadListState() {
      setLoading(true);
      setError("");

      try {
        const nextInList = await isGameInList(user.uid, gameSlug, listKey);

        if (!cancelled) {
          setInList(nextInList);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadListState();

    return () => {
      cancelled = true;
    };
  }, [authReady, user, gameSlug, listKey]);

  async function handleToggle() {
    if (!user || saving) {
      return;
    }

    setError("");
    setSaving(true);

    try {
      if (inList) {
        await removeGameFromList(user.uid, gameSlug, listKey);
        setInList(false);
      } else {
        await addGameToList(user.uid, gameSlug, listKey);
        setInList(true);
      }
    } catch (toggleError) {
      setError(toggleError.message);
    } finally {
      setSaving(false);
    }
  }

  if (!authReady || loading || !user || !labels) {
    return null;
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        disabled={saving}
        aria-pressed={inList}
        className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
      >
        {saving ? "Saving…" : inList ? labels.remove : labels.add}
      </button>
      <span className="sr-only">{gameTitle}</span>
      {error ? (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
