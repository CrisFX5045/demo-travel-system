import { CalendarDaysIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { categoryTiles } from "../../content";
import { useClientI18n } from "../../i18n";
import {
  bookingOptionFilters,
  dateFilterOptions,
  priceBounds,
  recommendedTourFilters,
  tourServiceFilters,
} from "../constants";
import { getTodayInputValue } from "../utils";
import { FilterChoiceGrid } from "./FilterChoiceGrid";
import { PriceRangeControl } from "./PriceRangeControl";

export function SearchFilterSheet({
  isOpen,
  activeFilters,
  activeDate,
  dateStart,
  dateEnd,
  onClose,
  onSelectFilter,
  onSelectDate,
  onApplyCustomDateRange,
  priceMin,
  priceMax,
  onPriceChange,
  onClearFilters,
  onSeeResults,
}: {
  isOpen: boolean;
  activeFilters: string[];
  activeDate: string;
  dateStart: string;
  dateEnd: string;
  onClose: () => void;
  onSelectFilter: (filter: string) => void;
  onSelectDate: (date: string) => void;
  onApplyCustomDateRange: (startDate: string, endDate: string) => void;
  priceMin: number;
  priceMax: number;
  onPriceChange: (min: number, max: number) => void;
  onClearFilters: () => void;
  onSeeResults: () => void;
}) {
  const { t, text } = useClientI18n();
  const [customStartDate, setCustomStartDate] = useState(
    dateStart || getTodayInputValue(),
  );
  const [customEndDate, setCustomEndDate] = useState(
    dateEnd || dateStart || getTodayInputValue(),
  );

  useEffect(() => {
    if (!isOpen) return;

    const nextStartDate = dateStart || getTodayInputValue();
    setCustomStartDate(nextStartDate);
    setCustomEndDate(dateEnd || dateStart || nextStartDate);
  }, [dateEnd, dateStart, isOpen]);

  const applyCustomDate = () => {
    onApplyCustomDateRange(customStartDate, customEndDate);
  };

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
        aria-label={t("back")}
      />
      <section
        className={`absolute inset-x-0 bottom-0 mx-auto flex max-h-[88svh] w-full max-w-[36rem] flex-col overflow-hidden rounded-t-[2.25rem] bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="relative flex h-16 shrink-0 items-center justify-center border-b border-gray-100 px-6">
          <h2 className="text-xl font-extrabold">{t("filters")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 grid size-10 place-items-center rounded-full transition hover:bg-gray-100 active:scale-95"
            aria-label={t("back")}
          >
            <XMarkIcon className="size-6" />
          </button>
        </div>

        <div className="grid gap-8 overflow-y-auto px-6 py-6">
          <FilterSheetGroup
            title={t("date")}
            action={
              activeDate ? (
                <button
                  type="button"
                  onClick={() => onSelectDate(activeDate)}
                  className="text-xs font-extrabold text-gray-500"
                >
                  {t("clear")}
                </button>
              ) : null
            }
          >
            <div className="flex flex-wrap gap-2.5">
              {dateFilterOptions.map((date) => {
                const label = date ? text(date) : t("allDates");
                const isActive = date === activeDate && !dateStart;

                return (
                  <button
                    key={date || "all"}
                    type="button"
                    onClick={() => onSelectDate(date)}
                    className={`inline-flex max-w-full items-center gap-2 rounded-full border px-5 py-3 text-sm font-extrabold transition active:scale-[0.98] ${
                      isActive
                        ? "border-gray-950 bg-gray-950 text-white"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    <CalendarDaysIcon className="size-5 shrink-0" />
                    <span className="block truncate">{label}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 rounded-[1.5rem] border border-gray-200 bg-white p-2 shadow-sm shadow-gray-200/50">
              <p className="mb-3 text-base font-extrabold text-gray-950">
                {t("customDates")}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="grid gap-1 text-xs font-bold text-gray-500">
                  {t("from")}
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(event) => {
                      const nextStartDate = event.target.value;
                      setCustomStartDate(nextStartDate);
                      if (nextStartDate > customEndDate) {
                        setCustomEndDate(nextStartDate);
                      }
                    }}
                    className="h-12 rounded-2xl border border-gray-200 bg-white px-3 text-sm font-extrabold text-gray-950 outline-none"
                  />
                </label>
                <label className="grid gap-1 text-xs font-bold text-gray-500">
                  {t("to")}
                  <input
                    type="date"
                    value={customEndDate}
                    min={customStartDate}
                    onChange={(event) => setCustomEndDate(event.target.value)}
                    className="h-12 rounded-2xl border border-gray-200 bg-white px-3 text-sm font-extrabold text-gray-950 outline-none"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={applyCustomDate}
                className="mt-3 w-full rounded-full bg-gray-950 px-4 py-3 text-sm font-extrabold text-white transition active:scale-[0.98]"
              >
                {t("applyDates")}
              </button>
            </div>
          </FilterSheetGroup>

          <FilterSheetGroup title={text("Tipo de experiencia")}>
            <FilterChoiceGrid
              activeFilters={activeFilters}
              filters={categoryTiles.map((item) => item.label)}
              onSelectFilter={onSelectFilter}
              text={text}
            />
          </FilterSheetGroup>

          <FilterSheetGroup title={text("Recomendado para tu viaje")}>
            <FilterChoiceGrid
              activeFilters={activeFilters}
              filters={recommendedTourFilters}
              onSelectFilter={onSelectFilter}
              text={text}
            />
          </FilterSheetGroup>

          <FilterSheetGroup title={text("Servicios del tour")}>
            <FilterChoiceGrid
              activeFilters={activeFilters}
              filters={tourServiceFilters}
              onSelectFilter={onSelectFilter}
              text={text}
            />
          </FilterSheetGroup>

          <FilterSheetGroup title={text("Rango de precio")}>
            <PriceRangeControl
              max={priceBounds.max}
              min={priceBounds.min}
              onChange={onPriceChange}
              step={priceBounds.step}
              text={text}
              valueMax={priceMax}
              valueMin={priceMin}
            />
          </FilterSheetGroup>

          <FilterSheetGroup title={text("Opciones de reserva")}>
            <FilterChoiceGrid
              activeFilters={activeFilters}
              filters={bookingOptionFilters}
              onSelectFilter={onSelectFilter}
              text={text}
            />
          </FilterSheetGroup>
        </div>

        <div className="grid shrink-0 grid-cols-[auto_1fr] gap-3 border-t border-gray-100 bg-white/95 px-6 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 shadow-[0_-14px_30px_rgba(15,23,42,0.08)] backdrop-blur">
          <button
            type="button"
            onClick={onClearFilters}
            className="rounded-2xl px-5 py-3 text-sm font-extrabold text-gray-400 transition active:scale-[0.98]"
          >
            {t("clear")}
          </button>
          <button
            type="button"
            onClick={() => {
              onSeeResults();
              onClose();
            }}
            className="rounded-2xl bg-gray-950 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-gray-950/15 transition active:scale-[0.98]"
          >
            {t("seeResults")}
          </button>
        </div>
      </section>
    </div>
  );
}

function FilterSheetGroup({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-[1.35rem] font-extrabold leading-tight text-gray-950">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  );
}
