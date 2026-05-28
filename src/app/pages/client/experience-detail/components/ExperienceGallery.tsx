import {
  ArrowsPointingOutIcon,
  BookmarkIcon as BookmarkOutlineIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon as HeartOutlineIcon,
  ShareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  BookmarkIcon as BookmarkSolidIcon,
  HeartIcon as HeartSolidIcon,
} from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import type { ElementType } from "react";

import { useClientI18n } from "../../i18n";

export function ExperienceGallery({
  images,
  title,
  isLiked,
  isSaved,
  onToggleLiked,
  onToggleSaved,
  onShare,
}: {
  images: string[];
  title: string;
  isLiked: boolean;
  isSaved: boolean;
  onToggleLiked: () => void;
  onToggleSaved: () => void;
  onShare: () => void;
}) {
  const { t } = useClientI18n();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const hasDragged = useRef(false);
  const hasMultipleImages = images.length > 1;
  const slideWidth = `${100 / images.length}%`;

  const goToImage = (direction: "previous" | "next") => {
    setActiveIndex((current) => {
      if (direction === "previous") {
        return current === 0 ? images.length - 1 : current - 1;
      }

      return current === images.length - 1 ? 0 : current + 1;
    });
  };

  const handleTouchEnd = (positionX: number) => {
    if (!hasMultipleImages || touchStartX.current === null) return;

    const dragDistance = touchStartX.current - positionX;
    touchStartX.current = null;

    if (Math.abs(dragDistance) < 42) return;

    hasDragged.current = true;
    goToImage(dragDistance > 0 ? "next" : "previous");
  };

  const openExpandedGallery = () => {
    if (hasDragged.current) {
      hasDragged.current = false;
      return;
    }

    setIsExpanded(true);
  };

  return (
    <>
      <div
        className="relative h-[66svh] min-h-[32rem] touch-pan-y md:h-[74vh]"
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
          hasDragged.current = false;
        }}
        onTouchEnd={(event) => {
          handleTouchEnd(event.changedTouches[0]?.clientX ?? 0);
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="flex h-full shrink-0 transition-transform duration-500 ease-out"
            style={{
              width: `${images.length * 100}%`,
              transform: `translate3d(-${
                activeIndex * (100 / images.length)
              }%, 0, 0)`,
            }}
          >
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={openExpandedGallery}
                className="h-full shrink-0 cursor-zoom-in overflow-hidden"
                style={{ width: slideWidth }}
                aria-label={t("expandGallery")}
              >
                <img
                  src={image}
                  alt={index === activeIndex ? title : ""}
                  className="h-full w-full object-cover [animation:client-experience-hero-in_850ms_cubic-bezier(.22,1,.36,1)_both]"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35" />

        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={() => goToImage("previous")}
              className="absolute left-3 top-1/2 z-20 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 active:scale-90 md:grid"
              aria-label={t("previousImage")}
            >
              <ChevronLeftIcon className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => goToImage("next")}
              className="absolute right-3 top-1/2 z-20 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 active:scale-90 md:grid"
              aria-label={t("nextImage")}
            >
              <ChevronRightIcon className="size-6" />
            </button>
          </>
        )}

        <div className="absolute right-4 top-[calc(1rem+env(safe-area-inset-top))] z-20 flex gap-2 md:right-8">
          <GalleryAction
            icon={ArrowsPointingOutIcon}
            label={t("expandGallery")}
            onClick={() => setIsExpanded(true)}
          />
          <GalleryAction
            icon={HeartOutlineIcon}
            activeIcon={HeartSolidIcon}
            isActive={isLiked}
            activeClassName="text-rose-600"
            label={t("like")}
            onClick={onToggleLiked}
          />
          <GalleryAction
            icon={BookmarkOutlineIcon}
            activeIcon={BookmarkSolidIcon}
            isActive={isSaved}
            activeClassName="text-yellow-400"
            label={t("save")}
            onClick={onToggleSaved}
          />
          <GalleryAction icon={ShareIcon} label={t("share")} onClick={onShare} />
        </div>

        {hasMultipleImages && (
          <div className="absolute bottom-4 right-4 z-20 rounded-full bg-black/45 px-3 py-1 text-xs font-extrabold text-white backdrop-blur md:right-8">
            {activeIndex + 1}/{images.length}
          </div>
        )}

        {hasMultipleImages && (
          <div className="absolute bottom-4 left-4 z-20 hidden max-w-lg gap-2 md:left-8">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-16 w-24 overflow-hidden rounded-xl border-2 transition active:scale-95 ${
                  index === activeIndex
                    ? "border-white opacity-100"
                    : "border-white/20 opacity-65"
                }`}
                aria-label={`Ver imagen ${index + 1}`}
              >
                <img src={image} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {isExpanded && (
        <ExpandedGallery
          images={images}
          title={title}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
          onClose={() => setIsExpanded(false)}
        />
      )}
    </>
  );
}

function ExpandedGallery({
  images,
  title,
  activeIndex,
  onChange,
  onClose,
}: {
  images: string[];
  title: string;
  activeIndex: number;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const { t } = useClientI18n();
  const hasMultipleImages = images.length > 1;
  const touchStartX = useRef<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const slideWidth = `${100 / images.length}%`;

  const goToImage = (direction: "previous" | "next") => {
    onChange(
      direction === "previous"
        ? activeIndex === 0
          ? images.length - 1
          : activeIndex - 1
        : activeIndex === images.length - 1
          ? 0
          : activeIndex + 1,
    );
  };

  const handleTouchEnd = (positionX: number) => {
    if (!hasMultipleImages || touchStartX.current === null) return;

    const dragDistance = touchStartX.current - positionX;
    touchStartX.current = null;

    if (Math.abs(dragDistance) < 42) return;

    goToImage(dragDistance > 0 ? "next" : "previous");
  };

  const closeGallery = () => {
    setIsClosing(true);
    window.setTimeout(onClose, 220);
  };

  return (
    <div
      data-expanded-gallery
      className={`fixed inset-0 z-50 touch-pan-y bg-black text-white ${
        isClosing
          ? "[animation:client-expanded-gallery-out_220ms_ease-in_both]"
          : "[animation:client-expanded-gallery-in_260ms_ease-out_both]"
      }`}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        handleTouchEnd(event.changedTouches[0]?.clientX ?? 0);
      }}
    >
      <button
        type="button"
        onClick={closeGallery}
        className="absolute right-4 top-[calc(1rem+env(safe-area-inset-top))] z-20 grid size-11 place-items-center rounded-full bg-white/10 backdrop-blur transition hover:bg-white/20 active:scale-90"
        aria-label={t("closeGallery")}
      >
        <XMarkIcon className="size-6" />
      </button>

      <div className="absolute left-4 top-[calc(1rem+env(safe-area-inset-top))] z-20 rounded-full bg-white/10 px-3 py-2 text-xs font-extrabold backdrop-blur">
        {activeIndex + 1}/{images.length}
      </div>

      <div className="flex h-full overflow-hidden">
        <div
          className="flex h-full shrink-0 transition-transform duration-500 ease-out"
          style={{
            width: `${images.length * 100}%`,
            transform: `translate3d(-${
              activeIndex * (100 / images.length)
            }%, 0, 0)`,
          }}
        >
          {images.map((image, index) => (
            <div
              key={image}
              className="grid h-full shrink-0 place-items-center px-0 py-10 md:px-10 md:py-14"
              style={{ width: slideWidth }}
            >
              <img
                src={image}
                alt={index === activeIndex ? title : ""}
                className={`h-full w-full object-contain ${
                  index === activeIndex && !isClosing
                    ? "[animation:client-expanded-image-in_360ms_cubic-bezier(.22,1,.36,1)_both]"
                    : index === activeIndex && isClosing
                      ? "[animation:client-expanded-image-out_220ms_ease-in_both]"
                      : ""
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {hasMultipleImages && (
        <>
          <button
            type="button"
            onClick={() => goToImage("previous")}
            className="absolute left-4 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 backdrop-blur transition hover:bg-white/20 active:scale-90"
            aria-label={t("previousImage")}
          >
            <ChevronLeftIcon className="size-6" />
          </button>
          <button
            type="button"
            onClick={() => goToImage("next")}
            className="absolute right-4 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 backdrop-blur transition hover:bg-white/20 active:scale-90"
            aria-label={t("nextImage")}
          >
            <ChevronRightIcon className="size-6" />
          </button>

          <div className="absolute inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-20 flex justify-start gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:justify-center [&::-webkit-scrollbar]:hidden">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => onChange(index)}
                className={`h-14 w-20 overflow-hidden rounded-xl border-2 transition active:scale-95 md:h-16 md:w-24 ${
                  index === activeIndex
                    ? "border-white opacity-100"
                    : "border-white/20 opacity-60"
                }`}
                aria-label={`Ver imagen ${index + 1}`}
              >
                <img src={image} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function GalleryAction({
  icon: Icon,
  activeIcon: ActiveIcon,
  isActive = false,
  activeClassName = "",
  label,
  onClick,
}: {
  icon: ElementType;
  activeIcon?: ElementType;
  isActive?: boolean;
  activeClassName?: string;
  label: string;
  onClick: () => void;
}) {
  const DisplayIcon = isActive && ActiveIcon ? ActiveIcon : Icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full bg-black/35 text-white backdrop-blur transition hover:bg-black/50 active:scale-90"
      aria-label={label}
    >
      <DisplayIcon
        className={`size-6 transition-colors ${isActive ? activeClassName : ""}`}
      />
    </button>
  );
}
