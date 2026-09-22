export const avatars = [
  {
    id: "default",
    label: "Default",
    src: null,
  },
  {
    id: "lady-red",
    label: "Lady in Red",
    src: "/avatars/lady-red.png",
  },
  {
    id: "lady-blue",
    label: "Lady in Blue",
    src: "/avatars/lady-blue.png",
  },
  {
    id: "lady-green",
    label: "Lady in Green",
    src: "/avatars/lady-green.png",
  },
];

export function getAvatarById(avatarId) {
  return avatars.find((avatar) => avatar.id === avatarId) ?? avatars[0];
}
