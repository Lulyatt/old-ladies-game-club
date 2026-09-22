import { getAvatarById } from "@/data/avatars";
import { formatMemberSince } from "@/lib/format-member-since";

export function getUserProfile(user, { reviewCount = 0, forumPostCount = 0, avatarId = "default" } = {}) {
  const username =
    user.displayName || user.email?.split("@")[0] || "Club Member";

  const selectedAvatar = getAvatarById(avatarId);
  const avatarSrc = user.photoURL || selectedAvatar.src || null;

  return {
    username,
    avatarId,
    avatarSrc,
    avatarAlt: `${username}'s profile picture`,
    fallbackInitial: username.charAt(0).toUpperCase(),
    memberSince: formatMemberSince(user.metadata?.creationTime),
    reviewCount,
    forumPostCount,
  };
}
