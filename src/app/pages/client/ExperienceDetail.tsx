import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";

import { experiences } from "@/app/data/tourism";

import {
  BookingCard,
  ExperienceEntryAnimation,
  ExperienceGallery,
  Highlight,
  InfoPill,
} from "./experience-detail/components";
import { getReturnPath } from "./experience-detail/utils";
import { FeedShareSheet } from "./feed/components";
import { useFeedReactions } from "./feed/hooks/useFeedReactions";
import { useScrollChrome } from "./hooks/useScrollChrome";
import { useClientI18n } from "./i18n";
import { formatExperiencePrice, getPromotionPrice } from "./price";

export default function ClientExperienceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const experience = experiences.find((item) => item.id === id);
  const returnTo = getReturnPath(location.state);
  const { liked, saved, toggleLiked, toggleSaved } = useFeedReactions();
  const { isMobileHeaderVisible } = useScrollChrome();
  const { t, language, text } = useClientI18n();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const galleryImages = useMemo(() => {
    if (!experience) return [];

    return experience.images?.length ? experience.images : [experience.image];
  }, [experience]);
  const isLiked = experience ? Boolean(liked[experience.id]) : false;
  const isSaved = experience ? Boolean(saved[experience.id]) : false;
  const promotion = experience?.promotion;
  const promotionPrice = experience ? getPromotionPrice(experience) : null;

  const leaveExperience = () => {
    navigate(returnTo);
  };

  if (!experience) {
    return (
      <main className="min-h-screen bg-white px-5 py-8 text-gray-950">
        <Link
          to="/client"
          className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-bold"
        >
          <ArrowLeftIcon className="size-4" />
          {t("back")}
        </Link>
        <div className="mx-auto mt-20 max-w-md text-center">
          <h1 className="text-2xl font-extrabold">Experiencia no encontrada</h1>
          <p className="mt-2 text-gray-500">
            Esta experiencia ya no esta disponible o el enlace cambio.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      data-client-experience-entry
      className="min-h-screen bg-white pb-10 text-gray-950 [animation:client-experience-page-in_420ms_cubic-bezier(.22,1,.36,1)_both]"
    >
      <ExperienceEntryAnimation />
      <section className="relative overflow-hidden bg-gray-950">
        <ExperienceGallery
          images={galleryImages}
          title={experience.title}
          isLiked={isLiked}
          isSaved={isSaved}
          onToggleLiked={() => toggleLiked(experience.id)}
          onToggleSaved={() => toggleSaved(experience.id)}
          onShare={() => setIsShareOpen(true)}
        />
        <div
          className={`pointer-events-none fixed inset-x-0 top-0 z-40 px-4 pt-[calc(1rem+env(safe-area-inset-top))] transition-transform duration-300 ease-out md:absolute md:translate-y-0 md:px-8 ${
            isMobileHeaderVisible ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <button
            type="button"
            onClick={leaveExperience}
            className="pointer-events-auto inline-grid size-11 place-items-center rounded-full bg-black/35 text-white backdrop-blur transition-transform duration-150 active:scale-90"
            aria-label={t("back")}
          >
            <ArrowLeftIcon className="size-6" />
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-7 text-white md:px-8 md:pb-10">
          <div className="mx-auto max-w-5xl [animation:client-experience-content-in_620ms_120ms_cubic-bezier(.22,1,.36,1)_both]">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold backdrop-blur">
                {text(experience.category)}
              </span>
              {experience.promoted && (
                <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-extrabold">
                  {promotion?.badge ?? "Promo"}
                </span>
              )}
            </div>
            <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">
              {experience.title}
            </h1>
            <p className="mt-2 text-sm font-bold text-white/85 md:text-base">
              {experience.company}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 pb-28 pt-6 xl:grid-cols-[1fr_22rem] xl:px-2 xl:pb-10 xl:pt-8">
        <div className="[animation:client-experience-content-in_520ms_180ms_cubic-bezier(.22,1,.36,1)_both]">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <InfoPill
              icon={MapPinIcon}
              label={experience.province}
              value={experience.zone}
            />
            <InfoPill
              icon={ClockIcon}
              label={t("duration")}
              value={experience.duration}
            />
            <InfoPill
              icon={StarIcon}
              label={t("rating")}
              value={`${experience.rating} (${experience.reviews}+)`}
            />
            <InfoPill
              icon={CalendarDaysIcon}
              label={t("nextSlot")}
              value={experience.nextSlot}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {experience.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-3 py-2 text-xs font-extrabold text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-extrabold">{t("aboutExperience")}</h2>
            <p className="mt-3 leading-7 text-gray-600">
              {language === "es"
                ? `${experience.company} te lleva a ${experience.zone}, ${experience.province}, con una experiencia de ${experience.duration} y dificultad ${experience.difficulty.toLowerCase()}.`
                : `${experience.company} takes you to ${experience.zone}, ${experience.province}, with a ${experience.duration} experience and ${experience.difficulty.toLowerCase()} difficulty.`}
            </p>
            {promotion && (
              <div className="mt-4 border-t border-gray-100 pt-4 text-gray-950">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-extrabold text-white">
                    {promotion.badge}
                  </span>
                  <p className="text-sm font-extrabold">{promotion.title}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {promotion.description}
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Highlight title={t("includes")} value={t("includesValue")} />
            <Highlight title={t("idealFor")} value={t("idealForValue")} />
            <Highlight title={t("booking")} value={t("bookingValue")} />
          </div>
        </div>

        <BookingCard
          price={formatExperiencePrice(experience)}
          promotionPrice={promotionPrice}
          promotion={promotion}
          nextSlot={experience.nextSlot}
          isLiked={isLiked}
          isSaved={isSaved}
          onToggleLiked={() => toggleLiked(experience.id)}
          onToggleSaved={() => toggleSaved(experience.id)}
          onShare={() => setIsShareOpen(true)}
        />
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-100 bg-white/95 px-4 pb-[calc(.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-14px_30px_rgba(15,23,42,0.08)] backdrop-blur xl:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-gray-500">{t("from")}</p>
            <div className="flex flex-wrap items-center gap-2">
              {promotionPrice ? (
                <div>
                  <p className="text-xs font-bold text-gray-400 line-through">
                    {promotionPrice.original}
                  </p>
                  <p className="text-xl font-extrabold">
                    {promotionPrice.final}
                  </p>
                </div>
              ) : (
                <p className="text-xl font-extrabold">
                  {formatExperiencePrice(experience)}
                </p>
              )}
              {promotion && (
                <span className="rounded-full bg-red-600 px-2.5 py-1 text-[0.68rem] font-extrabold text-white">
                  {promotion.badge}
                </span>
              )}
            </div>
          </div>
          <button className="rounded-full bg-gray-950 px-6 py-3 text-sm font-extrabold text-white transition-transform duration-150 active:scale-[0.97]">
            {t("request")}
          </button>
        </div>
      </div>

      <FeedShareSheet
        experience={experience}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </main>
  );
}
