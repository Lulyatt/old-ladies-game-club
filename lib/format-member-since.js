export function formatMemberSince(creationTime) {
  if (!creationTime) return "—";

  const created = new Date(creationTime);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();

  if (diffMs < 0) return "—";

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days < 1) return "Today";
  if (days < 30) return `${days} day${days === 1 ? "" : "s"}`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"}`;

  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"}`;
}
