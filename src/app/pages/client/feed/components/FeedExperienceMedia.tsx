import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";

import type { Experience } from "@/app/data/tourism";

export function FeedExperienceMedia({
  experience,
  isActive,
  onImageStatusChange,
}: {
  experience: Experience;
  isActive: boolean;
  onImageStatusChange?: (status: {
    current: number;
    total: number;
  }) => void;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const shouldIgnoreClick = useRef(false);
  const images = useMemo(() => {
    const mediaImages = experience.images?.length
      ? experience.images
      : [experience.image];

    return Array.from(new Set(mediaImages));
  }, [experience.image, experience.images]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [experience.id]);

  useEffect(() => {
    onImageStatusChange?.({
      current: activeImageIndex + 1,
      total: images.length,
    });
  }, [activeImageIndex, images.length, onImageStatusChange]);

  const goToPreviousImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? images.length - 1 : currentIndex - 1,
    );
  };

  const goToNextImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex + 1 >= images.length ? 0 : currentIndex + 1,
    );
  };

  const handleProgressEnd = () => {
    if (isActive && !isPaused) goToNextImage();
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
    };
    shouldIgnoreClick.current = false;
    setIsPaused(true);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current && images.length > 1) {
      const deltaX = event.clientX - pointerStart.current.x;
      const deltaY = event.clientY - pointerStart.current.y;
      const isHorizontalSwipe =
        Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY);

      if (isHorizontalSwipe) {
        shouldIgnoreClick.current = true;

        if (deltaX < 0) {
          goToNextImage();
        } else {
          goToPreviousImage();
        }
      }
    }

    event.currentTarget.releasePointerCapture(event.pointerId);
    pointerStart.current = null;
    setIsPaused(false);
  };

  const handleImageClick = (action: () => void) => {
    if (shouldIgnoreClick.current) {
      shouldIgnoreClick.current = false;
      return;
    }

    action();
  };

  if (experience.video) {
    return (
      <>
        <video
          src={experience.video}
          poster={experience.image}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay={isActive}
          muted
          loop
          playsInline
          preload={isActive ? "auto" : "metadata"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-black/20" />
      </>
    );
  }

  return (
    <div
      className="absolute inset-0 touch-pan-y overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerCancel={() => {
        pointerStart.current = null;
        setIsPaused(false);
      }}
      onPointerLeave={() => setIsPaused(false)}
      onPointerUp={handlePointerUp}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
      >
        {images.map((image) => (
          <img
            key={image}
            src={image}
            alt=""
            className="h-full w-full shrink-0 object-cover"
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-black/20" />

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="absolute bottom-24 left-0 top-24 z-10 w-1/2"
            onClick={() => handleImageClick(goToPreviousImage)}
            aria-label="Imagen anterior"
          />
          <button
            type="button"
            className="absolute bottom-24 right-0 top-24 z-10 w-1/2"
            onClick={() => handleImageClick(goToNextImage)}
            aria-label="Siguiente imagen"
          />
          <div className="absolute inset-x-0 bottom-[env(safe-area-inset-bottom)] z-20 h-0.5 overflow-hidden bg-white/30">
            <div
              key={`${experience.id}-${activeImageIndex}`}
              className={`h-full origin-left rounded-full bg-white ${
                isActive ? "[animation:feed-media-progress_4500ms_linear_forwards]" : ""
              }`}
              onAnimationEnd={handleProgressEnd}
              style={{
                animationPlayState: isPaused || !isActive ? "paused" : "running",
              }}
            />
          </div>
          <style>
            {`
              @keyframes feed-media-progress {
                from { transform: scaleX(0); }
                to { transform: scaleX(1); }
              }
            `}
          </style>
        </>
      )}
    </div>
  );
}
