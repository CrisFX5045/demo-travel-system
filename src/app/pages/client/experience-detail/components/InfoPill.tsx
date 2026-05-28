import type { ElementType } from "react";

export function InfoPill({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-gray-100 p-4">
      <Icon className="size-5 text-gray-500" />
      <p className="mt-3 text-xs font-bold uppercase text-gray-500">{label}</p>
      <p className="mt-1 line-clamp-2 text-sm font-extrabold">{value}</p>
    </div>
  );
}
