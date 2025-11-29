export function formatTime(timestamp) {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
export function formatDateTime(dateObject) {
  if (!dateObject) return "";

  const optionsDate = { month: "short", day: "numeric", year: "numeric" };
  const datePart = dateObject.toLocaleDateString(undefined, optionsDate);

  const optionsTime = { hour: "2-digit", minute: "2-digit", hour12: true };
  const timePart = dateObject.toLocaleTimeString(undefined, optionsTime);

  return `${datePart}, ${timePart}`;
}
