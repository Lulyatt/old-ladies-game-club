function toDate(value) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return new Date(value);
  }

  if (typeof value.toDate === "function") {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  return null;
}

export function formatForumDate(value) {
  const date = toDate(value);

  if (!date || Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
