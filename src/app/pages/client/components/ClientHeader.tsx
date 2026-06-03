import {
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router";

import { useClientI18n } from "../i18n";
import { SearchButton } from "./SearchButton";

const desktopExploreLinks = [
  { label: "Tours", href: "/client/explore?type=Tours" },
  { label: "Experiencias", href: "/client/explore?type=Experiencias" },
  { label: "Servicios", href: "/client/explore?type=Servicios" },
];

export function ClientHeader({
  isAuthenticated,
  isMenuOpen,
  isMobileHeaderVisible,
  onToggleDesktopMenu,
  onOpenMobileMenu,
}: {
  isAuthenticated: boolean;
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
          className="relative grid size-11 cursor-pointer place-items-center rounded-full transition hover:bg-gray-100 active:scale-95"
          onClick={onToggleDesktopMenu}
          aria-label={isMenuOpen ? t("back") : t("explore")}
          aria-expanded={isMenuOpen}
        >
          <Bars3Icon
            className={`absolute size-7 transition duration-200 ease-out ${
              isMenuOpen
                ? "rotate-90 scale-75 opacity-0"
                : "rotate-0 scale-100 opacity-100"
            }`}
          />
          <XMarkIcon
            className={`absolute size-7 transition duration-200 ease-out ${
              isMenuOpen
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-75 opacity-0"
            }`}
          />
        </button>
        <Link to="/client" className="cursor-pointer text-2xl font-extrabold transition hover:text-green-700">
          TicaTour
        </Link>
        <div className="ml-2 flex rounded-full bg-gray-100 p-1 text-sm font-bold">
          {desktopExploreLinks.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="cursor-pointer rounded-full px-5 py-2 text-gray-600 transition hover:bg-white hover:text-gray-950 hover:shadow-sm active:scale-[0.98]"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <Link
          to="/client/search"
          className="ml-auto flex h-12 min-w-[20rem] max-w-[42rem] flex-1 cursor-pointer items-center gap-3 rounded-full bg-gray-100 px-5 transition hover:bg-gray-200"
        >
          <MagnifyingGlassIcon className="size-6" />
          <span className="text-base font-semibold text-gray-500">
            {t("searchPlaceholder")}
          </span>
        </Link>
        {isAuthenticated ? (
          <Link
            to="/client/profile"
            className="cursor-pointer rounded-full bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-gray-800 active:scale-[0.98]"
          >
            {t("profile")}
          </Link>
        ) : (
          <>
            <Link to="/client/login" className="cursor-pointer font-bold transition hover:text-green-700">
              {t("signIn")}
            </Link>
            <Link
              to="/client/signup"
              className="cursor-pointer rounded-full bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-gray-800 active:scale-[0.98]"
            >
              {t("signUp")}
            </Link>
          </>
        )}
      </div>

      <div className="px-4 pb-3 pt-3 lg:hidden">
        <div className="mb-3 flex items-center justify-between">
          <button
            className="-ml-2 cursor-pointer rounded-full p-2 transition hover:bg-gray-100 active:scale-95"
            onClick={onOpenMobileMenu}
            aria-label={t("explore")}
          >
            <Bars3Icon className="size-6" />
          </button>
          <Link to="/client" className="text-xl font-extrabold">
            CR Trips
          </Link>
          {isAuthenticated ? (
            <span className="size-8" aria-hidden="true" />
          ) : (
            <Link
              to="/client/login"
              className="rounded-full bg-gray-950 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-gray-800 active:scale-[0.98]"
            >
              {t("signIn")}
            </Link>
          )}
        </div>

        <SearchButton />
      </div>
    </header>
  );
}
