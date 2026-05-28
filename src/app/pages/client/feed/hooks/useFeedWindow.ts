import { useCallback, useRef, useState } from "react";

import { experiences } from "@/app/data/tourism";
import type { Experience } from "@/app/data/tourism";

const PAGE_SIZE = 7;
const PREFETCH_REMAINING_ITEMS = 2;
const MAX_ITEMS_IN_MEMORY = 21;
const TRIM_BATCH_SIZE = 7;

type FeedPage = {
  items: Experience[];
  nextCursor: number | null;
};

function fetchFeedPage(cursor: number): FeedPage {
  const items = experiences.slice(cursor, cursor + PAGE_SIZE);
  const nextCursor =
    cursor + PAGE_SIZE < experiences.length ? cursor + PAGE_SIZE : null;

  return { items, nextCursor };
}

function getInitialCursor(initialExperienceId?: string | null) {
  if (!initialExperienceId) return 0;

  const experienceIndex = experiences.findIndex(
    (experience) => experience.id === initialExperienceId,
  );

  if (experienceIndex < 0) return 0;

  return Math.floor(experienceIndex / PAGE_SIZE) * PAGE_SIZE;
}

export function useFeedWindow(initialExperienceId?: string | null) {
  const initialCursor = getInitialCursor(initialExperienceId);
  const initialFeedPage = fetchFeedPage(initialCursor);
  const [feedItems, setFeedItems] = useState(initialFeedPage.items);
  const [nextCursor, setNextCursor] = useState(initialFeedPage.nextCursor);
  const [trimmedBefore, setTrimmedBefore] = useState(initialCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isLoadingRef = useRef(false);

  const loadNextPage = useCallback(() => {
    if (isLoadingRef.current || nextCursor === null) return;

    isLoadingRef.current = true;
    setIsLoadingMore(true);

    const page = fetchFeedPage(nextCursor);
    const shouldTrim =
      feedItems.length + page.items.length > MAX_ITEMS_IN_MEMORY;

    setFeedItems((currentItems) => {
      const nextItems = [...currentItems, ...page.items];

      return shouldTrim ? nextItems.slice(TRIM_BATCH_SIZE) : nextItems;
    });
    if (shouldTrim) {
      setTrimmedBefore((current) => current + TRIM_BATCH_SIZE);
    }
    setNextCursor(page.nextCursor);
    setIsLoadingMore(false);
    isLoadingRef.current = false;
  }, [feedItems.length, nextCursor]);

  const handleActiveIndexChange = useCallback(
    (activeIndex: number) => {
      const localActiveIndex = activeIndex - trimmedBefore;
      const remainingItems = feedItems.length - localActiveIndex - 1;

      if (remainingItems <= PREFETCH_REMAINING_ITEMS) {
        loadNextPage();
      }
    },
    [feedItems.length, loadNextPage, trimmedBefore],
  );

  return {
    feedItems,
    isLoadingMore,
    trimmedBefore,
    handleActiveIndexChange,
  };
}
