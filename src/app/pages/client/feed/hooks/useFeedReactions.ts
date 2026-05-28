import { useCallback, useState } from "react";

import { readFeedReactionMap, writeFeedReactionMap } from "../storage";

export function useFeedReactions() {
  const [liked, setLiked] = useState<Record<string, boolean>>(() =>
    readFeedReactionMap("liked"),
  );
  const [saved, setSaved] = useState<Record<string, boolean>>(() =>
    readFeedReactionMap("saved"),
  );

  const persistLiked = useCallback((value: Record<string, boolean>) => {
    writeFeedReactionMap("liked", value);
    return value;
  }, []);

  const persistSaved = useCallback((value: Record<string, boolean>) => {
    writeFeedReactionMap("saved", value);
    return value;
  }, []);

  const toggleLikedAndPersist = useCallback(
    (experienceId: string) => {
      setLiked((current) =>
        persistLiked({
          ...current,
          [experienceId]: !current[experienceId],
        }),
      );
    },
    [persistLiked],
  );

  const toggleSavedAndPersist = useCallback(
    (experienceId: string) => {
      setSaved((current) =>
        persistSaved({
          ...current,
          [experienceId]: !current[experienceId],
        }),
      );
    },
    [persistSaved],
  );

  return {
    liked,
    saved,
    toggleLiked: toggleLikedAndPersist,
    toggleSaved: toggleSavedAndPersist,
  };
}
