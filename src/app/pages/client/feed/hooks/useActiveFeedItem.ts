import { useCallback, useEffect, useRef, useState } from "react";

export function useActiveFeedItem<T extends HTMLElement>() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const itemRefs = useRef(new Map<string, T>());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (activeEntry?.target instanceof HTMLElement) {
          setActiveId(activeEntry.target.dataset.feedId ?? null);
        }
      },
      {
        threshold: [0.55, 0.7, 0.85],
      },
    );

    itemRefs.current.forEach((element) => observerRef.current?.observe(element));

    return () => observerRef.current?.disconnect();
  }, []);

  const registerItem = useCallback((id: string) => (element: T | null) => {
    if (element) {
      itemRefs.current.set(id, element);
      observerRef.current?.observe(element);
      return;
    }

    const previousElement = itemRefs.current.get(id);
    if (previousElement) observerRef.current?.unobserve(previousElement);
    itemRefs.current.delete(id);
  }, []);

  return { activeId, registerItem };
}
