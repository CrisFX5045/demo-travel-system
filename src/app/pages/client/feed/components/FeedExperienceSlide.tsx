import { PlayIcon } from "@heroicons/react/24/outline";
import { forwardRef, useState } from "react";

import type { Experience } from "@/app/data/tourism";

import { FeedActions } from "./FeedActions";
import { FeedCta } from "./FeedCta";
import { FeedExperienceInfo } from "./FeedExperienceInfo";
import { FeedExperienceMedia } from "./FeedExperienceMedia";

type FeedExperienceSlideProps = {
  experience: Experience;
  isActive: boolean;
  isLiked: boolean;
  isSaved: boolean;
  onToggleLiked: () => void;
  onToggleSaved: () => void;
};

export const FeedExperienceSlide = forwardRef<HTMLElement, FeedExperienceSlideProps>(
function FeedExperienceSlide(
  {
    experience,
    isActive,
    isLiked,
    isSaved,
    onToggleLiked,
    onToggleSaved,
  },
  ref,
) {
  const [imageStatus, setImageStatus] = useState({ current: 1, total: 1 });
  const showImageCounter = !experience.video && imageStatus.total > 1;

  return (
    <article
      ref={ref}
      data-feed-id={experience.id}
      className="relative h-svh w-full snap-start snap-always overflow-visible bg-gray-950 lg:overflow-visible"
    >
      <FeedExperienceMedia
        experience={experience}
        isActive={isActive}
        onImageStatusChange={setImageStatus}
      />

      {experience.video && (
        <button className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/15">
          <PlayIcon className="ml-1 size-8 fill-white" />
        </button>
      )}

      <FeedActions
        experience={experience}
        isLiked={isLiked}
        isSaved={isSaved}
        onToggleLiked={onToggleLiked}
        onToggleSaved={onToggleSaved}
      />

      {showImageCounter && (
        <div className="pointer-events-none absolute right-4 top-[calc(0.95rem+env(safe-area-inset-top))] z-40 rounded-full bg-black/35 px-3 py-1 text-xs font-extrabold text-white">
          {imageStatus.current}/{imageStatus.total}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-[calc(1.1rem+env(safe-area-inset-bottom))]">
        <FeedExperienceInfo experience={experience} />
        <FeedCta experienceId={experience.id} />
      </div>
    </article>
  );
});
