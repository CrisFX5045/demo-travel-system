import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";

import { useApiResource } from "@/app/api/hooks";
import {
  CLIENT_SESSION_EVENT,
  hasClientAccessToken,
} from "@/app/api/session";
import { publicApi } from "@/app/api/services";
import type { Experience } from "@/app/data/tourism";
import { experiences, provinces } from "@/app/data/tourism";
import {
  BottomNav,
  CategoryRail,
  CategoryTabs,
  ClientHeader,
  CompanyTourBlock,
  DesktopSidebar,
  ExperienceCard,
  FeedPreviewSection,
  FilterRail,
  HorizontalExperienceSkeletons,
  MapPreviewSection,
  MobileDrawer,
  PromotionsSection,
  SectionHeader,
  TourCard,
} from "./components";
import {
  categoryTiles,
  desktopSidebarItems,
  filterPills,
  navItems,
  tabs,
  type PopularTour,
} from "./content";
import { groupExperiencesByCompany } from "./company";
import { useFeedReactions } from "./feed/hooks/useFeedReactions";
import { useScrollChrome } from "./hooks/useScrollChrome";
import { useClientI18n } from "./i18n";

export default function ClientHome() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1280px)").matches,
  );
  const { isBottomNavVisible, isMobileHeaderVisible } = useScrollChrome();
  const { liked, toggleLiked } = useFeedReactions();
  const { t, text } = useClientI18n();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => hasClientAccessToken(),
  );
  const [selectedProvince, setSelectedProvince] = useState<string>(
    t("anyLocation"),
  );
  const [activeClientType, setActiveClientType] = useState("Tours");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const {
    data: apiExperiences,
    isLoading: isExperiencesLoading,
  } = useApiResource(() => publicApi.getExperiences(), []);
  const sourceExperiences = useMemo(
    () => (apiExperiences && apiExperiences.length > 0 ? apiExperiences : experiences),
    [apiExperiences],
  );
  const featuredExperience = sourceExperiences[0];
  const visibleExperiences = getHomeExperiences(activeClientType, sourceExperiences);
  const popularTours = getPopularTours(sourceExperiences);
  const companyGroups = groupExperiencesByCompany(visibleExperiences);
  const sectionTitle = getHomeSectionTitle(activeClientType);
  const authAwareNavItems = useMemo(
    () => getAuthAwareNavItems(navItems, isAuthenticated),
    [isAuthenticated],
  );
  const authAwareSidebarItems = useMemo(
    () =>
      isAuthenticated
        ? desktopSidebarItems.filter(
            (item) => item !== "Registrate" && item !== "Iniciar sesion",
          )
        : desktopSidebarItems,
    [isAuthenticated],
  );

  const closeMenu = () => setIsMenuOpen(false);
  const applyFilters = (filters: {
    type: string;
    category: string;
    province: string;
    keyword: string;
  }) => {
    const params = new URLSearchParams();

    if (filters.type) params.set("type", filters.type);
    if (filters.category) params.set("category", filters.category);
    if (filters.province && filters.province !== t("anyLocation")) {
      params.set("province", filters.province);
    }
    if (filters.keyword) params.set("q", filters.keyword);

    setIsFilterSheetOpen(false);
    navigate(`/client/explore?${params.toString()}`);
  };

  useEffect(() => {
    const syncAuthStatus = () => {
      setIsAuthenticated(hasClientAccessToken());
    };

    window.addEventListener(CLIENT_SESSION_EVENT, syncAuthStatus);

    return () => {
      window.removeEventListener(CLIENT_SESSION_EVENT, syncAuthStatus);
    };
  }, []);

  return (
    <main
      id="home"
      className="min-h-screen w-full max-w-[100svw] overflow-x-hidden bg-white pb-[calc(5.8rem+env(safe-area-inset-bottom))] text-gray-950 dark:bg-white"
    >
      <ClientHeader
        isAuthenticated={isAuthenticated}
        isMenuOpen={isMenuOpen}
        isMobileHeaderVisible={isMobileHeaderVisible}
        onToggleDesktopMenu={() => setIsMenuOpen((current) => !current)}
        onOpenMobileMenu={() => setIsMenuOpen(true)}
      />
      <div className="h-[8.63rem] lg:h-[5.65rem]" />

      <MobileDrawer
        isOpen={isMenuOpen}
        navItems={authAwareNavItems}
        provinces={provinces}
        selectedProvince={selectedProvince}
        isAuthenticated={isAuthenticated}
        onSelectProvince={setSelectedProvince}
        onClose={closeMenu}
      />

      <DesktopSidebar
        isOpen={isMenuOpen}
        items={authAwareSidebarItems}
        isAuthenticated={isAuthenticated}
      />

      <div
        className={`mx-auto w-full max-w-[100svw] overflow-x-hidden transition-[padding] duration-200 xl:max-w-[116rem] ${
          isMenuOpen ? "xl:pl-64" : "xl:pl-0"
        }`}
      >
        <CategoryTabs
          tabs={tabs}
          activeTab={activeClientType}
          onSelectTab={setActiveClientType}
        />
        <CategoryRail categories={categoryTiles} activeType={activeClientType} />
        <FilterRail
          filters={filterPills}
          activeType={activeClientType}
          onOpenFilters={() => setIsFilterSheetOpen(true)}
        />

        {activeClientType === "Tours" && (
          <section className="px-4 pb-8 pt-1 md:px-8 md:pb-10 md:pt-0">
            <SectionHeader
            title={text(sectionTitle)}
              to="/client/explore?type=Tours&tag=Jaco"
            />
            <div className="flex max-w-full gap-4 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-5 md:overflow-visible lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
              {isExperiencesLoading ? (
                <HorizontalExperienceSkeletons />
              ) : popularTours.map((tour) => (
                <TourCard
                  key={tour.title}
                  tour={tour}
                  isLiked={Boolean(liked[tour.id])}
                  onToggleLiked={() => toggleLiked(tour.id)}
                />
              ))}
            </div>
          </section>
        )}

        <section className="px-4 pb-8 md:px-8 md:pb-10">
          <SectionHeader
            title={`${text(activeClientType)} ${t("recommendedForNextTrip")}`}
            subtitle={t("recommendedSubtitle")}
            to={`/client/explore?type=${encodeURIComponent(activeClientType)}`}
          />
          <div className="flex max-w-full gap-4 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-5 md:overflow-visible lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
            {isExperiencesLoading ? (
              <HorizontalExperienceSkeletons />
            ) : visibleExperiences.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                isLiked={Boolean(liked[experience.id])}
                onToggleLiked={() => toggleLiked(experience.id)}
              />
            ))}
          </div>
        </section>

        <PromotionsSection experiences={sourceExperiences} />
        <section className="px-4 pb-8 md:px-8 md:pb-10">
          <SectionHeader
            title={t("companiesWithTours")}
            subtitle={t("companiesWithToursSubtitle")}
            to={`/client/explore?type=${encodeURIComponent(activeClientType)}&view=companies`}
          />
          <div className="divide-y divide-gray-100">
            {companyGroups.map((group) => (
              <CompanyTourBlock
                key={group.company}
                group={group}
                liked={liked}
                onToggleLiked={toggleLiked}
                returnTo="/client"
              />
            ))}
          </div>
        </section>
        {featuredExperience ? (
          <FeedPreviewSection experience={featuredExperience} />
        ) : null}
        <MapPreviewSection />
      </div>

      <BottomNav
        isVisible={isBottomNavVisible}
        navItems={authAwareNavItems}
      />
      <ClientFilterSheet
        isOpen={isFilterSheetOpen}
        activeType={activeClientType}
        selectedProvince={selectedProvince}
        onClose={() => setIsFilterSheetOpen(false)}
        onApply={applyFilters}
      />
    </main>
  );
}

function getAuthAwareNavItems(
  items: typeof navItems,
  isAuthenticated: boolean,
) {
  if (isAuthenticated) return items;

  return items.map((item) =>
    item.label === "Perfil" || item.label === "Favoritos"
      ? { ...item, href: "/client/login" }
      : item,
  );
}

function getHomeExperiences(activeType: string, sourceExperiences: Experience[]) {
  if (activeType === "Servicios") {
    return sourceExperiences.filter((experience) =>
      ["Cultura", "Playa", "Wellness"].includes(experience.category),
    );
  }

  if (activeType === "Experiencias") {
    return sourceExperiences.filter((experience) =>
      ["Naturaleza", "Cultura"].includes(experience.category),
    );
  }

  return sourceExperiences.filter((experience) =>
    ["Aventura", "Playa", "Naturaleza", "Wellness"].includes(
      experience.category,
    ),
  );
}

function getPopularTours(sourceExperiences: Experience[]): PopularTour[] {
  return sourceExperiences.slice(0, 4).map((experience) => ({
    id: experience.id,
    title: experience.title,
    company: experience.company,
    location: `${experience.zone}, ${experience.province}`,
    price: `Desde ${new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: experience.priceCurrency,
      maximumFractionDigits: 0,
    }).format(experience.price)} por persona`,
    rating: String(experience.rating || "Nuevo"),
    image: experience.image,
  }));
}

function getHomeSectionTitle(activeType: string) {
  if (activeType === "Servicios") return "Servicios populares para viajeros";
  if (activeType === "Experiencias") return "Experiencias destacadas";
  return "Tours populares cerca de Jaco";
}

function ClientFilterSheet({
  isOpen,
  activeType,
  selectedProvince,
  onClose,
  onApply,
}: {
  isOpen: boolean;
  activeType: string;
  selectedProvince: string;
  onClose: () => void;
  onApply: (filters: {
    type: string;
    category: string;
    province: string;
    keyword: string;
  }) => void;
}) {
  const { t, text } = useClientI18n();
  const initialProvince =
    selectedProvince === t("anyLocation") ? "" : selectedProvince;
  const [type, setType] = useState(activeType);
  const [category, setCategory] = useState("");
  const [province, setProvince] = useState(initialProvince);
  const [keyword, setKeyword] = useState("");

  const clearFilters = () => {
    setType(activeType);
    setCategory("");
    setProvince(initialProvince);
    setKeyword("");
  };

  useEffect(() => {
    if (!isOpen) return;

    setType(activeType);
    setProvince(initialProvince);
  }, [activeType, initialProvince, isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-[visibility] duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <button
        type="button"
        onClick={onClose}
        className={`absolute inset-0 bg-gray-950/35 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Cerrar filtros"
      />
      <section
        className={`absolute inset-x-0 bottom-0 mx-auto max-h-[85svh] w-full max-w-[36rem] overflow-y-auto rounded-t-[2rem] bg-white px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 text-gray-950 shadow-2xl transition-transform duration-300 ease-out md:rounded-3xl ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-gray-200" />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-gray-500">
              {t("advancedSearch")}
            </p>
            <h2 className="text-2xl font-extrabold">{t("filters")}</h2>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-full bg-gray-100 px-4 py-2 text-sm font-extrabold"
          >
            {t("clear")}
          </button>
        </div>

        <div className="mt-5 grid gap-5">
          <FilterGroup title={t("type")}>
            <div className="grid grid-cols-3 gap-2 rounded-full bg-gray-100 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setType(tab.label)}
                  className={`min-w-0 rounded-full px-3 py-2 text-sm font-extrabold transition ${
                    type === tab.label ? "bg-white shadow-sm" : "text-gray-500"
                  }`}
                >
                  <span className="truncate">{text(tab.label)}</span>
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title={t("category")}>
            <div className="flex flex-wrap gap-2">
              {categoryTiles.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    setCategory((current) =>
                      current === item.label ? "" : item.label,
                    )
                  }
                  className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${
                    category === item.label
                      ? "bg-gray-950 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {text(item.label)}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title={t("location")}>
            <select
              value={province}
              onChange={(event) => setProvince(event.target.value)}
              className="h-12 w-full rounded-2xl bg-gray-100 px-4 text-sm font-extrabold outline-none"
            >
              <option value="">{t("allProvinces")}</option>
              {provinces.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </FilterGroup>

          <FilterGroup title={t("keywords")}>
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder={t("keywordPlaceholder")}
              className="h-12 w-full rounded-2xl bg-gray-100 px-4 text-sm font-extrabold outline-none placeholder:text-gray-500"
            />
          </FilterGroup>
        </div>

        <button
          type="button"
          onClick={() => onApply({ type, category, province, keyword })}
          className="mt-6 w-full rounded-full bg-gray-950 px-5 py-3.5 text-sm font-extrabold text-white transition active:scale-[0.98]"
        >
          {t("seeResults")}
        </button>
      </section>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-2 text-sm font-extrabold">{title}</h3>
      {children}
    </section>
  );
}
