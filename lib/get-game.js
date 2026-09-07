import { games } from "@/data/games";
import { getSteamGame } from "@/lib/steam";

function uniqueLabels(items) {
  return [...new Set(items)];
}

async function getDlcEntries(dlcIds) {
  if (!dlcIds?.length) return [];

  return Promise.all(
    dlcIds.map(async (id) => {
      const data = await getSteamGame(id);

      return {
        id,
        name: data?.name ?? `DLC (${id})`,
        price: data?.price_overview?.final_formatted ?? null,
        url: `https://store.steampowered.com/app/${id}`,
      };
    })
  );
}

export async function getAllGames() {
  return Promise.all(
    games.map(async (game) => {
      const steam = game.steamAppId
        ? await getSteamGame(game.steamAppId)
        : null;

      return {
        slug: game.slug,
        title: game.title,
        rating: game.rating,
        coverImage: steam?.header_image ?? game.coverImage,
        description: steam?.short_description ?? game.description,
        developers: steam?.developers ?? [],
        releaseDate: steam?.release_date?.coming_soon
          ? "Coming soon"
          : (steam?.release_date?.date ?? null),
        genres: uniqueLabels(
          steam?.genres?.map((g) => g.description) ?? game.genres
        ),
        categories: uniqueLabels(
          steam?.categories?.map((c) => c.description) ?? []
        ),
      };
    })
  );
}

export async function getGameBySlug(slug) {
  const game = games.find((g) => g.slug === slug);
  if (!game) return null;

  const steam = game.steamAppId
    ? await getSteamGame(game.steamAppId)
    : null;

  const dlc = steam?.dlc ? await getDlcEntries(steam.dlc) : [];

  return {
    ...game,
    description: steam?.short_description ?? game.description,
    coverImage: steam?.header_image ?? game.coverImage,
    steamStoreUrl: game.steamAppId
      ? `https://store.steampowered.com/app/${game.steamAppId}`
      : null,
    developers: steam?.developers ?? [],
    publishers: steam?.publishers ?? [],
    releaseDate: steam?.release_date?.coming_soon
      ? "Coming soon"
      : (steam?.release_date?.date ?? null),
    genres: uniqueLabels(
      steam?.genres?.map((g) => g.description) ?? game.genres
    ),
    categories: uniqueLabels(
      steam?.categories?.map((c) => c.description) ?? []
    ),
    platforms: steam?.platforms ?? null,
    website: steam?.website ?? null,
    screenshots: steam?.screenshots ?? [],
    movies: steam?.movies ?? [],
    supportedLanguages: steam?.supported_languages ?? null,
    controllerSupport: steam?.controller_support ?? null,
    pcRequirements: steam?.pc_requirements ?? null,
    dlc,
  };
}
