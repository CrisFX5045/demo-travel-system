export function Highlight({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm shadow-gray-200/60">
      <p className="text-xs font-bold uppercase text-gray-500">{title}</p>
      <p className="mt-2 text-sm font-extrabold leading-5 text-gray-900">
        {value}
      </p>
    </div>
  );
}
