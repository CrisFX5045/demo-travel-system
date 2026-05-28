import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldCheckIcon,
  StarIcon,
  TicketIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { type ElementType, type FormEvent, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";

import { useClientI18n } from "./i18n";
import { formatExperiencePrice } from "./price";
import {
  getBookingCode,
  getProfileBookingById,
  pastTourIds,
} from "./profile/bookings";
import { profileCopy } from "./profile/content";
import { getReturnPath } from "./experience-detail/utils";

export default function ClientProfileBookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, t } = useClientI18n();
  const copy = profileCopy[language];
  const experience = getProfileBookingById(id);
  const returnTo = getReturnPath(location.state) || "/client/profile/bookings";
  const isPastTour =
    Boolean(experience && pastTourIds.includes(experience.id)) ||
    returnTo.includes("/client/profile/tours");
  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
  const visibleRating = hoverRating || rating;

  const handleReviewSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsReviewSubmitted(true);
  };

  if (!experience) {
    return (
      <main className="min-h-screen bg-white px-5 py-8 text-gray-950">
        <button
          type="button"
          onClick={() => navigate("/client/profile")}
          className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-bold"
        >
          <ArrowLeftIcon className="size-4" />
          {t("back")}
        </button>
        <div className="mx-auto mt-20 max-w-md text-center">
          <h1 className="text-2xl font-extrabold">{copy.bookingDetail}</h1>
          <p className="mt-2 text-gray-500">{copy.noTrips}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f8f6] pb-10 text-gray-950">
      <section className="relative min-h-[24rem] overflow-hidden bg-gray-950 text-white">
        <img
          src={experience.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/45" />
        <div className="relative mx-auto flex max-w-5xl items-start justify-between px-4 pt-[calc(1rem+env(safe-area-inset-top))] md:px-8">
          <button
            type="button"
            onClick={() => navigate(returnTo)}
            className="grid size-11 place-items-center rounded-full bg-black/35 backdrop-blur transition active:scale-95"
            aria-label={t("back")}
          >
            <ArrowLeftIcon className="size-6" />
          </button>
          <span className="rounded-full bg-emerald-500 px-3 py-2 text-xs font-extrabold">
            {isPastTour ? copy.completed : "Confirmada"}
          </span>
        </div>
        <div className="relative mx-auto mt-24 max-w-5xl px-4 pb-8 md:px-8">
          <p className="text-xs font-extrabold uppercase text-white/70">
            {copy.bookingDetail}
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">
            {experience.title}
          </h1>
          <p className="mt-2 text-sm font-bold text-white/80">
            {experience.company}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-4 px-4 py-5 md:grid-cols-[minmax(0,1fr)_20rem] md:px-8">
        <section className="grid gap-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <BookingInfoPill
              icon={TicketIcon}
              label={copy.bookingCode}
              value={getBookingCode(experience.id)}
            />
            <BookingInfoPill
              icon={CalendarDaysIcon}
              label={t("nextSlot")}
              value={experience.nextSlot}
            />
            <BookingInfoPill
              icon={ClockIcon}
              label={t("duration")}
              value={experience.duration}
            />
            <BookingInfoPill
              icon={UserGroupIcon}
              label={copy.guests}
              value="2"
            />
          </div>

          <section className="rounded-[1.5rem] bg-white p-5 shadow-sm shadow-gray-200/60">
            <h2 className="text-xl font-extrabold">{copy.importantInfo}</h2>
            <div className="mt-4 grid gap-3">
              <ImportantRow
                icon={MapPinIcon}
                title={copy.meetingPoint}
                value={`${experience.zone}, ${experience.province}`}
              />
              <ImportantRow
                icon={ShieldCheckIcon}
                title={t("includes")}
                value={t("includesValue")}
              />
              <ImportantRow
                icon={CheckCircleIcon}
                title={t("booking")}
                value={copy.cancellationPolicy}
              />
            </div>
          </section>
        </section>

        {isPastTour ? (
          <aside className="h-fit rounded-[1.5rem] bg-white p-5 shadow-sm shadow-gray-200/60">
            <p className="text-sm font-bold text-gray-500">
              {copy.ratingLabel}
            </p>
            <h2 className="mt-1 text-2xl font-extrabold">
              {copy.ViewDetails}
            </h2>
            <form onSubmit={handleReviewSubmit} className="mt-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const Icon = star <= visibleRating ? StarSolidIcon : StarIcon;

                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        setRating(star);
                        setIsReviewSubmitted(false);
                      }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="grid size-10 place-items-center rounded-full bg-gray-100 text-yellow-500 transition hover:scale-105 active:scale-90"
                      aria-label={`${copy.ratingLabel} ${star}`}
                    >
                      <Icon className="size-6" />
                    </button>
                  );
                })}
              </div>
              <textarea
                rows={5}
                placeholder={copy.reviewPlaceholder}
                value={comment}
                onChange={(event) => {
                  setComment(event.target.value);
                  setIsReviewSubmitted(false);
                }}
                className="mt-4 w-full resize-none rounded-3xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="mt-4 w-full rounded-full bg-gray-950 px-5 py-3 text-sm font-extrabold text-white transition active:scale-[0.98]"
              >
                {isReviewSubmitted ? copy.reviewSubmitted : copy.ViewDetails}
              </button>
            </form>
          </aside>
        ) : (
          <aside className="h-fit rounded-[1.5rem] bg-white p-5 shadow-sm shadow-gray-200/60">
            <p className="text-sm font-bold text-gray-500">{t("from")}</p>
            <p className="mt-1 text-3xl font-extrabold">
              {formatExperiencePrice(experience)}
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-gray-500">
              {copy.bookingDetailHint}
            </p>

            <button className="mt-5 w-full rounded-full bg-gray-950 px-5 py-3 text-sm font-extrabold text-white transition active:scale-[0.98]">
              {copy.requestChanges}
            </button>
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-gray-100 px-5 py-3 text-sm font-extrabold transition active:scale-[0.98]">
              <ChatBubbleLeftRightIcon className="size-5" />
              {copy.companyContact}
            </button>
            <Link
              to="/client"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-extrabold transition active:scale-[0.98]"
            >
              <PhoneIcon className="size-5" />
              WhatsApp
            </Link>
          </aside>
        )}
      </div>
    </main>
  );
}

function BookingInfoPill({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm shadow-gray-200/60">
      <Icon className="size-5 text-gray-500" />
      <p className="mt-3 text-xs font-bold uppercase text-gray-500">{label}</p>
      <p className="mt-1 line-clamp-2 text-sm font-extrabold">{value}</p>
    </div>
  );
}

function ImportantRow({
  icon: Icon,
  title,
  value,
}: {
  icon: ElementType;
  title: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-3xl bg-gray-50 p-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white">
        <Icon className="size-5 text-gray-700" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-extrabold">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-gray-500">
          {value}
        </span>
      </span>
    </div>
  );
}
