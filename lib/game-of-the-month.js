import { doc, getDoc } from "firebase/firestore";
import { getGameBySlug } from "@/lib/get-game";
import { db } from "@/lib/firebase";

const settingsDocRef = doc(db, "settings", "gameOfTheMonth");

export async function fetchGameOfTheMonthConfig() {
  const snapshot = await getDoc(settingsDocRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  const rawSlug = data.gameSlug ?? data.gameslug;
  const gameSlug = typeof rawSlug === "string" ? rawSlug.trim() : "";

  if (!gameSlug) {
    return null;
  }

  const monthLabel =
    typeof data.monthLabel === "string" ? data.monthLabel.trim() : "";

  return {
    gameSlug,
    monthLabel: monthLabel || null,
  };
}

export async function fetchGameOfTheMonth() {
  let config;

  try {
    config = await fetchGameOfTheMonthConfig();
  } catch {
    return null;
  }

  if (!config) {
    return null;
  }

  let game;

  try {
    game = await getGameBySlug(config.gameSlug);
  } catch {
    return null;
  }

  if (!game) {
    return null;
  }

  return {
    slug: game.slug,
    title: game.title,
    description: game.description,
    genres: game.genres,
    rating: game.rating,
    coverImage: game.coverImage,
    month: config.monthLabel,
  };
}
