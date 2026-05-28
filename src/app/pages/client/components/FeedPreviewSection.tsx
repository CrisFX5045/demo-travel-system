import { PlayCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

import type { Experience } from "@/app/data/tourism";

import { useClientI18n } from "../i18n";

export function FeedPreviewSection({
  experience,
}: {
  experience: Experience;
}) {
  const { t } = useClientI18n();

  return (
    <section id="feed" className="bg-gray-950 px-4 py-8 text-white md:px-8">
      <div className="mx-auto grid max-w-[86rem] gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div>
          <p className="text-sm font-bold uppercase text-primary-300">
            {t("verticalFeed")}
          </p>
          <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">
            {t("feedPreviewTitle")}
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70 md:text-base">
            {t("feedPreviewSubtitle")}
          </p>
          <Link
            to="/client/feed"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-gray-950"
          >
            {t("openFeed")}
            <PlayCircleIcon className="size-5" />
          </Link>
        </div>
        <Link
          to="/client/feed"
          className="relative block min-h-80 overflow-hidden rounded-[2rem] bg-gray-900"
        >
          <img
            src={experience.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute bottom-0 p-5">
            <span className="rounded-full bg-primary-500 px-3 py-1 text-xs font-bold">
              {t("preview")}
            </span>
            <h3 className="mt-3 text-2xl font-extrabold">
              {experience.title}
            </h3>
          </div>
        </Link>
      </div>
    </section>
  );
}
