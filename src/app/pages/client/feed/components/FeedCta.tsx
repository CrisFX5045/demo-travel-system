import { Link } from "react-router";

import { useClientI18n } from "../../i18n";
import { getExperiencePath } from "../../routes";

export function FeedCta({ experienceId }: { experienceId: string }) {
  const { t } = useClientI18n();
  const experiencePath = getExperiencePath(experienceId);
  const feedReturnPath = `/client/feed?experience=${encodeURIComponent(
    experienceId,
  )}`;

  return (
    <div className="mt-4 grid grid-cols-[1fr_auto] gap-3">
      <Link
        to={experiencePath}
        state={{ from: feedReturnPath }}
        className="rounded-full bg-white px-5 py-3 text-center text-sm font-extrabold text-gray-950 transition-transform duration-150 active:scale-[0.97]"
      >
        {t("requestBooking")}
      </Link>
      <Link
        to={experiencePath}
        state={{ from: feedReturnPath }}
        className="rounded-full bg-white/15 px-5 py-3 text-sm font-extrabold backdrop-blur transition-transform duration-150 active:scale-[0.97]"
      >
        {t("aboutExperience")}
      </Link>
    </div>
  );
}
