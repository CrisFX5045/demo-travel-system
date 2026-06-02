import {
  CheckIcon,
  ChevronDownIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import { clientLanguages, useClientI18n } from "../i18n";

export function DesktopSidebar({
  isOpen,
  items,
  isAuthenticated,
}: {
  isOpen: boolean;
  items: string[];
  isAuthenticated: boolean;
}) {
  const { language, setLanguage, t, text } = useClientI18n();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languagePickerRef = useRef<HTMLDivElement | null>(null);
  const selectedLanguage =
    clientLanguages.find((item) => item.code === language) ??
    clientLanguages[0];

  useEffect(() => {
    if (!isLanguageOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
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
  }, [isLanguageOpen]);

  return (
    <aside
      className={`fixed bottom-0 left-0 top-[5.7rem] z-20 hidden w-64 border-r border-gray-100 bg-white px-4 py-6 transition-transform duration-200 xl:block ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {items.map((item, index) => {
        const href = getSidebarHref(item, index, isAuthenticated);
        const className = `mb-1 flex items-center gap-4 px-4 py-3 text-base font-bold ${
          index === 0
            ? "border-l-4 border-gray-950 bg-gray-100"
            : "text-gray-600"
        }`;
        const content = (
          <>
            <HomeIcon className="size-6" />
            {text(item)}
          </>
        );

        return href.startsWith("/") ? (
          <Link key={item} to={href} className={className}>
            {content}
          </Link>
        ) : (
          <a key={item} href={href} className={className}>
            {content}
          </a>
        );
      })}
      <div
        ref={languagePickerRef}
        className="relative mt-6 border-t border-gray-100 px-4 pt-5"
      >
        <p className="text-xs font-bold uppercase text-gray-500">
          {t("language")}
        </p>
        <div
          className={`absolute inset-x-4 bottom-[3.35rem] z-10 grid max-h-48 gap-1 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl shadow-gray-950/10 transition-[opacity,transform,visibility] duration-150 ease-out [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
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
                className={`flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-extrabold transition ${
                  isSelected
                    ? "bg-gray-950 text-white"
                    : "bg-gray-100 text-gray-700"
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
          className="mt-2 flex w-full items-center justify-between rounded-2xl bg-gray-100 px-3.5 py-2.5 text-sm font-extrabold text-gray-950"
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
    </aside>
  );
}

function getSidebarHref(item: string, index: number, isAuthenticated: boolean) {
  if (index === 0) return "#home";
  if (item === "Favoritos") {
    return isAuthenticated ? "/client/favorites" : "/client/login";
  }
  if (item === "Registrate") return "/client/signup";
  if (item === "Iniciar sesion") return "/client/login";
  return "#";
}
