import {
  ArrowRightOnRectangleIcon,
  CheckIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

import { authApi } from "@/app/api/services";
import type { ClientNavItem } from "../content";
import { clientLanguages, useClientI18n } from "../i18n";
import { ClientThemeSwitch } from "./ClientThemeSwitch";

export function DesktopSidebar({
  isOpen,
  navItems,
  provinces,
  selectedProvince,
  isAuthenticated,
  onSelectProvince,
  onClose,
}: {
  isOpen: boolean;
  navItems: ClientNavItem[];
  provinces: string[];
  selectedProvince: string;
  isAuthenticated: boolean;
  onSelectProvince: (province: string) => void;
  onClose: () => void;
}) {
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const provincePickerRef = useRef<HTMLDivElement | null>(null);
  const languagePickerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { language, setLanguage, t, text } = useClientI18n();
  const selectedLanguage =
    clientLanguages.find((item) => item.code === language) ??
    clientLanguages[0];
  const provinceOptions = [t("anyLocation"), ...provinces];

  const selectProvince = (province: string) => {
    onSelectProvince(province);
    setIsProvinceOpen(false);
    onClose();

    if (province === t("anyLocation")) {
      navigate("/client/search");
      return;
    }

    const params = new URLSearchParams({ location: province });
    navigate(`/client/search?${params.toString()}`);
  };

  const logoutClient = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await authApi.logoutClient();
      navigate("/client");
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    if (!isProvinceOpen && !isLanguageOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        isProvinceOpen &&
        provincePickerRef.current &&
        !provincePickerRef.current.contains(event.target as Node)
      ) {
        setIsProvinceOpen(false);
      }

      if (
        isLanguageOpen &&
        languagePickerRef.current &&
        !languagePickerRef.current.contains(event.target as Node)
      ) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [isLanguageOpen, isProvinceOpen]);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 hidden lg:block">
      <aside
        className={`pointer-events-auto absolute bottom-0 left-0 top-[5.65rem] w-[21rem] overflow-y-auto overscroll-contain border-r border-gray-100 bg-white px-5 pb-8 pt-5 shadow-2xl shadow-gray-950/10 transition-transform duration-300 ease-out will-change-transform [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-[calc(100%+1rem)]"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between">
          <Link
            to="/client"
            onClick={onClose}
            className="cursor-pointer text-xl font-extrabold"
          >
            CR Trips
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 cursor-pointer place-items-center rounded-full bg-gray-100 transition hover:bg-gray-200 active:scale-95"
            aria-label={t("back")}
          >
            <XMarkIcon className="size-6" />
          </button>
        </div>

        <div ref={provincePickerRef} className="mt-6 rounded-3xl bg-gray-100 p-4">
          <p className="text-sm font-semibold text-gray-500">
            {t("exploringIn")}
          </p>
          <button
            type="button"
            onClick={() => setIsProvinceOpen((current) => !current)}
            className="mt-1 flex cursor-pointer items-center gap-1 text-xl font-extrabold"
            aria-expanded={isProvinceOpen}
          >
            {selectedProvince}
            <ChevronDownIcon
              className={`size-5 transition-transform ${
                isProvinceOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`grid gap-1 overflow-hidden transition-all duration-150 ease-out ${
              isProvinceOpen
                ? "mt-3 max-h-80 translate-y-0 opacity-100"
                : "mt-0 max-h-0 -translate-y-1 opacity-0"
            }`}
          >
            {provinceOptions.map((province) => {
              const isSelected = province === selectedProvince;

              return (
                <button
                  key={province}
                  type="button"
                  onClick={() => selectProvince(province)}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl px-3 py-2 text-sm font-extrabold transition ${
                    isSelected
                      ? "bg-gray-950 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {province}
                  {isSelected && <CheckIcon className="size-4" />}
                </button>
              );
            })}
          </div>
        </div>

        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const className =
              "flex cursor-pointer items-center gap-4 rounded-2xl px-4 py-3 text-base font-extrabold text-gray-700 transition hover:bg-gray-100";
            const content = (
              <>
                <item.icon className="size-6" />
                {text(item.label)}
              </>
            );

            return item.href.startsWith("#") ? (
              <a
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={className}
              >
                {content}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.href}
                onClick={onClose}
                className={className}
              >
                {content}
              </Link>
            );
          })}
        </nav>

        <div className="mt-5 border-t border-gray-100 pt-4 dark:border-dark-600">
          <ClientThemeSwitch />
        </div>

        {isAuthenticated && (
          <div className="mt-3 border-t border-gray-100 pt-3">
            <button
              type="button"
              disabled={isLoggingOut}
              onClick={() => {
                void logoutClient();
              }}
              className={`flex w-full cursor-pointer items-center gap-4 rounded-2xl px-4 py-3 text-base font-extrabold text-red-600 transition hover:bg-red-50 ${
                isLoggingOut ? "cursor-wait opacity-75" : ""
              }`}
            >
              <ArrowRightOnRectangleIcon className="size-6" />
              {isLoggingOut ? (
                <LogoutLoadingLabel label="Cerrando sesion" />
              ) : (
                "Cerrar sesion"
              )}
            </button>
          </div>
        )}

        {!isAuthenticated && (
          <div className="mt-6 border-t border-gray-100 pt-5">
            <Link
              to="/client/signup"
              onClick={onClose}
              className="block cursor-pointer rounded-full bg-gray-950 px-5 py-3 text-center text-sm font-extrabold text-white transition hover:bg-gray-800 active:scale-[0.98]"
            >
              {t("signUp")}
            </Link>
            <Link
              to="/client/login"
              onClick={onClose}
              className="mt-3 block cursor-pointer rounded-full bg-gray-100 px-5 py-3 text-center text-sm font-extrabold text-gray-950 transition hover:bg-gray-200 active:scale-[0.98]"
            >
              {t("signIn")}
            </Link>
          </div>
        )}

        <div
          ref={languagePickerRef}
          className="relative mt-5 border-t border-gray-100 pt-4"
        >
          <p className="px-1 text-xs font-bold uppercase text-gray-500">
            {t("language")}
          </p>
          <div
            className={`absolute inset-x-0 bottom-[3.35rem] z-10 grid max-h-48 gap-1 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl shadow-gray-950/10 transition-[opacity,transform,visibility] duration-150 ease-out [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              isLanguageOpen
                ? "visible translate-y-0 opacity-100"
                : "invisible translate-y-1 opacity-0"
            }`}
          >
            {clientLanguages.map((item) => {
              const isSelected = item.code === language;

              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLanguage(item.code);
                    setIsLanguageOpen(false);
                  }}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl px-3 py-2 text-sm font-extrabold transition ${
                    isSelected
                      ? "bg-gray-950 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <img
                      src={item.flag}
                      alt=""
                      className="size-6 shrink-0 rounded-full"
                    />
                    {item.label}
                  </span>
                  {isSelected && <CheckIcon className="size-4" />}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setIsLanguageOpen((current) => !current)}
            className="mt-2 flex w-full cursor-pointer items-center justify-between gap-2 rounded-2xl bg-gray-100 px-3.5 py-2.5 text-left text-sm font-extrabold text-gray-950 transition hover:bg-gray-200"
            aria-expanded={isLanguageOpen}
          >
            <span className="flex min-w-0 items-center gap-2">
              <img
                src={selectedLanguage.flag}
                alt=""
                className="size-7 shrink-0 rounded-full shadow-sm"
              />
              <span className="truncate">{selectedLanguage.label}</span>
            </span>
            <ChevronDownIcon
              className={`size-4 shrink-0 transition-transform ${
                isLanguageOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <div className="mt-5 border-t border-gray-100 pt-4 text-center">
          <Link
            to="/login"
            onClick={onClose}
            className="inline-flex cursor-pointer items-center justify-center rounded-full px-3 py-1.5 text-xs font-bold text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            {t("companyLogin")}
          </Link>
          <p className="mx-auto mt-2 max-w-[16rem] text-[0.68rem] font-medium leading-4 text-gray-400">
            {t("companyAccessHint")}
          </p>
        </div>
      </aside>
    </div>
  );
}

function LogoutLoadingLabel({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span>{label}</span>
      <span className="inline-flex items-center gap-1" aria-hidden="true">
        <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-240ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-120ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-current" />
      </span>
    </span>
  );
}
