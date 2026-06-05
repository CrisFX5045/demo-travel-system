import { useEffect, useMemo, useRef, useState } from "react";

import { getFeaturedTours, getTourImages } from "./utils";

export function usePixelTourFeaturedTours() {
  const featuredTours = useMemo(() => getFeaturedTours(), []);
  const [activeTourId, setActiveTourId] = useState<string | null>(null);
  const [activeDesktopTourId, setActiveDesktopTourId] = useState<string | null>(
    null,
  );
  const [desktopPopoverTourId, setDesktopPopoverTourId] = useState<
    string | null
  >(null);
  const [isDesktopPopoverClosing, setIsDesktopPopoverClosing] = useState(false);
  const [desktopPopoverPosition, setDesktopPopoverPosition] = useState({
    left: 0,
    top: 0,
  });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const desktopCloseTimerRef = useRef<number | null>(null);
  const desktopExitTimerRef = useRef<number | null>(null);
  const activeTour =
    featuredTours.find((tour) => tour.id === activeTourId) ?? null;
  const activeDesktopTour =
    featuredTours.find((tour) => tour.id === desktopPopoverTourId) ?? null;
  const activeTourImages = getTourImages(activeTour);

  const cancelDesktopClose = () => {
    if (desktopCloseTimerRef.current === null) return;

    window.clearTimeout(desktopCloseTimerRef.current);
    desktopCloseTimerRef.current = null;
  };

  const cancelDesktopExit = () => {
    if (desktopExitTimerRef.current === null) return;

    window.clearTimeout(desktopExitTimerRef.current);
    desktopExitTimerRef.current = null;
  };

  const closeDesktopTour = () => {
    cancelDesktopClose();
    setActiveDesktopTourId(null);
    setIsDesktopPopoverClosing(true);
    cancelDesktopExit();
    desktopExitTimerRef.current = window.setTimeout(() => {
      setDesktopPopoverTourId(null);
      setIsDesktopPopoverClosing(false);
      desktopExitTimerRef.current = null;
    }, 180);
  };

  const scheduleDesktopClose = () => {
    cancelDesktopClose();
    desktopCloseTimerRef.current = window.setTimeout(() => {
      closeDesktopTour();
    }, 180);
  };

  const openDesktopTour = (tourId: string, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();

    cancelDesktopClose();
    cancelDesktopExit();
    setDesktopPopoverPosition({
      left: window.scrollX + rect.left + rect.width / 2,
      top: window.scrollY + rect.bottom + 4,
    });
    setDesktopPopoverTourId(tourId);
    setActiveDesktopTourId(tourId);
    setIsDesktopPopoverClosing(false);
  };

  const toggleMobileTour = (tourId: string) => {
    setActiveTourId((current) => (current === tourId ? null : tourId));
  };

  const closeMobileTour = () => {
    setActiveTourId(null);
  };

  const scrollGalleryTo = (index: number) => {
    const gallery = galleryRef.current;

    setActiveImageIndex(index);
    gallery?.scrollTo({
      left: index * gallery.clientWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (desktopCloseTimerRef.current !== null) {
        window.clearTimeout(desktopCloseTimerRef.current);
      }

      if (desktopExitTimerRef.current !== null) {
        window.clearTimeout(desktopExitTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!activeTourId && !activeDesktopTourId) return;

    const closeWhenOutside = (event: PointerEvent) => {
      const target = event.target as Element;

      if (target.closest(".pixel-tour-featured__modal-card")) {
        return;
      }

      if (
        target.closest(".pixel-tour-featured__desktop") ||
        target.closest(".pixel-tour-featured__desktop-popover")
      ) {
        return;
      }

      if (
        activeTourId &&
        mobilePanelRef.current &&
        !mobilePanelRef.current.contains(event.target as Node)
      ) {
        setActiveTourId(null);
      }

      if (activeDesktopTourId || desktopPopoverTourId) {
        closeDesktopTour();
      }
    };

    document.addEventListener("pointerdown", closeWhenOutside);

    return () => document.removeEventListener("pointerdown", closeWhenOutside);
  }, [activeDesktopTourId, activeTourId, desktopPopoverTourId]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeTourId]);

  useEffect(() => {
    if (!activeTour || activeTourImages.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveImageIndex((current) => {
        const next = current === activeTourImages.length - 1 ? 0 : current + 1;
        const gallery = galleryRef.current;

        if (gallery) {
          gallery.scrollTo({
            left: next * gallery.clientWidth,
            behavior: "smooth",
          });
        }

        return next;
      });
    }, 3200);

    return () => window.clearInterval(timer);
  }, [activeTour, activeTourImages.length]);

  return {
    activeDesktopTour,
    activeDesktopTourId,
    activeImageIndex,
    activeTour,
    activeTourId,
    activeTourImages,
    cancelDesktopClose,
    closeMobileTour,
    desktopPopoverPosition,
    featuredTours,
    galleryRef,
    isDesktopPopoverClosing,
    isMounted,
    mobilePanelRef,
    now,
    openDesktopTour,
    scheduleDesktopClose,
    scrollGalleryTo,
    setActiveImageIndex,
    toggleMobileTour,
  };
}
