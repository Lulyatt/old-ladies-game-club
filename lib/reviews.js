import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { games } from "@/data/games";
import {
  getAestheticsLabel,
  getValueForMoneyLabel,
  isValidAesthetics,
  isValidValueForMoney,
} from "@/lib/review-extra-ratings";
import { db } from "@/lib/firebase";

export function formatScoreNumber(score) {
  const value = Number(score);

  if (Number.isNaN(value)) {
    return null;
  }

  const oneDecimal = Math.round(value * 10) / 10;

  if (Number.isInteger(oneDecimal)) {
    return String(oneDecimal);
  }

  return oneDecimal.toFixed(1);
}

export function formatReviewScore(score) {
  const formatted = formatScoreNumber(score);

  if (!formatted) {
    return "—";
  }

  return `⭐ ${formatted} / 5`;
}

export function formatClubGameRating({ average, count } = {}) {
  if (!count) {
    return "No club reviews yet";
  }

  const formatted = formatScoreNumber(average);

  return `⭐ ${formatted} / 5`;
}

export async function fetchAverageRatingsBySlug() {
  const snapshot = await getDocs(collection(db, "reviews"));
  const totals = {};

  snapshot.forEach((entry) => {
    const data = entry.data();
    const gameSlug = data.gameSlug;
    const score = Number(data.score);

    if (!gameSlug || Number.isNaN(score)) {
      return;
    }

    if (!totals[gameSlug]) {
      totals[gameSlug] = { sum: 0, count: 0 };
    }

    totals[gameSlug].sum += score;
    totals[gameSlug].count += 1;
  });

  const averages = {};

  for (const [gameSlug, { sum, count }] of Object.entries(totals)) {
    averages[gameSlug] = {
      average: sum / count,
      count,
    };
  }

  return averages;
}

export async function fetchAverageRatingForGame(gameSlug) {
  const reviewsQuery = query(
    collection(db, "reviews"),
    where("gameSlug", "==", gameSlug),
  );
  const snapshot = await getDocs(reviewsQuery);
  let sum = 0;
  let count = 0;

  snapshot.forEach((entry) => {
    const score = Number(entry.data().score);

    if (Number.isNaN(score)) {
      return;
    }

    sum += score;
    count += 1;
  });

  if (!count) {
    return null;
  }

  return { average: sum / count, count };
}

export function getReviewDocId(userId, gameSlug) {
  return `${userId}_${gameSlug}`;
}

export function mapReviewToCard(id, data) {
  const staticGame = games.find((entry) => entry.slug === data.gameSlug);

  return {
    id,
    reviewText: data.reviewText ?? "",
    score: formatReviewScore(data.score),
    aesthetics: data.aesthetics ?? null,
    aestheticsLabel: getAestheticsLabel(data.aesthetics),
    valueForMoney: data.valueForMoney ?? null,
    valueForMoneyLabel: getValueForMoneyLabel(data.valueForMoney),
    username: data.username ?? "Club Member",
    game: {
      slug: data.gameSlug,
      title: data.gameTitle ?? staticGame?.title ?? data.gameSlug,
      coverImage: data.coverImage || staticGame?.coverImage || "",
    },
  };
}

export async function fetchReviewsByGameSlug(gameSlug) {
  const reviewsQuery = query(
    collection(db, "reviews"),
    where("gameSlug", "==", gameSlug),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(reviewsQuery);
  return snapshot.docs.map((entry) => mapReviewToCard(entry.id, entry.data()));
}

export async function fetchReviewsByUserId(userId) {
  const reviewsQuery = query(
    collection(db, "reviews"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(reviewsQuery);
  return snapshot.docs.map((entry) => mapReviewToCard(entry.id, entry.data()));
}

export async function fetchUserReviewForGame(userId, gameSlug) {
  const reviewRef = doc(db, "reviews", getReviewDocId(userId, gameSlug));
  const snapshot = await getDoc(reviewRef);

  if (!snapshot.exists()) {
    return null;
  }

  return { id: snapshot.id, ...snapshot.data() };
}

export async function saveReview({
  user,
  username,
  game,
  reviewText,
  score,
  aesthetics,
  valueForMoney,
}) {
  const trimmedText = reviewText.trim();

  if (!trimmedText) {
    throw new Error("Please write a review before submitting.");
  }

  const numericScore = Number(score);
  if (Number.isNaN(numericScore) || numericScore < 1 || numericScore > 5) {
    throw new Error("Please choose a score between 1 and 5.");
  }

  if (!isValidAesthetics(aesthetics)) {
    throw new Error("Please choose an aesthetics rating.");
  }

  if (!isValidValueForMoney(valueForMoney)) {
    throw new Error("Please choose a value for money rating.");
  }

  const reviewRef = doc(db, "reviews", getReviewDocId(user.uid, game.slug));
  const existing = await getDoc(reviewRef);
  const isNew = !existing.exists();

  await setDoc(reviewRef, {
    userId: user.uid,
    username,
    gameSlug: game.slug,
    gameTitle: game.title,
    coverImage: game.coverImage,
    reviewText: trimmedText,
    score: numericScore,
    aesthetics,
    valueForMoney,
    createdAt: isNew ? serverTimestamp() : existing.data().createdAt,
    updatedAt: serverTimestamp(),
  });
}
