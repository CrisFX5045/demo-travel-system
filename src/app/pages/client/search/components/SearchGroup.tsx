import type { ReactNode } from "react";

export function SearchGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="w-full min-w-0 max-w-full">
      <h2 className="mb-3 text-base font-extrabold leading-tight text-gray-950">
        {title}
      </h2>
      {children}
    </section>
  );
}
