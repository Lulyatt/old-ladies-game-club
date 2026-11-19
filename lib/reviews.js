import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { getAvatarById } from "@/data/avatars";
import { games } from "@/data/games";
import {
  getAestheticsLabel,
  getValueForMoneyLabel,
  isValidAesthetics,
  isValidValueForMoney,
} from "@/lib/review-extra-ratings";
import { getGameCoverImage } from "@/lib/game-cover-image";
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

export function formatReviewCount(count) {
  const value = Number(count) || 0;

  if (value === 1) {
    return "1 review";
  }

  return `${value} reviews`;
}

function getCreatedAtMillis(createdAt) {
  if (!createdAt) {
    return 0;
  }

  if (typeof createdAt.toMillis === "function") {
    return createdAt.toMillis();
  }

  if (typeof createdAt === "object" && createdAt.seconds != null) {
    return createdAt.seconds * 1000;
  }

  const parsed = Date.parse(createdAt);

  return Number.isNaN(parsed) ? 0 : parsed;
}

export function sortReviewsByLikes(reviews) {
  return [...reviews].sort((a, b) => {
    const likeDiff = (b.likeCount ?? 0) - (a.likeCount ?? 0);

    if (likeDiff !== 0) {
      return likeDiff;
    }

    const timeDiff = (b.createdAtMs ?? 0) - (a.createdAtMs ?? 0);

    if (timeDiff !== 0) {
      return timeDiff;
    }

    return a.id.localeCompare(b.id);
  });
}

export async function fetchReviewedGamesSummary() {
  let averages = {};

  try {
    averages = await fetchAverageRatingsBySlug();
  } catch {
    return [];
  }

  const entries = await Promise.all(
    Object.entries(averages)
      .filter(([, stats]) => stats.count > 0)
      .map(async ([slug, stats]) => {
        const game = games.find((entry) => entry.slug === slug);

        if (!game) {
          return null;
        }

        const coverImage = (await getGameCoverImage(slug)) ?? game.coverImage;

        return {
          slug: game.slug,
          title: game.title,
          coverImage,
          rating: formatClubGameRating(stats),
          reviewCount: stats.count,
        };
      }),
  );

  return entries
    .filter(Boolean)
    .sort((a, b) => a.title.localeCompare(b.title));
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

function mapReviewAuthor(data) {
  const username = data.username ?? "Club Member";
  const avatarId = data.avatarId ?? "default";
  const avatar = getAvatarById(avatarId);
  const avatarSrc = data.authorPhotoURL || avatar.src || null;

  return {
    avatarSrc,
    avatarAlt: `${username}'s profile picture`,
    fallbackInitial: username.charAt(0).toUpperCase(),
  };
}

export function mapReviewToCard(id, data) {
  const staticGame = games.find((entry) => entry.slug === data.gameSlug);
  const username = data.username ?? "Club Member";

  return {
    id,
    likeCount: data.likeCount ?? 0,
    createdAtMs: getCreatedAtMillis(data.createdAt),
    reviewText: data.reviewText ?? "",
    score: formatReviewScore(data.score),
    aesthetics: data.aesthetics ?? null,
    aestheticsLabel: getAestheticsLabel(data.aesthetics),
    valueForMoney: data.valueForMoney ?? null,
    valueForMoneyLabel: getValueForMoneyLabel(data.valueForMoney),
    username,
    author: mapReviewAuthor(data),
    game: {
      slug: data.gameSlug,
      title: data.gameTitle ?? staticGame?.title ?? data.gameSlug,
      coverImage: data.coverImage || staticGame?.coverImage || "",
    },
  };
}

async function resolveReviewListCoverImage(gameSlug, coverImageOverride) {
  if (coverImageOverride) {
    return coverImageOverride;
  }

  if (typeof window === "undefined") {
    return getGameCoverImage(gameSlug);
  }

  const game = games.find((entry) => entry.slug === gameSlug);

  return game?.coverImage ?? null;
}

export async function fetchReviewsByGameSlug(
  gameSlug,
  { coverImage: coverImageOverride } = {},
) {
  const reviewsQuery = query(
    collection(db, "reviews"),
    where("gameSlug", "==", gameSlug),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(reviewsQuery);
  const cards = snapshot.docs.map((entry) =>
    mapReviewToCard(entry.id, entry.data()),
  );
  const coverImage = await resolveReviewListCoverImage(
    gameSlug,
    coverImageOverride,
  );

  if (!coverImage) {
    return cards;
  }

  return cards.map((review) => ({
    ...review,
    game: {
      ...review.game,
      coverImage,
    },
  }));
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
  avatarId,
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
    avatarId: avatarId ?? "default",
    authorPhotoURL: user.photoURL || "",
    gameSlug: game.slug,
    gameTitle: game.title,
    coverImage: game.coverImage,
    reviewText: trimmedText,
    score: numericScore,
    aesthetics,
    valueForMoney,
    likeCount: isNew ? 0 : (existing.data().likeCount ?? 0),
    createdAt: isNew ? serverTimestamp() : existing.data().createdAt,
    updatedAt: serverTimestamp(),
  });
}

export async function fetchReviewAgreeState(userId, reviewIds = []) {
  if (!userId || !reviewIds.length) {
    return {};
  }

  const agreed = {};

  await Promise.all(
    reviewIds.map(async (reviewId) => {
      const agreeRef = doc(db, "reviews", reviewId, "agrees", userId);
      const snapshot = await getDoc(agreeRef);
      agreed[reviewId] = snapshot.exists();
    }),
  );

  return agreed;
}

export async function toggleReviewAgree({ user, reviewId }) {
  if (!user?.uid) {
    throw new Error("You must be logged in to agree with a review.");
  }

  const reviewRef = doc(db, "reviews", reviewId);
  const agreeRef = doc(db, "reviews", reviewId, "agrees", user.uid);

  const agreed = await runTransaction(db, async (transaction) => {
    const reviewSnapshot = await transaction.get(reviewRef);

    if (!reviewSnapshot.exists()) {
      throw new Error("This review no longer exists.");
    }

    const agreeSnapshot = await transaction.get(agreeRef);

    if (agreeSnapshot.exists()) {
      transaction.delete(agreeRef);
      transaction.update(reviewRef, { likeCount: increment(-1) });
      return false;
    }

    transaction.set(agreeRef, { createdAt: serverTimestamp() });
    transaction.update(reviewRef, { likeCount: increment(1) });
    return true;
  });

  const updatedReview = await getDoc(reviewRef);
  const likeCount = updatedReview.data()?.likeCount ?? 0;

  return { agreed, likeCount };
}
