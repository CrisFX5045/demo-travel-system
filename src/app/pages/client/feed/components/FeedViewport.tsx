import { useEffect, useRef } from "react";

import type { Experience } from "@/app/data/tourism";

import { useClientI18n } from "../../i18n";
import { useActiveFeedItem } from "../hooks/useActiveFeedItem";
import { FeedExperienceSlide } from "./FeedExperienceSlide";

type FeedViewportProps = {
  experiences: Experience[];
  isLoadingMore: boolean;
  initialExperienceId?: string | null;
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
  trimmedBefore: number;
  onActiveIndexChange: (activeIndex: number) => void;
  onToggleLiked: (experienceId: string) => void;
  onToggleSaved: (experienceId: string) => void;
};

export function FeedViewport({
  experiences,
  isLoadingMore,
  initialExperienceId,
  liked,
  saved,
  trimmedBefore,
  onActiveIndexChange,
  onToggleLiked,
  onToggleSaved,
}: FeedViewportProps) {
  const { t } = useClientI18n();
  const { activeId, registerItem } = useActiveFeedItem<HTMLElement>();
  const viewportRef = useRef<HTMLElement | null>(null);
  const hasRestoredInitialItem = useRef(false);
  const currentActiveId = activeId ?? experiences[0]?.id ?? null;
  const activeIndex = experiences.findIndex(
    (experience) => experience.id === currentActiveId,
  );

  useEffect(() => {
    if (activeIndex >= 0) {
      onActiveIndexChange(trimmedBefore + activeIndex);
    }
  }, [activeIndex, onActiveIndexChange, trimmedBefore]);

  useEffect(() => {
    if (!initialExperienceId || hasRestoredInitialItem.current) return;

    const targetElement = viewportRef.current?.querySelector(
      `[data-feed-id="${CSS.escape(initialExperienceId)}"]`,
    );

    if (!(targetElement instanceof HTMLElement)) return;

    hasRestoredInitialItem.current = true;
    targetElement.scrollIntoView({ block: "start" });
  }, [experiences, initialExperienceId]);

  return (
    <section
      ref={viewportRef}
      className="mx-auto h-svh w-full snap-y snap-mandatory overflow-y-auto overflow-x-hidden [scrollbar-width:none] lg:max-w-[38rem] lg:border-x lg:border-white/10 [&::-webkit-scrollbar]:hidden"
    >
      {trimmedBefore > 0 && (
        <div
          aria-hidden="true"
          style={{ height: `${trimmedBefore * 100}svh` }}
        />
      )}
      {experiences.map((experience) => (
        <FeedExperienceSlide
          key={experience.id}
          ref={registerItem(experience.id)}
          experience={experience}
          isActive={currentActiveId === experience.id}
          isLiked={Boolean(liked[experience.id])}
          isSaved={Boolean(saved[experience.id])}
          onToggleLiked={() => onToggleLiked(experience.id)}
          onToggleSaved={() => onToggleSaved(experience.id)}
        />
      ))}
      {!experiences.length && !isLoadingMore && (
        <div className="grid h-svh snap-start place-items-center bg-gray-950 px-8 text-center text-white">
          <div>
            <p className="text-lg font-extrabold">{t("noResults")}</p>
            <p className="mt-2 text-sm font-bold text-white/60">
              {t("noResultsHint")}
            </p>
          </div>
        </div>
      )}
      {isLoadingMore && (
        <div className="grid h-svh snap-start place-items-center bg-gray-50 text-sm font-bold text-gray-500">
          {t("loadingExperiences")}
        </div>
      )}
    </section>
  );
}
