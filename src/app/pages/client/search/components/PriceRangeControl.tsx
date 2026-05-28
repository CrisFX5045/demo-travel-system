import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";

import { formatPriceRangeLabel, normalizePriceRange } from "../utils";

export function PriceRangeControl({
  min,
  max,
  step,
  valueMin,
  valueMax,
  onChange,
  text,
}: {
  min: number;
  max: number;
  step: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  text: (value: string) => string;
}) {
  const [draftMin, setDraftMin] = useState(valueMin);
  const [draftMax, setDraftMax] = useState(valueMax);
  const barRef = useRef<HTMLDivElement | null>(null);
  const normalizedDraft = normalizePriceRange(draftMin, draftMax, min, max, step);
  const clampedMin = normalizedDraft.min;
  const clampedMax = normalizedDraft.max;
  const minPercent = ((clampedMin - min) / (max - min)) * 100;
  const maxPercent = ((clampedMax - min) / (max - min)) * 100;

  useEffect(() => {
    setDraftMin(valueMin);
    setDraftMax(valueMax);
  }, [valueMax, valueMin]);

  const commitRange = () => {
    const nextRange = normalizePriceRange(draftMin, draftMax, min, max, step);
    setDraftMin(nextRange.min);
    setDraftMax(nextRange.max);
    onChange(nextRange.min, nextRange.max);
  };

  const updateMin = (nextValue: number) => {
    const nextMin = Math.min(nextValue, clampedMax - step);
    setDraftMin(Math.max(min, nextMin));
  };

  const updateMax = (nextValue: number) => {
    const nextMax = Math.max(nextValue, clampedMin + step);
    setDraftMax(Math.min(max, nextMax));
  };

  const handleBarClick = (event: PointerEvent<HTMLDivElement>) => {
    if (!barRef.current) return;

    const rect = barRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    const clickedValue = min + (percentage / 100) * (max - min);
    const roundedValue = Math.round(clickedValue / step) * step;
    const distToMin = Math.abs(roundedValue - clampedMin);
    const distToMax = Math.abs(roundedValue - clampedMax);

    if (distToMin < distToMax) {
      updateMin(roundedValue);
    } else {
      updateMax(roundedValue);
    }
  };

  return (
    <div
      className="rounded-[1.5rem] border border-gray-200 bg-white p-4 shadow-sm shadow-gray-200/50"
      onPointerUp={commitRange}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold text-gray-950">
            {text("Precio del tour")}
          </p>
          <p className="mt-1 text-[0.7rem] font-semibold text-gray-500">
            {text("Rango aproximado por persona")}
          </p>
        </div>
        <p className="shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-[0.7rem] font-extrabold text-gray-700">
          {formatPriceRangeLabel(clampedMin, clampedMax)}
        </p>
      </div>

      <div
        className="relative mx-1 h-8"
        ref={barRef}
        onPointerDown={handleBarClick}
      >
        <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gray-100" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gray-950"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={clampedMin}
          onChange={(event) => updateMin(Number(event.target.value))}
          onKeyUp={commitRange}
          onPointerUp={commitRange}
          onTouchEnd={commitRange}
          className="pointer-events-none absolute inset-x-0 top-1/2 h-8 w-full -translate-y-1/2 appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-gray-950 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-950"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={clampedMax}
          onChange={(event) => updateMax(Number(event.target.value))}
          onKeyUp={commitRange}
          onPointerUp={commitRange}
          onTouchEnd={commitRange}
          className="pointer-events-none absolute inset-x-0 top-1/2 h-8 w-full -translate-y-1/2 appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-gray-950 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-950"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="grid gap-1 text-[0.7rem] font-bold text-gray-500">
          {text("Minimo")}
          <input
            type="number"
            min={min}
            max={clampedMax - step}
            step={step}
            value={clampedMin}
            onChange={(event) => updateMin(Number(event.target.value || min))}
            onBlur={commitRange}
            className="h-11 min-w-0 rounded-2xl border border-gray-200 bg-white px-3 text-xs font-extrabold text-gray-950 outline-none"
          />
        </label>
        <label className="grid gap-1 text-[0.7rem] font-bold text-gray-500">
          {text("Maximo")}
          <input
            type="number"
            min={clampedMin + step}
            max={max}
            step={step}
            value={clampedMax}
            onChange={(event) => updateMax(Number(event.target.value || max))}
            onBlur={commitRange}
            className="h-11 min-w-0 rounded-2xl border border-gray-200 bg-white px-3 text-xs font-extrabold text-gray-950 outline-none"
          />
        </label>
      </div>
    </div>
  );
}
