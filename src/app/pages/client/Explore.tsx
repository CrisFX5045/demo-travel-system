import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";

import { experiences } from "@/app/data/tourism";

import { CategoryTabs, CompanyTourBlock, ExperienceCard } from "./components";
import { groupExperiencesByCompany } from "./company";
import { tabs } from "./content";
import { useFeedReactions } from "./feed/hooks/useFeedReactions";
import { useClientI18n } from "./i18n";

export default function ClientExplore() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const { liked, toggleLiked } = useFeedReactions();
  const { t, text } = useClientI18n();
  const type = searchParams.get("type") ?? "Tours";
  const category = searchParams.get("category") ?? "";
  const filter = searchParams.get("filter") ?? "";
  const province = searchParams.get("province") ?? "";
  const tag = searchParams.get("tag") ?? "";
  const view = searchParams.get("view") ?? "";

  const handleSelectType = (nextType: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("type", nextType);
    setSearchParams(nextParams);
  };

  const filteredExperiences = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return experiences.filter((experience) => {
      const matchesType = getTypeCategories(type).includes(
        experience.category,
      );
      const matchesCategory = !category || experience.category === category;
      const matchesProvince = !province || experience.province === province;
      const matchesTag = !tag || experience.tags.includes(tag);
      const matchesQuery =
        !normalizedQuery ||
        [
          experience.title,
          experience.company,
          experience.category,
          experience.province,
          experience.zone,
          ...experience.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesFilter =
        !filter ||
        (filter === "Ofertas" && experience.promoted) ||
        (filter === "Mayor calificacion" && experience.rating >= 4.8) ||
        (filter === "Nacionales" && experience.province !== "Guanacaste") ||
        !["Ofertas", "Mayor calificacion", "Nacionales"].includes(filter);

      return (
        matchesCategory &&
        matchesType &&
        matchesProvince &&
        matchesTag &&
        matchesQuery &&
        matchesFilter
      );
    });
  }, [category, filter, province, query, tag, type]);
  const companyGroups = useMemo(
    () => groupExperiencesByCompany(filteredExperiences),
    [filteredExperiences],
  );
  const isCompanyView = view === "companies";

  const title =
    isCompanyView
      ? t("companiesWithTours")
      : category || tag || filter || type;
  const returnTo = `${location.pathname}${location.search}`;

  return (
    <main className="min-h-screen w-full max-w-[100svw] overflow-x-hidden bg-white pb-10 text-gray-950">
      <header className="sticky top-0 z-30 w-full max-w-[100svw] border-b border-gray-100 bg-white/95 px-4 pb-4 pt-[calc(0.9rem+env(safe-area-inset-top))] backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/client")}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-gray-100"
            aria-label={t("back")}
          >
            <ArrowLeftIcon className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase text-gray-500">
              {t("results")}
            </p>
            <h1 className="line-clamp-2 text-xl font-extrabold leading-tight md:truncate md:text-2xl">
              {text(title)}
            </h1>
          </div>
        </div>

        <div className="mx-auto mt-4 flex max-w-5xl items-center gap-3 rounded-full bg-gray-100 px-4">
          <MagnifyingGlassIcon className="size-5 text-gray-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchExperiences")}
            className="h-12 min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-gray-500"
          />
        </div>
      </header>

      <div className="mx-auto w-full max-w-[100svw] overflow-x-hidden px-4 py-5 md:max-w-5xl md:px-8">
        <div className="-mx-4 mb-5 md:mx-0">
          <CategoryTabs
            tabs={tabs}
            activeTab={type}
            onSelectTab={handleSelectType}
            showImages={false}
          />
        </div>

        {filteredExperiences.length > 0 ? (
          isCompanyView ? (
            <div className="divide-y divide-gray-100">
              {companyGroups.map((group) => (
                <CompanyTourBlock
                  key={group.company}
                  group={group}
                  liked={liked}
                  onToggleLiked={toggleLiked}
                  returnTo={returnTo}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {filteredExperiences.map((experience) => (
                <ExperienceCard
                  key={experience.id}
                  experience={experience}
                  isLiked={Boolean(liked[experience.id])}
                  onToggleLiked={() => toggleLiked(experience.id)}
                  variant="grid"
                  returnTo={returnTo}
                />
              ))}
            </div>
          )
        ) : (
          <section className="mx-auto mt-20 max-w-md text-center">
            <h2 className="text-2xl font-extrabold">
              {t("noResults")}
            </h2>
            <p className="mt-2 text-gray-500">
              {t("noResultsHint")}
            </p>
            <Link
              to="/client"
              className="mt-5 inline-flex rounded-full bg-gray-950 px-5 py-3 text-sm font-extrabold text-white"
            >
              {t("backToExplore")}
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}

function getTypeCategories(type: string) {
  if (type === "Servicios") return ["Cultura", "Playa", "Wellness"];
  if (type === "Experiencias") return ["Naturaleza", "Cultura"];
  return ["Aventura", "Playa", "Naturaleza", "Wellness"];
}
