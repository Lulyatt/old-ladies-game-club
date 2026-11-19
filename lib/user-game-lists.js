import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { games } from "@/data/games";
import { fetchAverageRatingsBySlug, formatClubGameRating } from "@/lib/reviews";
import { db } from "@/lib/firebase";

export const USER_GAME_LISTS = {
  favourites: "favourites",
  playQueue: "playQueue",
};

export async function fetchListSlugs(userId, listKey) {
  const listQuery = query(
    collection(db, "users", userId, listKey),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(listQuery);

  return snapshot.docs.map((entry) => entry.id);
}

export async function isGameInList(userId, gameSlug, listKey) {
  const itemRef = doc(db, "users", userId, listKey, gameSlug);
  const snapshot = await getDoc(itemRef);

  return snapshot.exists();
}

export async function addGameToList(userId, gameSlug, listKey) {
  const itemRef = doc(db, "users", userId, listKey, gameSlug);

  await setDoc(itemRef, {
    gameSlug,
    createdAt: serverTimestamp(),
  });
}

export async function removeGameFromList(userId, gameSlug, listKey) {
  const itemRef = doc(db, "users", userId, listKey, gameSlug);
  await deleteDoc(itemRef);
}

export async function fetchListGamesForUser(userId, listKey) {
  const slugs = await fetchListSlugs(userId, listKey);

  if (!slugs.length) {
    return [];
  }

  let averageRatings = {};

  try {
    averageRatings = await fetchAverageRatingsBySlug();
  } catch {
    averageRatings = {};
  }

  return slugs
    .map((slug) => {
      const game = games.find((entry) => entry.slug === slug);

      if (!game) {
        return null;
      }

      return {
        slug: game.slug,
        title: game.title,
        coverImage: game.coverImage,
        genres: game.genres,
        rating: formatClubGameRating(averageRatings[game.slug]),
      };
    })
    .filter(Boolean);
}
