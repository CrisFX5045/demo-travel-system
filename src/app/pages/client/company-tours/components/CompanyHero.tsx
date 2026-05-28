import {
  ArrowLeftIcon,
  MapPinIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router";

import type { CompanyGroup } from "../../company";

export function CompanyHero({
  companyGroup,
  backLabel,
  exploreMoreLabel,
  tourismCompanyLabel,
  onBack,
}: {
  companyGroup: CompanyGroup;
  backLabel: string;
  exploreMoreLabel: string;
  tourismCompanyLabel: string;
  onBack: () => void;
}) {
  return (
    <section className="relative min-h-[20rem] overflow-hidden bg-gray-950 px-4 pb-6 pt-[calc(1rem+env(safe-area-inset-top))] text-white md:px-8">
      <img
        src={companyGroup.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/40" />
      <div className="relative mx-auto flex max-w-5xl items-start justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="grid size-11 place-items-center rounded-full bg-black/35 backdrop-blur transition-transform active:scale-95"
          aria-label={backLabel}
        >
          <ArrowLeftIcon className="size-6" />
        </button>
        <Link
          to="/client/explore"
          className="rounded-full bg-white/15 px-4 py-2 text-sm font-extrabold backdrop-blur"
        >
          {exploreMoreLabel}
        </Link>
      </div>

      <div className="relative mx-auto mt-20 max-w-5xl">
        <p className="text-xs font-bold uppercase text-white/75">
          {tourismCompanyLabel}
        </p>
        <h1 className="mt-2 max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
          {companyGroup.company}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-2 backdrop-blur">
            <StarIcon className="size-4 fill-white" />
            {companyGroup.rating}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-2 backdrop-blur">
            <MapPinIcon className="size-4" />
            {companyGroup.zone}, {companyGroup.province}
          </span>
          <span className="rounded-full bg-white/15 px-3 py-2 backdrop-blur">
            {companyGroup.experiences.length} tours
          </span>
        </div>
      </div>
    </section>
  );
}
