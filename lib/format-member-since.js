function toDate(creationTime) {
  if (!creationTime) return null;

  if (typeof creationTime === "string") {
    return new Date(creationTime);
  }

  if (typeof creationTime.toDate === "function") {
    return creationTime.toDate();
  }

  if (creationTime instanceof Date) {
    return creationTime;
  }

  return null;
}

export function formatMemberSince(creationTime) {
  const created = toDate(creationTime);
  if (!created || Number.isNaN(created.getTime())) return "—";
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
