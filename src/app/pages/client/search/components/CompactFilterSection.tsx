import type { ReactNode } from "react";

export function CompactFilterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-extrabold text-gray-500">{title}</h3>
      {children}
    </section>
  );
}
