const FEED_LIKED_KEY = "client-feed-liked";
const FEED_SAVED_KEY = "client-feed-saved";

export function readFeedReactionMap(key: "liked" | "saved") {
  if (typeof window === "undefined") return {};

  const storageKey = key === "liked" ? FEED_LIKED_KEY : FEED_SAVED_KEY;
  const storedValue = window.localStorage.getItem(storageKey);

  if (!storedValue) return {};

  try {
    return JSON.parse(storedValue) as Record<string, boolean>;
  } catch {
    return {};
  }
}

export function writeFeedReactionMap(
  key: "liked" | "saved",
  value: Record<string, boolean>,
) {
  if (typeof window === "undefined") return;

  const storageKey = key === "liked" ? FEED_LIKED_KEY : FEED_SAVED_KEY;
  window.localStorage.setItem(storageKey, JSON.stringify(value));
}
