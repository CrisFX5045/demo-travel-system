import {
  Bars3Icon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router";

import { useClientI18n } from "../i18n";
import { SearchButton } from "./SearchButton";

export function ClientHeader({
  isMenuOpen,
  isMobileHeaderVisible,
  onToggleDesktopMenu,
  onOpenMobileMenu,
}: {
  isMenuOpen: boolean;
  isMobileHeaderVisible: boolean;
  onToggleDesktopMenu: () => void;
  onOpenMobileMenu: () => void;
}) {
  const { t } = useClientI18n();

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 w-full max-w-[100svw] overflow-visible border-b border-gray-100 bg-white transition-transform duration-300 ease-out lg:fixed lg:translate-y-0 ${
        isMobileHeaderVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto hidden max-w-[116rem] items-center gap-7 px-8 py-5 lg:flex">
        <button
          className="rounded-full p-2 hover:bg-gray-100"
          onClick={onToggleDesktopMenu}
          aria-label={isMenuOpen ? t("back") : t("explore")}
        >
          <Bars3Icon className="size-7" />
        </button>
        <Link to="/client" className="text-2xl font-extrabold">
          Costa Rica Experiences
        </Link>
        <div className="ml-4 flex rounded-full bg-gray-100 p-1 text-sm font-bold">
          <button className="rounded-full bg-white px-7 py-2 shadow-sm">
            {t("delivery")}
          </button>
          <button className="px-7 py-2 text-gray-600">{t("pickup")}</button>
        </div>
        <Link
          to="/client/search"
          className="ml-auto flex h-12 min-w-[28rem] max-w-[42rem] flex-1 items-center gap-3 rounded-full bg-gray-100 px-5"
        >
          <MagnifyingGlassIcon className="size-6" />
          <span className="text-base font-semibold text-gray-500">
            {t("searchPlaceholder")}
          </span>
        </Link>
        <Link to="/client/login" className="font-bold">
          {t("signIn")}
        </Link>
        <Link
          to="/client/signup"
          className="rounded-full bg-gray-950 px-5 py-3 font-bold text-white"
        >
          {t("signUp")}
        </Link>
      </div>

      <div className="px-4 pb-3 pt-3 lg:hidden">
        <div className="mb-3 flex items-center justify-between">
          <button
            className="-ml-2 rounded-full p-2"
            onClick={onOpenMobileMenu}
            aria-label={t("explore")}
          >
            <Bars3Icon className="size-6" />
          </button>
          <Link to="/client" className="text-xl font-extrabold">
            CR Trips
          </Link>
          <Link
            to="/login"
            className="rounded-full bg-gray-950 px-3.5 py-2 text-xs font-bold text-white"
          >
            {t("companies")}
          </Link>
        </div>

        <SearchButton />
      </div>
    </header>
  );
}
