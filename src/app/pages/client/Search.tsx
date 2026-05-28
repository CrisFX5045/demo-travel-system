import {
  AdjustmentsHorizontalIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import { experiences } from "@/app/data/tourism";

import { ExperienceCard } from "./components";
import { categoryTiles, filterPills } from "./content";
import { useFeedReactions } from "./feed/hooks/useFeedReactions";
import { useClientI18n } from "./i18n";
import {
  bookingOptionFilters,
  customDateFilter,
  dateFilterOptions,
  priceBounds,
  RECENT_SEARCHES_KEY,
  recommendedTourFilters,
  suggestedDestinations,
  tourServiceFilters,
} from "./search/constants";
import {
  CategoryFilterButton,
  CompactFilterSection,
  FilterChoiceGrid,
  PriceRangeControl,
  SearchFilterSheet,
  SearchGroup,
  SearchStepCard,
  SuggestionRow,
} from "./search/components";
import {
  formatPriceRangeLabel,
  getDateFilterLabel,
  getTodayInputValue,
  hasCustomPriceRange,
  matchesExperienceLocation,
  matchesExperiencePriceRange,
  matchesSelectedFilters,
  readActiveFilters,
  readMaxPriceParam,
  readPriceParam,
  readRecentSearches,
  toggleFilter,
} from "./search/utils";

export default function ClientSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const hasInitialSearch =
    Boolean(initialQuery) ||
    Boolean(searchParams.get("filters")) ||
    Boolean(searchParams.get("filter")) ||
    Boolean(searchParams.get("date")) ||
    Boolean(searchParams.get("dateStart")) ||
    Boolean(searchParams.get("location")) ||
    Boolean(searchParams.get("priceMin")) ||
    Boolean(searchParams.get("priceMax"));
  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [hasSubmittedSearch, setHasSubmittedSearch] = useState(hasInitialSearch);
  const [activeFilters, setActiveFilters] = useState(() =>
    readActiveFilters(searchParams),
  );
  const [activeDate, setActiveDate] = useState(searchParams.get("date") ?? "");
  const [dateStart, setDateStart] = useState(searchParams.get("dateStart") ?? "");
  const [dateEnd, setDateEnd] = useState(searchParams.get("dateEnd") ?? "");
  const [selectedLocation, setSelectedLocation] = useState(
    searchParams.get("location") ?? "",
  );
  const [priceMin, setPriceMin] = useState(() =>
    readPriceParam(searchParams.get("priceMin"), priceBounds.min),
  );
  const [priceMax, setPriceMax] = useState(() =>
    readMaxPriceParam(searchParams.get("priceMax")),
  );
  const [openSearchStep, setOpenSearchStep] = useState<
    "where" | "when" | "filters" | "price" | null
  >("where");
  const [isInlineDateOpen, setIsInlineDateOpen] = useState(
    Boolean(searchParams.get("dateStart")),
  );
  const [inlineStartDate, setInlineStartDate] = useState(
    searchParams.get("dateStart") || getTodayInputValue(),
  );
  const [inlineEndDate, setInlineEndDate] = useState(
    searchParams.get("dateEnd") ||
      searchParams.get("dateStart") ||
      getTodayInputValue(),
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    readRecentSearches(),
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { liked, toggleLiked } = useFeedReactions();
  const { t, text, language } = useClientI18n();
  const hasActiveSearchCriteria =
    submittedQuery.trim().length > 0 ||
    activeFilters.length > 0 ||
    activeDate ||
    dateStart ||
    selectedLocation ||
    hasCustomPriceRange(priceMin, priceMax);
  const isResultsMode = hasSubmittedSearch && Boolean(hasActiveSearchCriteria);
  const activeDateLabel = getDateFilterLabel({
    activeDate,
    dateStart,
    dateEnd,
    allDatesLabel: t("allDates"),
    customDatesLabel: t("customDates"),
    text,
  });
  const returnTo = `${location.pathname}${location.search}`;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const previousBodyOverflowX = document.body.style.overflowX;
    const previousHtmlOverflowX = document.documentElement.style.overflowX;

    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";

    return () => {
      document.body.style.overflowX = previousBodyOverflowX;
      document.documentElement.style.overflowX = previousHtmlOverflowX;
    };
  }, []);

  useEffect(() => {
    const nextStartDate = dateStart || getTodayInputValue();
    setInlineStartDate(nextStartDate);
    setInlineEndDate(dateEnd || dateStart || nextStartDate);
  }, [dateEnd, dateStart]);

  const resetSearch = () => {
    setQuery("");
    setSubmittedQuery("");
    setHasSubmittedSearch(false);
    setActiveFilters([]);
    setActiveDate("");
    setDateStart("");
    setDateEnd("");
    setSelectedLocation("");
    setPriceMin(priceBounds.min);
    setPriceMax(priceBounds.max);
    setIsInlineDateOpen(false);
    setIsFilterOpen(false);
    setSearchParams({}, { replace: true });
    inputRef.current?.focus();
  };

  const handleBack = () => {
    if (isResultsMode) {
      resetSearch();
      return;
    }

    navigate("/client");
  };

  const results = useMemo(() => {
    const normalizedQuery = submittedQuery.trim().toLowerCase();

    if (
      !normalizedQuery &&
      activeFilters.length === 0 &&
      !activeDate &&
      !dateStart &&
      !selectedLocation &&
      !hasCustomPriceRange(priceMin, priceMax)
    ) {
      return [];
    }

    return experiences.filter((experience) => {
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

      const matchesFilters = matchesSelectedFilters(experience, activeFilters);
      const matchesLocation = matchesExperienceLocation(
        experience,
        selectedLocation,
      );
      const matchesPrice =
        !hasCustomPriceRange(priceMin, priceMax) ||
        matchesExperiencePriceRange(experience, priceMin, priceMax);

      return matchesQuery && matchesLocation && matchesFilters && matchesPrice;
    });
  }, [
    activeDate,
    activeFilters,
    dateStart,
    priceMax,
    priceMin,
    selectedLocation,
    submittedQuery,
  ]);

  const submitSearch = (
    nextQuery = query,
    nextFilters = activeFilters,
    nextDate = activeDate,
    nextDateStart = dateStart,
    nextDateEnd = dateEnd,
    nextLocation = selectedLocation,
    nextPriceMin = priceMin,
    nextPriceMax = priceMax,
    showResults = hasSubmittedSearch,
  ) => {
    const cleanQuery = nextQuery.trim();
    setQuery(cleanQuery);
    setSubmittedQuery(cleanQuery);
    setActiveFilters(nextFilters);
    setActiveDate(nextDate);
    setDateStart(nextDateStart);
    setDateEnd(nextDateEnd);
    setSelectedLocation(nextLocation);
    setPriceMin(nextPriceMin);
    setPriceMax(nextPriceMax);
    setHasSubmittedSearch(
      showResults &&
        Boolean(
          cleanQuery ||
            nextFilters.length > 0 ||
            nextDate ||
            nextDateStart ||
            nextDateEnd ||
            nextLocation ||
            hasCustomPriceRange(nextPriceMin, nextPriceMax),
        ),
    );

    const nextParams = new URLSearchParams();
    if (cleanQuery) nextParams.set("q", cleanQuery);
    if (nextFilters.length > 0) nextParams.set("filters", nextFilters.join(","));
    if (nextDate) nextParams.set("date", nextDate);
    if (nextDateStart) nextParams.set("dateStart", nextDateStart);
    if (nextDateEnd) nextParams.set("dateEnd", nextDateEnd);
    if (nextLocation) nextParams.set("location", nextLocation);
    if (nextPriceMin > priceBounds.min) {
      nextParams.set("priceMin", String(nextPriceMin));
    }
    if (nextPriceMax < priceBounds.max) {
      nextParams.set("priceMax", String(nextPriceMax));
    }
    setSearchParams(showResults ? nextParams : {}, { replace: true });

    if (cleanQuery) {
      const nextRecent = [
        cleanQuery,
        ...recentSearches.filter(
          (item) => item.toLowerCase() !== cleanQuery.toLowerCase(),
        ),
      ].slice(0, 8);
      setRecentSearches(nextRecent);
      window.localStorage.setItem(
        RECENT_SEARCHES_KEY,
        JSON.stringify(nextRecent),
      );
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submitSearch(
      query,
      activeFilters,
      activeDate,
      dateStart,
      dateEnd,
      selectedLocation,
      priceMin,
      priceMax,
      true,
    );
  };

  const selectFilter = (filter: string) => {
    const nextFilters = toggleFilter(activeFilters, filter);
    submitSearch(
      query,
      nextFilters,
      activeDate,
      dateStart,
      dateEnd,
      selectedLocation,
      priceMin,
      priceMax,
      isResultsMode,
    );
  };

  const searchByCategory = (category: string) => {
    submitSearch(
      query,
      [category],
      activeDate,
      dateStart,
      dateEnd,
      selectedLocation,
      priceMin,
      priceMax,
      true,
    );
  };

  const selectDate = (date: string) => {
    const nextDate = activeDate === date ? "" : date;
    setIsInlineDateOpen(false);
    submitSearch(
      query,
      activeFilters,
      nextDate,
      "",
      "",
      selectedLocation,
      priceMin,
      priceMax,
      isResultsMode,
    );
  };

  const applyCustomDateRange = (startDate: string, endDate: string) => {
    const normalizedEndDate = endDate || startDate;

    if (!startDate) {
      setIsInlineDateOpen(false);
      submitSearch(
        query,
        activeFilters,
        "",
        "",
        "",
        selectedLocation,
        priceMin,
        priceMax,
        isResultsMode,
      );
      return;
    }

    submitSearch(
      query,
      activeFilters,
      customDateFilter,
      startDate,
      normalizedEndDate,
      selectedLocation,
      priceMin,
      priceMax,
      isResultsMode,
    );
    setIsInlineDateOpen(false);
  };

  const updatePriceRange = (nextMin: number, nextMax: number) => {
    submitSearch(
      query,
      activeFilters,
      activeDate,
      dateStart,
      dateEnd,
      selectedLocation,
      nextMin,
      nextMax,
      isResultsMode,
    );
  };

  const clearSearchFilters = () => {
    submitSearch(
      query,
      [],
      "",
      "",
      "",
      "",
      priceBounds.min,
      priceBounds.max,
      isResultsMode,
    );
  };

  return (
    <main className="min-h-screen w-[100dvw] max-w-full overflow-x-hidden bg-[#f8f8f6] text-gray-950">
      <header className="sticky top-0 z-30 w-[100dvw] max-w-full overflow-x-hidden border-b border-gray-100 bg-[#f8f8f6]/90 px-4 pb-3 pt-[calc(0.8rem+env(safe-area-inset-top))] backdrop-blur-xl md:px-8">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-full min-w-0 items-center gap-2 md:max-w-4xl"
        >
          <button
            type="button"
            onClick={handleBack}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-gray-100 transition active:scale-95"
            aria-label={t("back")}
          >
            <ArrowLeftIcon className="size-5" />
          </button>
          <div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full border border-gray-100 bg-white px-4 shadow-sm shadow-gray-200/70">
            <MagnifyingGlassIcon className="size-5 shrink-0 text-gray-500" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("startTyping")}
              className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-gray-500"
            />
            {isResultsMode && (
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="grid size-8 shrink-0 place-items-center rounded-full bg-white shadow-sm"
                aria-label={t("editFilters")}
              >
                <AdjustmentsHorizontalIcon className="size-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="hidden rounded-full bg-gray-950 px-5 py-3 text-sm font-extrabold text-white md:block"
          >
            {t("search")}
          </button>
        </form>
        {!isResultsMode && (
          <div className="mx-auto mt-2 grid w-full max-w-full min-w-0 gap-1.5 md:max-w-4xl">
            <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.08em] text-gray-400">
              {t("recentSearches")}
            </span>
            <div className="flex min-w-0 gap-1.5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {recentSearches.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    submitSearch(
                      item,
                      activeFilters,
                      activeDate,
                      dateStart,
                      dateEnd,
                      selectedLocation,
                      priceMin,
                      priceMax,
                      true,
                    )
                  }
                  className="shrink-0 rounded-full bg-white/80 px-2.5 py-1 text-[0.72rem] font-extrabold text-gray-600 ring-1 ring-gray-100 transition active:scale-[0.98]"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto box-border w-[100dvw] max-w-full px-2 py-5 md:max-w-4xl md:px-8">
        {isResultsMode ? (
          <section className="w-full min-w-0 max-w-full">
            <div className="mb-4 grid min-w-0 gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase text-gray-500">
                  {t("searchResults")}
                </p>
                <h1 className="truncate text-2xl font-extrabold">
                  {submittedQuery ||
                    selectedLocation ||
                    activeFilters.map(text).join(" + ") ||
                    activeDateLabel}
                </h1>
              </div>
              {(activeFilters.length > 0 ||
                activeDate ||
                dateStart ||
                selectedLocation ||
                hasCustomPriceRange(priceMin, priceMax)) && (
                <div className="flex min-w-0 flex-wrap gap-2 items-center">
                  {selectedLocation && (
                    <button
                      type="button"
                      onClick={() =>
                        submitSearch(
                          query,
                          activeFilters,
                          activeDate,
                          dateStart,
                          dateEnd,
                          "",
                          priceMin,
                          priceMax,
                          isResultsMode,
                        )
                      }
                      className="max-w-full rounded-full bg-gray-100 px-3 py-2 text-xs font-extrabold"
                    >
                      <span className="block truncate">{selectedLocation}</span>
                    </button>
                  )}
                  {activeFilters.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => selectFilter(filter)}
                      className="max-w-full rounded-full bg-gray-100 px-3 py-2 text-xs font-extrabold"
                    >
                      <span className="block truncate">{text(filter)}</span>
                    </button>
                  ))}
                  {(activeDate || dateStart) && (
                    <button
                      type="button"
                      onClick={() => applyCustomDateRange("", "")}
                      className="max-w-full rounded-full bg-gray-100 px-3 py-2 text-xs font-extrabold"
                    >
                      <span className="block truncate">{activeDateLabel}</span>
                    </button>
                  )}
                  {hasCustomPriceRange(priceMin, priceMax) && (
                    <button
                      type="button"
                      onClick={() =>
                        updatePriceRange(priceBounds.min, priceBounds.max)
                      }
                      className="max-w-full rounded-full bg-gray-100 px-3 py-2 text-xs font-extrabold"
                    >
                      <span className="block truncate">
                        {formatPriceRangeLabel(priceMin, priceMax)}
                      </span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => clearSearchFilters()}
                    className="max-w-full rounded-full bg-gray-100 px-3 py-2 text-xs font-extrabold"
                  >
                    {t("clear")}
                  </button>
                </div>
              )}
            </div>

            {results.length > 0 ? (
              <div className="grid w-full min-w-0 max-w-full grid-cols-[repeat(2,minmax(0,1fr))] gap-3 md:grid-cols-3 md:gap-5">
                {results.map((experience) => (
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
            ) : (
              <div className="grid min-h-64 place-items-center rounded-3xl bg-gray-100 px-6 text-center">
                <div>
                  <p className="text-xl font-extrabold">{t("noResults")}</p>
                  <p className="mt-2 text-sm font-semibold text-gray-500">
                    {t("noSearchResults")}
                  </p>
                </div>
              </div>
            )}
          </section>
        ) : (
          <section className="grid w-full min-w-0 max-w-full gap-4">
            <SearchStepCard
              isOpen={openSearchStep === "where"}
              onToggle={() =>
                setOpenSearchStep(openSearchStep === "where" ? null : "where")
              }
              summary={selectedLocation || text("Cerca")}
              title={text("Donde")}
            >
              <div className="flex h-12 items-center gap-3 rounded-2xl border border-gray-300 bg-white px-4">
                <MagnifyingGlassIcon className="size-5 shrink-0 text-gray-600" />
                <input
                  value={selectedLocation}
                  onChange={(event) => setSelectedLocation(event.target.value)}
                  placeholder={t("startTyping")}
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-gray-500"
                />
              </div>
              <p className="mt-4 text-xs font-semibold text-gray-600">
                {text("Destinos sugeridos")}
              </p>
              <div className="mt-2 grid gap-2">
                {suggestedDestinations.map((destination) => {
                  const Icon = destination.icon;

                  return (
                    <button
                      key={destination.title}
                      type="button"
                      onClick={() => setSelectedLocation(destination.value)}
                      className={`grid grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-3 rounded-2xl p-1 text-left transition hover:bg-gray-50 active:scale-[0.99] ${
                        selectedLocation === destination.value
                          ? "bg-gray-50"
                          : ""
                      }`}
                    >
                      <span className="grid size-12 place-items-center rounded-2xl bg-sky-50 text-sky-600">
                        <Icon className="size-6" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-extrabold text-gray-950">
                          {text(destination.title)}
                        </span>
                        <span className="block truncate text-xs font-semibold text-gray-500">
                          {text(destination.description)}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </SearchStepCard>

            <SearchStepCard
              isOpen={openSearchStep === "when"}
              onToggle={() =>
                setOpenSearchStep(openSearchStep === "when" ? null : "when")
              }
              summary={activeDateLabel}
              title={text("Cuando")}
            >
                <div className="grid grid-cols-2 gap-2">
                  {dateFilterOptions.map((date) => {
                    const label = date ? text(date) : t("allDates");
                    const isActive = date === activeDate && !dateStart;

                    return (
                      <button
                        key={date || "all"}
                        type="button"
                        onClick={() => selectDate(date)}
                        className={`min-w-0 rounded-2xl border px-3 py-2.5 text-left text-xs font-extrabold transition active:scale-[0.99] ${
                          isActive
                            ? "border-gray-950 bg-gray-950 text-white"
                            : "border-gray-100 bg-gray-50 text-gray-700"
                        }`}
                      >
                        <span className="block truncate">{label}</span>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setIsInlineDateOpen((current) => !current)}
                  className={`mt-2 flex w-full items-center justify-between rounded-2xl border px-3 py-2.5 text-left text-xs font-extrabold transition active:scale-[0.99] ${
                    dateStart
                      ? "border-gray-950 bg-gray-950 text-white"
                      : "border-gray-100 bg-gray-50 text-gray-700"
                  }`}
                >
                  <span>{t("customDates")}</span>
                  <span
                    className={`ml-3 min-w-0 truncate text-xs ${
                      dateStart ? "text-white/75" : "text-gray-500"
                    }`}
                  >
                    {dateStart ? activeDateLabel : t("from")}
                  </span>
                </button>
                <div
                  className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out ${
                    isInlineDateOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0">
                    <div className="mt-3 rounded-[1.25rem] bg-gray-50 p-3">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <label className="grid gap-1 text-xs font-bold text-gray-500">
                          {t("from")}
                          <input
                            type="date"
                            value={inlineStartDate}
                            onChange={(event) => {
                              const nextStartDate = event.target.value;
                              setInlineStartDate(nextStartDate);
                              if (nextStartDate > inlineEndDate) {
                                setInlineEndDate(nextStartDate);
                              }
                            }}
                            className="h-11 min-w-0 rounded-2xl bg-white px-3 text-sm font-extrabold text-gray-950 outline-none ring-1 ring-gray-100"
                          />
                        </label>
                        <label className="grid gap-1 text-xs font-bold text-gray-500">
                          {t("to")}
                          <input
                            type="date"
                            value={inlineEndDate}
                            min={inlineStartDate}
                            onChange={(event) =>
                              setInlineEndDate(event.target.value)
                            }
                            className="h-11 min-w-0 rounded-2xl bg-white px-3 text-sm font-extrabold text-gray-950 outline-none ring-1 ring-gray-100"
                          />
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          applyCustomDateRange(inlineStartDate, inlineEndDate)
                        }
                        className="mt-3 w-full rounded-full bg-gray-950 px-4 py-3 text-sm font-extrabold text-white transition active:scale-[0.98]"
                      >
                        {t("applyDates")}
                      </button>
                    </div>
                  </div>
                </div>
            </SearchStepCard>

            <SearchStepCard
              isOpen={openSearchStep === "filters"}
              onToggle={() =>
                setOpenSearchStep(openSearchStep === "filters" ? null : "filters")
              }
              summary={ t("filters") }
              title={t("filters")}
            >
              <div className="grid gap-5">
                <CompactFilterSection title={text("Recomendado para tu viaje")}>
                  <FilterChoiceGrid
                    activeFilters={activeFilters}
                    filters={recommendedTourFilters}
                    onSelectFilter={selectFilter}
                    text={text}
                  />
                </CompactFilterSection>
                <CompactFilterSection title={text("Servicios del tour")}>
                  <FilterChoiceGrid
                    activeFilters={activeFilters}
                    filters={tourServiceFilters}
                    onSelectFilter={selectFilter}
                    text={text}
                  />
                </CompactFilterSection>
                <CompactFilterSection title={text("Opciones de reserva")}>
                  <FilterChoiceGrid
                    activeFilters={activeFilters}
                    filters={bookingOptionFilters}
                    onSelectFilter={selectFilter}
                    text={text}
                  />
                </CompactFilterSection>
                <CompactFilterSection title={t("commonFilters")}>
                  <FilterChoiceGrid
                    activeFilters={activeFilters}
                    filters={filterPills}
                    onSelectFilter={selectFilter}
                    text={text}
                  />
                </CompactFilterSection>
              </div>
            </SearchStepCard>

            <SearchStepCard
              isOpen={openSearchStep === "price"}
              onToggle={() =>
                setOpenSearchStep(openSearchStep === "price" ? null : "price")
              }
              summary={formatPriceRangeLabel(priceMin, priceMax)}
              title={text("Rango de precio")}
            >
              <PriceRangeControl
                max={priceBounds.max}
                min={priceBounds.min}
                onChange={updatePriceRange}
                step={priceBounds.step}
                text={text}
                valueMax={priceMax}
                valueMin={priceMin}
              />
            </SearchStepCard>

            <div className="grid grid-cols-1 gap-3">
            </div>
                
            <SearchGroup title={t("commonCategories")}>
              <div className="grid w-full min-w-0 max-w-full grid-cols-2 gap-3 md:grid-cols-3">
                {categoryTiles.map((category) => (
                  <CategoryFilterButton
                    key={category.label}
                    image={category.image}
                    isActive={activeFilters.includes(category.label)}
                    label={text(category.label)}
                    onClick={() => searchByCategory(category.label)}
                  />
                ))}
              </div>
            </SearchGroup>

            <SearchGroup title={t("tourSuggestions")}>
              <div className="grid w-full min-w-0 max-w-full gap-3">
                {experiences.slice(0, 3).map((experience) => (
                  <SuggestionRow
                    key={experience.id}
                    experience={experience}
                    language={language}
                  />
                ))}
              </div>
            </SearchGroup>
          </section>
        )}
      </div>

      {/* Fixed bottom action bar (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 border-t border-gray-100 p-3 backdrop-blur-sm md:hidden">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <button
            type="button"
            onClick={() => {
              clearSearchFilters();
              setIsFilterOpen(false);
            }}
            className="rounded-full bg-gray-100 px-4 py-3 text-sm font-extrabold text-gray-700 transition active:scale-[0.98]"
          >
            {t("clear")}
          </button>
          <button
            type="button"
            onClick={() =>
              submitSearch(
                query,
                activeFilters,
                activeDate,
                dateStart,
                dateEnd,
                selectedLocation,
                priceMin,
                priceMax,
                true,
              )
            }
            className="ml-auto rounded-full bg-gray-950 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-gray-950/10 transition active:scale-[0.98]"
          >
            {t("seeResults")}
          </button>
        </div>
      </div>

      <div className="h-28 md:hidden" />

      <SearchFilterSheet
        isOpen={isFilterOpen}
        activeFilters={activeFilters}
        activeDate={activeDate}
        dateStart={dateStart}
        dateEnd={dateEnd}
        onClose={() => setIsFilterOpen(false)}
        onSelectFilter={selectFilter}
        onSelectDate={selectDate}
        onApplyCustomDateRange={applyCustomDateRange}
        priceMin={priceMin}
        priceMax={priceMax}
        onPriceChange={updatePriceRange}
        onClearFilters={clearSearchFilters}
        onSeeResults={() =>
          submitSearch(
            query,
            activeFilters,
            activeDate,
            dateStart,
            dateEnd,
            selectedLocation,
            priceMin,
            priceMax,
            true,
          )
        }
      />
    </main>
  );
}

