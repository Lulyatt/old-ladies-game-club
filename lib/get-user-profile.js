import { getAvatarById } from "@/data/avatars";
import { formatMemberSince } from "@/lib/format-member-since";

export function getUserProfile(
  user,
  { firestoreProfile = null, reviewCount = 0, forumPostCount = 0 } = {}
) {
  const avatarId = firestoreProfile?.avatarId ?? "default";
  const username =
    firestoreProfile?.username ||
    user.displayName ||
    user.email?.split("@")[0] ||
    "Club Member";

  const selectedAvatar = getAvatarById(avatarId);
  const avatarSrc = user.photoURL || selectedAvatar.src || null;

  const memberSince = firestoreProfile?.createdAt
    ? formatMemberSince(firestoreProfile.createdAt)
    : formatMemberSince(user.metadata?.creationTime);

  return {
    username,
    avatarId,
    avatarSrc,
    avatarAlt: `${username}'s profile picture`,
    fallbackInitial: username.charAt(0).toUpperCase(),
    memberSince,
    reviewCount,
    forumPostCount,
  };
}
