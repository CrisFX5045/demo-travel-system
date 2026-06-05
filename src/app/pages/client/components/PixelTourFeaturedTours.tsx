import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { DesktopFeaturedTourButtons } from "./pixel-tour-featured/DesktopFeaturedTourButtons";
import { MobileFeaturedTourChips } from "./pixel-tour-featured/MobileFeaturedTourChips";
import { MobileFeaturedTourModal } from "./pixel-tour-featured/MobileFeaturedTourModal";
import { TourPromotionPanel } from "./pixel-tour-featured/TourPromotionPanel";
import { usePixelTourFeaturedTours } from "./pixel-tour-featured/usePixelTourFeaturedTours";
import "../style/PixelTourFeaturedTours.css";

export function PixelTourFeaturedTours() {
  const { t } = useTranslation();
  const {
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
  } = usePixelTourFeaturedTours();

  return (
    <div
      className="pixel-tour-featured"
      aria-label={t("client.pixelTour.featured.aria")}
    >
      <div className="pixel-tour-featured__scrim" aria-hidden="true" />

      <DesktopFeaturedTourButtons
        tours={featuredTours}
        activeTourId={activeDesktopTourId}
        onOpenTour={openDesktopTour}
        onScheduleClose={scheduleDesktopClose}
        t={t}
      />

      {isMounted && activeDesktopTour
        ? createPortal(
            <div
              className={`pixel-tour-featured__desktop-popover ${
                isDesktopPopoverClosing ? "is-closing" : ""
              }`}
              style={{
                left: desktopPopoverPosition.left,
                top: desktopPopoverPosition.top,
              }}
              onMouseEnter={cancelDesktopClose}
              onMouseLeave={scheduleDesktopClose}
            >
              <TourPromotionPanel tour={activeDesktopTour} now={now} t={t} />
            </div>,
            document.body,
          )
        : null}

      <div className="pixel-tour-featured__mobile" ref={mobilePanelRef}>
        <MobileFeaturedTourChips
          tours={featuredTours}
          activeTourId={activeTourId}
          onToggleTour={toggleMobileTour}
          t={t}
        />

        {isMounted && activeTour
          ? createPortal(
              <MobileFeaturedTourModal
                tour={activeTour}
                images={activeTourImages}
                activeImageIndex={activeImageIndex}
                galleryRef={galleryRef}
                now={now}
                t={t}
                onClose={closeMobileTour}
                onImageIndexChange={setActiveImageIndex}
                onScrollGalleryTo={scrollGalleryTo}
              />,
              document.body,
            )
          : null}
      </div>
    </div>
  );
}
