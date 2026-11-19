import {
  USER_GAME_LISTS,
  addGameToList,
  fetchListGamesForUser,
  fetchListSlugs,
  isGameInList,
  removeGameFromList,
} from "@/lib/user-game-lists";

const LIST_KEY = USER_GAME_LISTS.playQueue;

export async function fetchPlayQueueSlugs(userId) {
  return fetchListSlugs(userId, LIST_KEY);
}

export async function isGameInPlayQueue(userId, gameSlug) {
  return isGameInList(userId, gameSlug, LIST_KEY);
}

export async function addToPlayQueue(userId, gameSlug) {
  return addGameToList(userId, gameSlug, LIST_KEY);
}

export async function removeFromPlayQueue(userId, gameSlug) {
  return removeGameFromList(userId, gameSlug, LIST_KEY);
}

export async function fetchPlayQueueGamesForUser(userId) {
  return fetchListGamesForUser(userId, LIST_KEY);
}
