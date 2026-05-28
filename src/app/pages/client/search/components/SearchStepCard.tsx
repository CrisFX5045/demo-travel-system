import type { ReactNode } from "react";

export function SearchStepCard({
  isOpen,
  onToggle,
  summary,
  title,
  children,
}: {
  isOpen: boolean;
  onToggle: () => void;
  summary?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`rounded-[1.5rem] border bg-white shadow-sm transition ${
        isOpen
          ? "border-gray-200 shadow-gray-200/70"
          : "border-gray-100 shadow-gray-100/70"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between gap-4 px-4 text-left transition active:scale-[0.995] ${
          isOpen ? "pb-3 pt-4" : "py-4"
        }`}
      >
        <h2
          className={`shrink-0 font-extrabold leading-none ${
            isOpen ? "text-base text-gray-950" : "text-sm text-gray-500"
          }`}
        >
          {title}
        </h2>
        {summary ? (
          <span
            className={`min-w-0 truncate text-right font-extrabold ${
              isOpen ? "text-xs text-gray-950" : "text-[0.7rem] text-gray-500"
            }`}
          >
            {summary}
          </span>
        ) : null}
      </button>
      <div
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <div className="px-4 pb-4">{children}</div>
        </div>
      </div>
    </section>
  );
}
