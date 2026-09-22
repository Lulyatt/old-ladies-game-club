import { games } from "@/data/games";
import { userReviews } from "@/data/user-reviews";

export function getUserReviews() {
  return userReviews
    .map((review) => {
      const game = games.find((entry) => entry.slug === review.gameSlug);
      if (!game) return null;

      return {
        ...review,
        game,
      };
    })
    .filter(Boolean);
}
