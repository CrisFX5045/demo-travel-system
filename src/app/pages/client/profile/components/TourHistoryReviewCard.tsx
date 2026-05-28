import {
  CalendarDaysIcon,
  MapPinIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { type FormEvent, useState } from "react";
import { Link } from "react-router";

import type { Experience } from "@/app/data/tourism";

import type { ProfileCopy } from "../content";

export function TourHistoryReviewCard({
  experience,
  copy,
  returnTo,
}: {
  experience: Experience;
  copy: ProfileCopy;
  returnTo: string;
}) {
  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const visibleRating = hoverRating || rating;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm shadow-gray-200/60">
      <Link
        to={`/client/experiences/${experience.id}`}
        state={{ from: returnTo }}
        className="block"
      >
        <img
          src={experience.image}
          alt=""
          className="aspect-[1.22] w-full object-cover"
        />
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/client/experiences/${experience.id}`}
              state={{ from: returnTo }}
              className="line-clamp-2 text-lg font-extrabold"
            >
              {experience.title}
            </Link>
            <p className="mt-2 flex items-center gap-1 truncate text-sm font-bold text-gray-500">
              <MapPinIcon className="size-4 shrink-0" />
              {experience.zone}, {experience.province}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[0.68rem] font-extrabold text-emerald-700">
            {copy.completed}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm font-bold text-gray-500">
          <CalendarDaysIcon className="size-4 shrink-0" />
          <span className="text-gray-700">{copy.tourDate}:</span>
          <span className="truncate">{experience.nextSlot}</span>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 rounded-3xl bg-gray-50 p-3">
          <p className="text-xs font-extrabold text-gray-500">
            {copy.ratingLabel}
          </p>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const Icon = star <= visibleRating ? StarSolidIcon : StarIcon;

              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setRating(star);
                    setIsSubmitted(false);
                  }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="grid size-8 place-items-center rounded-full bg-white text-yellow-500 transition hover:scale-105 active:scale-90"
                  aria-label={`${copy.ratingLabel} ${star}`}
                >
                  <Icon className="size-5" />
                </button>
              );
            })}
          </div>
          <textarea
            rows={3}
            placeholder={copy.reviewPlaceholder}
            value={comment}
            onChange={(event) => {
              setComment(event.target.value);
              setIsSubmitted(false);
            }}
            className="mt-3 w-full resize-none rounded-2xl border border-gray-100 bg-white px-3 py-2 text-sm font-semibold outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="mt-3 w-full rounded-full bg-gray-950 px-4 py-3 text-sm font-extrabold text-white transition active:scale-[0.98]"
          >
            {isSubmitted ? copy.reviewSubmitted : copy.writeReview}
          </button>
        </form>
      </div>
    </article>
  );
}
