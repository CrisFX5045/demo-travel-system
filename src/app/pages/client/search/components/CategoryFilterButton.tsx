export function CategoryFilterButton({
  image,
  isActive,
  label,
  onClick,
}: {
  image: string;
  isActive: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-0 items-center gap-2.5 rounded-[1.1rem] border p-2 text-left shadow-sm transition active:scale-[0.99] ${
        isActive
          ? "border-gray-950 bg-gray-950 text-white shadow-gray-950/10"
          : "border-gray-100 bg-white text-gray-950 shadow-gray-200/60"
      }`}
    >
      <img
        src={image}
        alt=""
        className="size-10 shrink-0 rounded-2xl object-cover"
      />
      <span className="block min-w-0 truncate text-xs font-extrabold">
        {label}
      </span>
    </button>
  );
}
