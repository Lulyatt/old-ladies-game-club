import {
  USER_GAME_LISTS,
  addGameToList,
  fetchListGamesForUser,
  fetchListSlugs,
  isGameInList,
  removeGameFromList,
} from "@/lib/user-game-lists";

const LIST_KEY = USER_GAME_LISTS.favourites;

export async function fetchFavouriteSlugs(userId) {
  return fetchListSlugs(userId, LIST_KEY);
}

export async function isGameFavourited(userId, gameSlug) {
  return isGameInList(userId, gameSlug, LIST_KEY);
}

export async function addFavourite(userId, gameSlug) {
  return addGameToList(userId, gameSlug, LIST_KEY);
}

export async function removeFavourite(userId, gameSlug) {
  return removeGameFromList(userId, gameSlug, LIST_KEY);
}

export async function fetchFavouriteGamesForUser(userId) {
  return fetchListGamesForUser(userId, LIST_KEY);
}
