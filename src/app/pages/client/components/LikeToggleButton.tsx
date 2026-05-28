import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export function LikeToggleButton({
  isLiked,
  onToggleLiked,
  className = "",
  iconClassName = "",
}: {
  isLiked: boolean;
  onToggleLiked: () => void;
  className?: string;
  iconClassName?: string;
}) {
  const [pulseKey, setPulseKey] = useState(0);
  const HeartIcon = isLiked ? HeartSolidIcon : HeartOutlineIcon;

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setPulseKey((current) => current + 1);
          onToggleLiked();
        }}
        className={`grid size-9 place-items-center rounded-full shadow-sm transition-transform duration-100 active:scale-[0.98] ${className}`}
        aria-label={isLiked ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        <HeartIcon
          key={pulseKey}
          className={`size-6 transition-colors [animation:client-like-pop_260ms_cubic-bezier(.22,1,.36,1)_both] ${
            isLiked ? "text-rose-600" : ""
          } ${iconClassName}`}
        />
      </button>
      <style>
        {`
          @keyframes client-like-pop {
            0% { transform: scale(0.92); }
            55% { transform: scale(1.12); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </>
  );
}
