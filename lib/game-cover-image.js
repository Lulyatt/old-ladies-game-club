import { games } from "@/data/games";
import { getSteamGame } from "@/lib/steam";

export async function getGameCoverImage(slug) {
  const game = games.find((entry) => entry.slug === slug);

  if (!game) {
    return null;
  }

  if (!game.steamAppId) {
    return game.coverImage;
  }

  const steam = await getSteamGame(game.steamAppId);

  return steam?.header_image ?? game.coverImage;
}
