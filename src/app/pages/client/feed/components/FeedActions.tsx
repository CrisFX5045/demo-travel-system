import {
  BookmarkIcon as BookmarkOutlineIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  HeartIcon as HeartOutlineIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import {
  BookmarkIcon as BookmarkSolidIcon,
  HeartIcon as HeartSolidIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

import type { Experience } from "@/app/data/tourism";

import { useClientI18n } from "../../i18n";
import { FeedActionButton } from "./FeedActionButton";
import { FeedShareSheet } from "./FeedShareSheet";

type FeedActionsProps = {
  experience: Experience;
  isLiked: boolean;
  isSaved: boolean;
  onToggleLiked: () => void;
  onToggleSaved: () => void;
};

export function FeedActions({
  experience,
  isLiked,
  isSaved,
  onToggleLiked,
  onToggleSaved,
}: FeedActionsProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const { t } = useClientI18n();

  return (
    <>
      <div className="absolute right-3 top-[32%] z-30 flex flex-col items-center gap-5 lg:right-5">
        <FeedActionButton
          icon={HeartOutlineIcon}
          activeIcon={HeartSolidIcon}
          label={experience.favorites}
          isActive={isLiked}
          activeIconClassName="text-rose-600"
          onClick={onToggleLiked}
        />
        <FeedActionButton
          icon={ChatBubbleOvalLeftEllipsisIcon}
          label={experience.reviews}
          pressable={false}
        />
        <FeedActionButton
          icon={BookmarkOutlineIcon}
          activeIcon={BookmarkSolidIcon}
          label={t("save")}
          isActive={isSaved}
          activeIconClassName="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.45)]"
          activeLabelClassName="text-yellow-300 dark:text-yellow-300"
          onClick={onToggleSaved}
        />
        <FeedActionButton
          icon={ShareIcon}
          label={t("share")}
          onClick={() => setIsShareOpen(true)}
        />
      </div>

      <FeedShareSheet
        experience={experience}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </>
  );
}
